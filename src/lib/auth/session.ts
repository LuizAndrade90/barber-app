import { getServerSession as nextGetServerSession } from "next-auth";
import { authOptions } from "./config";
import { redirect } from "next/navigation";

export async function getServerSession() {
  return nextGetServerSession(authOptions);
}

export async function requireAuth() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/login");
  }

  return session;
}

export async function requireRole(roles: ("owner" | "manager" | "barber")[]) {
  const session = await requireAuth();

  if (!roles.includes(session.user.role)) {
    redirect("/agenda");
  }

  return session;
}
