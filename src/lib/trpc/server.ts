import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { Context } from "./context";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;

// Middleware: requer autenticacao
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      session: ctx.session,
      barbeariaId: ctx.session.user.barbeariaId,
    },
  });
});

export const protectedProcedure = t.procedure.use(isAuthed);

// Middleware: requer role especifica
const hasRole = (roles: ("owner" | "manager" | "barber")[]) =>
  t.middleware(({ ctx, next }) => {
    if (!ctx.session?.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    if (!roles.includes(ctx.session.user.role)) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Sem permissão para esta ação",
      });
    }

    return next({
      ctx: {
        session: ctx.session,
        barbeariaId: ctx.session.user.barbeariaId,
      },
    });
  });

export const ownerProcedure = t.procedure.use(hasRole(["owner"]));
export const managerProcedure = t.procedure.use(
  hasRole(["owner", "manager"])
);
