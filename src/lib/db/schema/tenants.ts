import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";

export const barbearias = pgTable("barbearias", {
  id: uuid("id").defaultRandom().primaryKey(),
  nome: text("nome").notNull(),
  slug: text("slug").notNull().unique(),
  telefone: text("telefone"),
  email: text("email"),
  endereco: jsonb("endereco").$type<{
    rua?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
  }>(),
  logo: text("logo"),
  config: jsonb("config")
    .$type<{
      horarioFuncionamento: {
        [dia: string]: { inicio: string; fim: string; ativo: boolean };
      };
      intervaloSlots: number;
      antecedenciaMinima: number;
      antecedenciaMaxima: number;
      cancelamentoLimite: number;
      confirmacaoAutomatica: boolean;
      lembreteAntecedencia: number;
    }>()
    .default({
      horarioFuncionamento: {
        segunda: { inicio: "09:00", fim: "19:00", ativo: true },
        terca: { inicio: "09:00", fim: "19:00", ativo: true },
        quarta: { inicio: "09:00", fim: "19:00", ativo: true },
        quinta: { inicio: "09:00", fim: "19:00", ativo: true },
        sexta: { inicio: "09:00", fim: "19:00", ativo: true },
        sabado: { inicio: "09:00", fim: "17:00", ativo: true },
        domingo: { inicio: "09:00", fim: "13:00", ativo: false },
      },
      intervaloSlots: 30,
      antecedenciaMinima: 60,
      antecedenciaMaxima: 30,
      cancelamentoLimite: 120,
      confirmacaoAutomatica: false,
      lembreteAntecedencia: 120,
    }),
  notificacoes: jsonb("notificacoes")
    .$type<{
      novoAgendamento: boolean;
      cancelamento: boolean;
      lembrete: boolean;
      confirmacao: boolean;
    }>()
    .default({
      novoAgendamento: true,
      cancelamento: true,
      lembrete: true,
      confirmacao: true,
    }),
  mensagens: jsonb("mensagens")
    .$type<{
      boasVindas: string;
      confirmacao: string;
      lembrete: string;
      cancelamento: string;
      posAtendimento: string;
    }>()
    .default({
      boasVindas: "Olá! Bem-vindo à {barbearia}. Como posso ajudar?",
      confirmacao: "Seu agendamento foi confirmado para {data} às {hora}.",
      lembrete:
        "Lembrete: Você tem um agendamento amanhã às {hora} na {barbearia}.",
      cancelamento: "Seu agendamento foi cancelado com sucesso.",
      posAtendimento:
        "Obrigado pela visita! Como foi sua experiência? Avalie de 1 a 5.",
    }),
  plano: text("plano").default("trial").notNull(),
  whatsappNumero: text("whatsapp_numero"),
  whatsappToken: text("whatsapp_token"),
  whatsappVerifyToken: text("whatsapp_verify_token"),
  n8nWebhookUrl: text("n8n_webhook_url"),
  n8nApiKey: text("n8n_api_key"),
  ativo: boolean("ativo").default(true).notNull(),
  criadoEm: timestamp("criado_em", { withTimezone: true })
    .defaultNow()
    .notNull(),
  atualizadoEm: timestamp("atualizado_em", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
