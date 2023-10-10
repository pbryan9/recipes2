import { createTRPCReact } from '@trpc/react-query';
import { inferRouterOutputs } from '@trpc/server';
import { type AppRouter } from '../../../api-server/trpc/trpc';

export type RouterOutputs = inferRouterOutputs<AppRouter>;

export const trpc = createTRPCReact<AppRouter>();
