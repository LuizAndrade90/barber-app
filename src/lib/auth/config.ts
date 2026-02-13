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
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 horas
  },
  pages: {
    signIn: "/login",
    newUser: "/registro",
  },
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      // Verificar se usuario existe
      const existingUser = await db.query.usuarios.findFirst({
        where: eq(usuarios.email, user.email),
      });

      if (existingUser) {
        // Verificar se usuario esta ativo
        if (!existingUser.ativo) return false;

        // Atualizar ultimo login
        await db
          .update(usuarios)
          .set({ ultimoLogin: new Date() })
          .where(eq(usuarios.id, existingUser.id));

        return true;
      }

      // Primeiro login - criar barbearia e usuario
      // Gerar slug seguro (nao sequencial/adivinhavel)
      const slugBase = (user.name || "barbearia")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      const slugSuffix = Math.random().toString(36).substring(2, 8);
      const slug = `${slugBase}-${slugSuffix}`;

      const [novaBarbearia] = await db
        .insert(barbearias)
        .values({
          nome: `Barbearia de ${user.name || "Novo Usuário"}`,
          slug,
        })
        .returning();

      await db.insert(usuarios).values({
        barbeariaId: novaBarbearia.id,
        nome: user.name || "Novo Usuário",
        email: user.email,
        emailVerificado: new Date(),
        image: user.image,
        role: "owner",
        ultimoLogin: new Date(),
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
