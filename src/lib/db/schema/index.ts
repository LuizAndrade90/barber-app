import { relations } from "drizzle-orm";

// Export all tables
export { barbearias } from "./tenants";
export { usuarios, accounts, sessions, verificationTokens } from "./users";
export { barbeiros } from "./barbers";
export { servicos } from "./services";
export {
  clientes,
  clienteMetricas,
  clientePreferencias,
} from "./clients";
export {
  agendamentos,
  agendamentoHistorico,
  agendamentoFeedback,
} from "./appointments";
export { bloqueios } from "./blocks";
export { conversas, mensagens } from "./conversations";
export { metricasDiarias, aiInsights } from "./analytics";

// Import tables for relations
import { barbearias } from "./tenants";
import { usuarios, accounts, sessions } from "./users";
import { barbeiros } from "./barbers";
import { servicos } from "./services";
import {
  clientes,
  clienteMetricas,
  clientePreferencias,
} from "./clients";
import {
  agendamentos,
  agendamentoHistorico,
  agendamentoFeedback,
} from "./appointments";
import { bloqueios } from "./blocks";
import { conversas, mensagens } from "./conversations";
import { metricasDiarias, aiInsights } from "./analytics";

// ============ RELATIONS ============

export const barbeariasRelations = relations(barbearias, ({ many }) => ({
  usuarios: many(usuarios),
  barbeiros: many(barbeiros),
  servicos: many(servicos),
  clientes: many(clientes),
  agendamentos: many(agendamentos),
  bloqueios: many(bloqueios),
  conversas: many(conversas),
  metricasDiarias: many(metricasDiarias),
  aiInsights: many(aiInsights),
}));

export const usuariosRelations = relations(usuarios, ({ one, many }) => ({
  barbearia: one(barbearias, {
    fields: [usuarios.barbeariaId],
    references: [barbearias.id],
  }),
  accounts: many(accounts),
  sessions: many(sessions),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  usuario: one(usuarios, {
    fields: [accounts.userId],
    references: [usuarios.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  usuario: one(usuarios, {
    fields: [sessions.userId],
    references: [usuarios.id],
  }),
}));

export const barbeirosRelations = relations(barbeiros, ({ one, many }) => ({
  barbearia: one(barbearias, {
    fields: [barbeiros.barbeariaId],
    references: [barbearias.id],
  }),
  usuario: one(usuarios, {
    fields: [barbeiros.usuarioId],
    references: [usuarios.id],
  }),
  agendamentos: many(agendamentos),
  bloqueios: many(bloqueios),
  metricasDiarias: many(metricasDiarias),
}));

export const servicosRelations = relations(servicos, ({ one, many }) => ({
  barbearia: one(barbearias, {
    fields: [servicos.barbeariaId],
    references: [barbearias.id],
  }),
  agendamentos: many(agendamentos),
}));

export const clientesRelations = relations(clientes, ({ one, many }) => ({
  barbearia: one(barbearias, {
    fields: [clientes.barbeariaId],
    references: [barbearias.id],
  }),
  metricas: one(clienteMetricas),
  preferencias: one(clientePreferencias),
  agendamentos: many(agendamentos),
  conversas: many(conversas),
}));

export const clienteMetricasRelations = relations(
  clienteMetricas,
  ({ one }) => ({
    cliente: one(clientes, {
      fields: [clienteMetricas.clienteId],
      references: [clientes.id],
    }),
  })
);

export const clientePreferenciasRelations = relations(
  clientePreferencias,
  ({ one }) => ({
    cliente: one(clientes, {
      fields: [clientePreferencias.clienteId],
      references: [clientes.id],
    }),
    barbeiroPreferido: one(barbeiros, {
      fields: [clientePreferencias.barbeiroPreferidoId],
      references: [barbeiros.id],
    }),
  })
);

export const agendamentosRelations = relations(
  agendamentos,
  ({ one, many }) => ({
    barbearia: one(barbearias, {
      fields: [agendamentos.barbeariaId],
      references: [barbearias.id],
    }),
    barbeiro: one(barbeiros, {
      fields: [agendamentos.barbeiroId],
      references: [barbeiros.id],
    }),
    servico: one(servicos, {
      fields: [agendamentos.servicoId],
      references: [servicos.id],
    }),
    cliente: one(clientes, {
      fields: [agendamentos.clienteId],
      references: [clientes.id],
    }),
    historico: many(agendamentoHistorico),
    feedback: one(agendamentoFeedback),
  })
);

export const agendamentoHistoricoRelations = relations(
  agendamentoHistorico,
  ({ one }) => ({
    agendamento: one(agendamentos, {
      fields: [agendamentoHistorico.agendamentoId],
      references: [agendamentos.id],
    }),
  })
);

export const agendamentoFeedbackRelations = relations(
  agendamentoFeedback,
  ({ one }) => ({
    agendamento: one(agendamentos, {
      fields: [agendamentoFeedback.agendamentoId],
      references: [agendamentos.id],
    }),
  })
);

export const bloqueiosRelations = relations(bloqueios, ({ one }) => ({
  barbearia: one(barbearias, {
    fields: [bloqueios.barbeariaId],
    references: [barbearias.id],
  }),
  barbeiro: one(barbeiros, {
    fields: [bloqueios.barbeiroId],
    references: [barbeiros.id],
  }),
}));

export const conversasRelations = relations(conversas, ({ one, many }) => ({
  barbearia: one(barbearias, {
    fields: [conversas.barbeariaId],
    references: [barbearias.id],
  }),
  cliente: one(clientes, {
    fields: [conversas.clienteId],
    references: [clientes.id],
  }),
  mensagens: many(mensagens),
}));

export const mensagensRelations = relations(mensagens, ({ one }) => ({
  conversa: one(conversas, {
    fields: [mensagens.conversaId],
    references: [conversas.id],
  }),
}));

export const metricasDiariasRelations = relations(
  metricasDiarias,
  ({ one }) => ({
    barbearia: one(barbearias, {
      fields: [metricasDiarias.barbeariaId],
      references: [barbearias.id],
    }),
    barbeiro: one(barbeiros, {
      fields: [metricasDiarias.barbeiroId],
      references: [barbeiros.id],
    }),
  })
);

export const aiInsightsRelations = relations(aiInsights, ({ one }) => ({
  barbearia: one(barbearias, {
    fields: [aiInsights.barbeariaId],
    references: [barbearias.id],
  }),
}));
