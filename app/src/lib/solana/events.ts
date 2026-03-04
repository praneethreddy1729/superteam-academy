/**
 * On-chain event listener for the Academy program.
 *
 * Subscribes to program logs via Connection.onLogs and decodes Anchor events
 * using the BorshCoder bundled in the program instance. This is an enhancement
 * layer — it complements polling, not replaces it.
 *
 * Key events surfaced:
 *   LessonCompleted, CourseFinalized, CredentialIssued
 */

import type { Connection, PublicKey } from "@solana/web3.js";
import type { Program } from "@coral-xyz/anchor";
import type { Logs } from "@solana/web3.js";

/* ---- Event payload shapes ---- */

export interface LessonCompletedEvent {
  type: "LessonCompleted";
  learner: PublicKey;
  courseId: string;
  lessonIndex: number;
  xpEarned: bigint;
}

export interface CourseFinalizedEvent {
  type: "CourseFinalized";
  learner: PublicKey;
  courseId: string;
  xpEarned: bigint;
}

export interface CredentialIssuedEvent {
  type: "CredentialIssued";
  learner: PublicKey;
  courseId: string;
  credentialAsset: PublicKey;
}

export interface EnrolledEvent {
  type: "Enrolled";
  learner: PublicKey;
  courseId: string;
}

export interface EnrollmentClosedEvent {
  type: "EnrollmentClosed";
  learner: PublicKey;
  courseId: string;
}

export type AcademyEvent =
  | LessonCompletedEvent
  | CourseFinalizedEvent
  | CredentialIssuedEvent
  | EnrolledEvent
  | EnrollmentClosedEvent;

export type AcademyEventCallback = (event: AcademyEvent) => void;

/* ---- Internal Anchor event parser wrapper ---- */

interface AnchorEventParser {
  parseLogs(logs: string[]): Iterable<{ name: string; data: Record<string, unknown> }>;
}

function getEventParser(program: Program): AnchorEventParser {
  // @coral-xyz/anchor ≥ 0.29 exposes EventParser on the coder
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const coder = (program as any).coder;
  if (coder && typeof coder.events?.parseLogs === "function") {
    return coder.events as AnchorEventParser;
  }
  // Fallback: attempt to construct EventParser dynamically
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-require-imports
    const { EventParser } = require("@coral-xyz/anchor");
    return new EventParser(program.programId, coder) as AnchorEventParser;
  } catch {
    // Return a no-op parser — event listening silently degrades
    return { parseLogs: () => [] };
  }
}

/* ---- mapRawEvent: raw Anchor decoded object → typed AcademyEvent ---- */

function mapRawEvent(
  name: string,
  data: Record<string, unknown>
): AcademyEvent | null {
  switch (name) {
    case "LessonCompleted":
      return {
        type: "LessonCompleted",
        learner: data.learner as PublicKey,
        courseId: data.courseId as string,
        lessonIndex: data.lessonIndex as number,
        xpEarned: BigInt(String(data.xpEarned ?? 0)),
      };
    case "CourseFinalized":
      return {
        type: "CourseFinalized",
        learner: data.learner as PublicKey,
        courseId: data.courseId as string,
        xpEarned: BigInt(String(data.xpEarned ?? 0)),
      };
    case "CredentialIssued":
      return {
        type: "CredentialIssued",
        learner: data.learner as PublicKey,
        courseId: data.courseId as string,
        credentialAsset: data.credentialAsset as PublicKey,
      };
    case "Enrolled":
      return {
        type: "Enrolled",
        learner: data.learner as PublicKey,
        courseId: data.courseId as string,
      };
    case "EnrollmentClosed":
      return {
        type: "EnrollmentClosed",
        learner: data.learner as PublicKey,
        courseId: data.courseId as string,
      };
    default:
      return null;
  }
}

/* ---- ProgramEventListener ---- */

export class ProgramEventListener {
  private subscriptionId: number | null = null;
  private readonly callbacks = new Set<AcademyEventCallback>();
  private parser: AnchorEventParser | null = null;

  constructor(
    private readonly connection: Connection,
    private readonly programId: PublicKey,
    private readonly program: Program
  ) {}

  subscribe(callback: AcademyEventCallback): () => void {
    this.callbacks.add(callback);
    if (this.subscriptionId === null) {
      this.start();
    }
    return () => {
      this.callbacks.delete(callback);
      if (this.callbacks.size === 0) {
        this.stop();
      }
    };
  }

  private start(): void {
    this.parser = getEventParser(this.program);
    this.subscriptionId = this.connection.onLogs(
      this.programId,
      (logs: Logs) => {
        if (logs.err) return;
        this.handleLogs(logs.logs);
      },
      "confirmed"
    );
  }

  private stop(): void {
    if (this.subscriptionId !== null) {
      this.connection.removeOnLogsListener(this.subscriptionId).catch(() => {});
      this.subscriptionId = null;
    }
    this.parser = null;
  }

  private handleLogs(logs: string[]): void {
    if (!this.parser) return;
    try {
      for (const { name, data } of this.parser.parseLogs(logs)) {
        const event = mapRawEvent(name, data as Record<string, unknown>);
        if (event) {
          for (const cb of this.callbacks) {
            try {
              cb(event);
            } catch {
              // individual callback errors must not break the listener
            }
          }
        }
      }
    } catch {
      // log parse errors are silently ignored
    }
  }

  destroy(): void {
    this.callbacks.clear();
    this.stop();
  }
}

/* ---- Singleton per programId for the app ---- */

const listenerRegistry = new Map<string, ProgramEventListener>();

export function getProgramEventListener(
  connection: Connection,
  programId: PublicKey,
  program: Program
): ProgramEventListener {
  const key = programId.toBase58();
  if (!listenerRegistry.has(key)) {
    listenerRegistry.set(key, new ProgramEventListener(connection, programId, program));
  }
  return listenerRegistry.get(key)!;
}
