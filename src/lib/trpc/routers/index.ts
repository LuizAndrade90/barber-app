import { router } from "../server";
import { appointmentsRouter } from "./appointments";

export const appRouter = router({
  appointments: appointmentsRouter,
});

export type AppRouter = typeof appRouter;
