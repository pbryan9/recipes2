import React, { createContext, useState } from 'react';

type EscButtonProviderProps = {
  children: React.ReactNode;
};

const defaultEscContext: EscButtonContext = [];

type EscButtonContext = string[];

const EscButtonContext = createContext(defaultEscContext);

export default function EscButtonProvider({
  children,
}: EscButtonProviderProps) {
  // Since I have multiple different things that want to listen for the esc button,
  // this context provider is necessary to keep them all aligned & prevent doubling up on
  // event listeners which leads to unexpected "cancellations"

  const [escStack, setEscStack] = useState(defaultEscContext);

  function registerEscListener(fn: () => any): string {
    let listenerId = crypto.randomUUID();

    return listenerId;
  }

  return <div>{children}</div>;
}
