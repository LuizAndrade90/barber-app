import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";
import { barbearias } from "./tenants";

export const usuarios = pgTable("usuarios", {
  id: uuid("id").defaultRandom().primaryKey(),
  barbeariaId: uuid("barbearia_id")
    .references(() => barbearias.id, { onDelete: "cascade" })
    .notNull(),
  nome: text("nome").notNull(),
  email: text("email").notNull().unique(),
  emailVerificado: timestamp("email_verificado", { withTimezone: true }),
  senha: text("senha"),
  image: text("image"),
  role: text("role", { enum: ["owner", "manager", "barber"] })
    .default("barber")
    .notNull(),
  permissoes: jsonb("permissoes")
    .$type<{
      gerenciarEquipe: boolean;
      gerenciarServicos: boolean;
      gerenciarClientes: boolean;
      verRelatorios: boolean;
      gerenciarConfiguracoes: boolean;
      gerenciarWhatsApp: boolean;
    }>()
    .default({
      gerenciarEquipe: false,
      gerenciarServicos: false,
      gerenciarClientes: false,
      verRelatorios: false,
      gerenciarConfiguracoes: false,
      gerenciarWhatsApp: false,
    }),
  ativo: boolean("ativo").default(true).notNull(),
  ultimoLogin: timestamp("ultimo_login", { withTimezone: true }),
  criadoEm: timestamp("criado_em", { withTimezone: true })
    .defaultNow()
    .notNull(),
  atualizadoEm: timestamp("atualizado_em", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// NextAuth adapter tables
export const accounts = pgTable("accounts", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => usuarios.id, { onDelete: "cascade" })
    .notNull(),
  type: text("type").notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("provider_account_id").notNull(),
  refreshToken: text("refresh_token"),
  accessToken: text("access_token"),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  tokenType: text("token_type"),
  scope: text("scope"),
  idToken: text("id_token"),
  sessionState: text("session_state"),
});

export const sessions = pgTable("sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionToken: text("session_token").notNull().unique(),
  userId: uuid("user_id")
    .references(() => usuarios.id, { onDelete: "cascade" })
    .notNull(),
  expires: timestamp("expires", { withTimezone: true }).notNull(),
});

export const verificationTokens = pgTable("verification_tokens", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull().unique(),
  expires: timestamp("expires", { withTimezone: true }).notNull(),
});
