import { createTRPCReact } from '@trpc/react-query';
import { type AppRouter } from '../../../api-server/trpc/trpc';

export const trpc = createTRPCReact<AppRouter>();
