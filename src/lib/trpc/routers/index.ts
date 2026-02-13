import { router } from "../server";
import { appointmentsRouter } from "./appointments";
import { servicesRouter } from "./services";
import { barbersRouter } from "./barbers";
import { clientsRouter } from "./clients";
import { blocksRouter } from "./blocks";
import { settingsRouter } from "./settings";
import { analyticsRouter } from "./analytics";

export const appRouter = router({
  appointments: appointmentsRouter,
  services: servicesRouter,
  barbers: barbersRouter,
  clients: clientsRouter,
  blocks: blocksRouter,
  settings: settingsRouter,
  analytics: analyticsRouter,
});

export type AppRouter = typeof appRouter;
