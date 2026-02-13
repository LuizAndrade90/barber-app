import { getServerSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

export async function createContext(opts: FetchCreateContextFnOptions) {
  const session = await getServerSession();

  return {
    db,
    session,
    barbeariaId: session?.user?.barbeariaId,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
