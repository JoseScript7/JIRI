import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface SessionContextType {
  sessionId: string | null;
  setSessionId: (id: string) => void;
}

const SessionContext = createContext<SessionContextType | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  return (
    <SessionContext.Provider value={{ sessionId, setSessionId }}>
      {children}
    </SessionContext.Provider>
  );
}

/** Throws if used outside <SessionProvider> */
export function useSession(): SessionContextType {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within <SessionProvider>");
  return ctx;
}
