import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/lib/db";
import { usuarios, barbearias } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      barbeariaId: string;
      role: "owner" | "manager" | "barber";
    };
  }

  interface User {
    barbeariaId?: string;
    role?: "owner" | "manager" | "barber";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    barbeariaId?: string;
    role?: "owner" | "manager" | "barber";
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  pages: {
    signIn: "/login",
    newUser: "/registro",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false;

      // Verificar se usuario existe
      const existingUser = await db.query.usuarios.findFirst({
        where: eq(usuarios.email, user.email),
      });

      if (existingUser) {
        return true;
      }

      // Primeiro login - criar barbearia e usuario
      const [novaBarbearia] = await db
        .insert(barbearias)
        .values({
          nome: `Barbearia de ${user.name || "Novo Usuário"}`,
          slug: `barbearia-${Date.now()}`,
        })
        .returning();

      await db.insert(usuarios).values({
        barbeariaId: novaBarbearia.id,
        nome: user.name || "Novo Usuário",
        email: user.email,
        image: user.image,
        role: "owner",
        permissoes: {
          gerenciarEquipe: true,
          gerenciarServicos: true,
          gerenciarClientes: true,
          verRelatorios: true,
          gerenciarConfiguracoes: true,
          gerenciarWhatsApp: true,
        },
      });

      return true;
    },

    async jwt({ token, user }) {
      if (user?.email) {
        const dbUser = await db.query.usuarios.findFirst({
          where: eq(usuarios.email, user.email),
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.barbeariaId = dbUser.barbeariaId;
          token.role = dbUser.role;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.barbeariaId = token.barbeariaId!;
        session.user.role = token.role!;
      }

      return session;
    },
  },
};
