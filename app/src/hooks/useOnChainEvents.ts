"use client";

import { useEffect, useRef } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { getProgram } from "@/lib/solana/program";
import { PROGRAM_ID } from "@/lib/solana/constants";
import {
  getProgramEventListener,
  type AcademyEvent,
  type AcademyEventCallback,
} from "@/lib/solana/events";

/**
 * useOnChainEvents
 *
 * Subscribes to Academy program log events for the lifetime of the component.
 * Internally uses a singleton ProgramEventListener so multiple component
 * instances share one WebSocket subscription.
 *
 * @param callback - Called for each decoded event. Wrap in useCallback to avoid
 *                   re-subscribing on every render.
 * @param filter   - Optional: only fire callback for these event types.
 */
export function useOnChainEvents(
  callback: AcademyEventCallback,
  filter?: AcademyEvent["type"][]
): void {
  const { connection } = useConnection();
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const setup = async () => {
      const program = await getProgram();
      const listener = getProgramEventListener(connection, PROGRAM_ID, program);
      unsubscribe = listener.subscribe((event) => {
        if (!filter || filter.includes(event.type)) {
          callbackRef.current(event);
        }
      });
    };

    setup().catch(() => {});

    return () => {
      unsubscribe?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connection]);
}
