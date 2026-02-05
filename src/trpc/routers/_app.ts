import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
import { agentsRouter } from '@/modules/agents/server/procedure';
import { agents } from '@/db/schema';
import { meetingRouter } from '@/modules/meetings/server/procedure';
export const appRouter = createTRPCRouter({
  agents: agentsRouter,
  meetings:meetingRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;