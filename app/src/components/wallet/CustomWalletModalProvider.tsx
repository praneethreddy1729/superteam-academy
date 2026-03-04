"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type FC,
  type ReactNode,
} from "react";
import { CustomWalletModal } from "./CustomWalletModal";

interface WalletModalContextState {
  visible: boolean;
  setVisible: (open: boolean) => void;
}

const WalletModalContext = createContext<WalletModalContextState>({
  visible: false,
  setVisible: () => {},
});

export const CustomWalletModalProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [visible, setVisibleRaw] = useState(false);

  const setVisible = useCallback((open: boolean) => {
    setVisibleRaw(open);
  }, []);

  const value = useMemo(() => ({ visible, setVisible }), [visible, setVisible]);

  return (
    <WalletModalContext.Provider value={value}>
      {children}
      <CustomWalletModal open={visible} onOpenChange={setVisible} />
    </WalletModalContext.Provider>
  );
};

/**
 * Drop-in replacement for `useWalletModal` from @solana/wallet-adapter-react-ui.
 * Returns `{ visible, setVisible }` — same API shape.
 */
export function useWalletModal() {
  return useContext(WalletModalContext);
}
