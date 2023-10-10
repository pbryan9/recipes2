import { ClerkProvider } from '@clerk/clerk-react';
import React from 'react';

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error('Missing Clerk publishable key.');
}

type ClerkProviderComponentProps = {
  children: React.ReactNode;
};

export default function ClerkProviderComponent({
  children,
}: ClerkProviderComponentProps) {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      {children}
    </ClerkProvider>
  );
}
