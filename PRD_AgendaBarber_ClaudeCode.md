# PRD - AgendaBarber
## Product Requirements Document

**Versão:** 1.0  
**Data:** Fevereiro 2026  
**Autor:** Luiz  

---

# 1. VISÃO GERAL DO PRODUTO

## 1.1 Objetivo

AgendaBarber é um SaaS B2B de gestão para barbearias com agendamento inteligente via WhatsApp. O sistema permite que clientes agendem horários conversando naturalmente pelo WhatsApp, enquanto gestores e barbeiros gerenciam a operação via dashboard mobile-first.

## 1.2 Proposta de Valor

- **Para o gestor:** Visão completa do negócio, analytics inteligentes, redução de no-shows
- **Para o barbeiro:** Agenda pessoal organizada, notificações em tempo real
- **Para o cliente:** Agendamento 24/7 via WhatsApp sem baixar apps

## 1.3 Usuários

| Persona | Acesso | Descrição |
|---------|--------|-----------|
| **Gestor/Dono** | Dashboard completo | Administra barbearia, vê relatórios, configura sistema |
| **Barbeiro** | Dashboard limitado | Vê própria agenda, gerencia próprios agendamentos |
| **Cliente** | WhatsApp apenas | Agenda, cancela, remarca via chat com IA |

## 1.4 Escopo MVP

**Incluso:**
- Dashboard de gestão (gestor + barbeiros)
- Calendário multi-barbeiro
- Agendamento via WhatsApp (agente IA)
- Gestão de clientes com histórico
- Relatórios e analytics básicos
- IA para insights de negócio

**Excluído (futuro):**
- App cliente nativo
- Pagamentos online
- Marketplace
- Multi-unidade

---

# 2. ARQUITETURA TÉCNICA

## 2.1 Stack Tecnológico

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│  Next.js 14 (App Router) + TypeScript + Tailwind + Shadcn/UI    │
│  FullCalendar (calendário) + Zustand (state) + React Query      │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND                                  │
│  Next.js API Routes + tRPC (type-safe) + Drizzle ORM            │
└─────────────────────────────────────────────────────────────────┘
                                │
                    ┌───────────┼───────────┐
                    ▼           ▼           ▼
┌─────────────┐ ┌─────────┐ ┌─────────────────┐
│   Neon      │ │  n8n    │ │  WhatsApp API   │
│ PostgreSQL  │ │ (agents)│ │  (Cloud API)    │
│ + Auth      │ │         │ │                 │
└─────────────┘ └─────────┘ └─────────────────┘
                    │
                    ▼
            ┌─────────────┐
            │ Claude API  │
            │ (Anthropic) │
            └─────────────┘
```

## 2.2 Estrutura de Pastas

```
agendabarber/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Rotas públicas
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── (dashboard)/              # Rotas protegidas
│   │   │   ├── layout.tsx            # Layout com nav + auth check
│   │   │   ├── page.tsx              # Redirect para /agenda
│   │   │   │
│   │   │   ├── agenda/
│   │   │   │   └── page.tsx          # Calendário principal
│   │   │   │
│   │   │   ├── clientes/
│   │   │   │   ├── page.tsx          # Lista de clientes
│   │   │   │   └── [id]/page.tsx     # Detalhe do cliente
│   │   │   │
│   │   │   ├── servicos/
│   │   │   │   └── page.tsx          # CRUD serviços
│   │   │   │
│   │   │   ├── equipe/
│   │   │   │   └── page.tsx          # CRUD barbeiros
│   │   │   │
│   │   │   ├── relatorios/
│   │   │   │   └── page.tsx          # Analytics + IA insights
│   │   │   │
│   │   │   └── configuracoes/
│   │   │       ├── page.tsx          # Settings gerais
│   │   │       ├── horarios/page.tsx # Horários funcionamento
│   │   │       └── whatsapp/page.tsx # Config WhatsApp
│   │   │
│   │   ├── api/
│   │   │   ├── trpc/[trpc]/route.ts  # tRPC handler
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── webhook/
│   │   │   │   └── n8n/route.ts      # Webhook do n8n
│   │   │   └── cron/
│   │   │       └── reminders/route.ts # Cron para lembretes
│   │   │
│   │   ├── layout.tsx
│   │   ├── page.tsx                  # Landing (redirect se logado)
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── ui/                       # Design System (Shadcn + custom)
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── modal.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── select.tsx
│   │   │   ├── calendar-picker.tsx
│   │   │   ├── time-picker.tsx
│   │   │   └── index.ts              # Export all
│   │   │
│   │   ├── calendar/
│   │   │   ├── CalendarView.tsx      # Wrapper FullCalendar
│   │   │   ├── DayView.tsx
│   │   │   ├── WeekView.tsx
│   │   │   ├── EventCard.tsx
│   │   │   ├── BarberFilter.tsx
│   │   │   ├── TimeGrid.tsx
│   │   │   └── CalendarHeader.tsx
│   │   │
│   │   ├── appointments/
│   │   │   ├── AppointmentModal.tsx
│   │   │   ├── AppointmentSheet.tsx
│   │   │   ├── AppointmentCard.tsx
│   │   │   ├── StatusBadge.tsx
│   │   │   └── QuickActions.tsx
│   │   │
│   │   ├── clients/
│   │   │   ├── ClientCard.tsx
│   │   │   ├── ClientModal.tsx
│   │   │   ├── ClientHistory.tsx
│   │   │   └── ClientStats.tsx
│   │   │
│   │   ├── analytics/
│   │   │   ├── StatsCard.tsx
│   │   │   ├── RevenueChart.tsx
│   │   │   ├── OccupancyChart.tsx
│   │   │   ├── AIInsights.tsx
│   │   │   └── PeriodSelector.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── BottomNav.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── UserMenu.tsx
│   │   │   └── NotificationBell.tsx
│   │   │
│   │   └── shared/
│   │       ├── LoadingState.tsx
│   │       ├── EmptyState.tsx
│   │       ├── ErrorBoundary.tsx
│   │       ├── ConfirmDialog.tsx
│   │       └── SearchInput.tsx
│   │
│   ├── lib/
│   │   ├── db/
│   │   │   ├── index.ts              # Drizzle client + Neon
│   │   │   ├── schema/
│   │   │   │   ├── tenants.ts        # Barbearias
│   │   │   │   ├── users.ts          # Usuários (gestores, barbeiros)
│   │   │   │   ├── barbers.ts        # Barbeiros (perfil profissional)
│   │   │   │   ├── services.ts       # Serviços
│   │   │   │   ├── clients.ts        # Clientes
│   │   │   │   ├── appointments.ts   # Agendamentos
│   │   │   │   ├── blocks.ts         # Bloqueios
│   │   │   │   ├── conversations.ts  # Conversas WhatsApp
│   │   │   │   ├── messages.ts       # Mensagens
│   │   │   │   ├── analytics.ts      # Métricas agregadas
│   │   │   │   └── index.ts          # Export all + relations
│   │   │   └── migrations/
│   │   │
│   │   ├── auth/
│   │   │   ├── config.ts             # NextAuth config
│   │   │   ├── providers.ts          # Google, Apple
│   │   │   └── session.ts            # Helpers de sessão
│   │   │
│   │   ├── trpc/
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   ├── context.ts            # Context com tenant
│   │   │   ├── middleware.ts         # Auth + tenant middleware
│   │   │   ├── routers/
│   │   │   │   ├── appointments.ts
│   │   │   │   ├── clients.ts
│   │   │   │   ├── services.ts
│   │   │   │   ├── barbers.ts
│   │   │   │   ├── blocks.ts
│   │   │   │   ├── analytics.ts
│   │   │   │   ├── settings.ts
│   │   │   │   └── ai.ts             # Endpoints de IA
│   │   │   └── index.ts
│   │   │
│   │   ├── services/
│   │   │   ├── slots.ts              # Lógica de disponibilidade
│   │   │   ├── calendar.ts           # Operações de calendário
│   │   │   ├── notifications.ts      # Push/email
│   │   │   ├── reminders.ts          # Lembretes automáticos
│   │   │   └── ai-insights.ts        # Geração de insights
│   │   │
│   │   ├── n8n/
│   │   │   ├── types.ts              # Tipos do webhook
│   │   │   ├── handlers.ts           # Handlers das ações
│   │   │   └── actions.ts            # Ações disponíveis pro n8n
│   │   │
│   │   └── utils/
│   │       ├── date.ts
│   │       ├── phone.ts
│   │       ├── currency.ts
│   │       ├── validators.ts
│   │       └── constants.ts
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useTenant.ts
│   │   ├── useCalendar.ts
│   │   ├── useAppointments.ts
│   │   ├── useClients.ts
│   │   ├── useAnalytics.ts
│   │   └── useRealtime.ts            # Subscriptions
│   │
│   ├── stores/
│   │   ├── calendarStore.ts
│   │   ├── uiStore.ts
│   │   └── notificationStore.ts
│   │
│   └── types/
│       ├── database.ts               # Tipos inferidos do Drizzle
│       ├── api.ts                    # Tipos da API
│       ├── calendar.ts
│       └── index.ts
│
├── n8n/
│   └── workflows/
│       ├── whatsapp-agent.json       # Workflow principal
│       └── reminders.json            # Workflow de lembretes
│
├── drizzle.config.ts
├── tailwind.config.ts
├── next.config.js
├── package.json
├── .env.example
└── README.md
```

---

# 3. DESIGN SYSTEM

## 3.1 Instruções para Claude Code

```
IMPORTANTE: O código da interface será fornecido pelo Google Stitch.
Ao receber o código, extraia e crie o Design System baseado nos componentes visuais.

Passos:
1. Analise o código fornecido do Stitch
2. Identifique padrões visuais: cores, tipografia, espaçamentos, sombras
3. Crie tokens de design em tailwind.config.ts
4. Crie componentes base em /components/ui/ seguindo os padrões
5. Documente o Design System em /docs/design-system.md

Priorize:
- Consistência com o design do Stitch
- Componentes reutilizáveis
- Variantes (size, variant, state)
- Acessibilidade
- Mobile-first
```

## 3.2 Estrutura Esperada do Design System

```typescript
// tailwind.config.ts - Tokens extraídos do Stitch

const config = {
  theme: {
    extend: {
      colors: {
        // Extrair do Stitch
        primary: {
          DEFAULT: '#25D366',  // Verde WhatsApp
          dark: '#128C7E',
          light: '#DCF8C6',
        },
        // ... demais cores
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Extrair do Stitch
      },
      spacing: {
        // Extrair do Stitch
      },
      borderRadius: {
        // Extrair do Stitch
      },
      boxShadow: {
        // Extrair do Stitch
      },
    },
  },
};
```

---

# 4. SCHEMA DO BANCO DE DADOS

## 4.1 Visão Geral das Tabelas

```
┌─────────────────────────────────────────────────────────────────┐
│                        CORE ENTITIES                             │
├─────────────────────────────────────────────────────────────────┤
│  barbearias (tenant)  ←──┬── usuarios (auth)                    │
│         │                 │                                      │
│         ├── barbeiros ────┘                                      │
│         ├── servicos                                             │
│         ├── clientes ─────┬── cliente_metricas                  │
│         │                 └── cliente_preferencias               │
│         ├── agendamentos ─┬── agendamento_historico             │
│         │                 └── agendamento_feedback               │
│         └── bloqueios                                            │
├─────────────────────────────────────────────────────────────────┤
│                      WHATSAPP/CHAT                               │
├─────────────────────────────────────────────────────────────────┤
│  conversas ──── mensagens                                        │
├─────────────────────────────────────────────────────────────────┤
│                       ANALYTICS                                  │
├─────────────────────────────────────────────────────────────────┤
│  metricas_diarias                                                │
│  metricas_semanais                                               │
│  metricas_mensais                                                │
│  ai_insights                                                     │
└─────────────────────────────────────────────────────────────────┘
```

## 4.2 Schema Detalhado (Drizzle ORM)

```typescript
// src/lib/db/schema/tenants.ts

import { pgTable, text, timestamp, integer, boolean, uuid, jsonb } from 'drizzle-orm/pg-core';

export const barbearias = pgTable('barbearias', {
  id: uuid('id').defaultRandom().primaryKey(),
  
  // Identificação
  nome: text('nome').notNull(),
  slug: text('slug').notNull().unique(),
  logo: text('logo'),
  
  // Contato
  whatsapp: text('whatsapp').notNull().unique(),
  whatsappBusinessId: text('whatsapp_business_id'),
  whatsappPhoneNumberId: text('whatsapp_phone_number_id'),
  whatsappVerified: boolean('whatsapp_verified').default(false),
  email: text('email'),
  telefone: text('telefone'),
  
  // Endereço
  endereco: text('endereco'),
  cidade: text('cidade'),
  estado: text('estado'),
  cep: text('cep'),
  
  // Configurações de Funcionamento
  config: jsonb('config').$type<{
    horarioAbertura: string;      // "09:00"
    horarioFechamento: string;    // "19:00"
    intervaloSlot: number;        // 30 (minutos)
    diasFuncionamento: number[];  // [1,2,3,4,5,6] (0=Dom)
    timezone: string;             // "America/Sao_Paulo"
    antecedenciaMinima: number;   // 2 (horas)
    antecedenciaMaxima: number;   // 30 (dias)
    permiteCancelamento: boolean;
    horasParaCancelar: number;    // 2 (horas antes)
  }>().default({
    horarioAbertura: '09:00',
    horarioFechamento: '19:00',
    intervaloSlot: 30,
    diasFuncionamento: [1, 2, 3, 4, 5, 6],
    timezone: 'America/Sao_Paulo',
    antecedenciaMinima: 2,
    antecedenciaMaxima: 30,
    permiteCancelamento: true,
    horasParaCancelar: 2,
  }),
  
  // Configurações de Notificação
  notificacoes: jsonb('notificacoes').$type<{
    lembreteAtivo: boolean;
    lembreteHorasAntes: number;
    confirmacaoAutomatica: boolean;
    notificarNovosAgendamentos: boolean;
    notificarCancelamentos: boolean;
    notificarNoShows: boolean;
  }>().default({
    lembreteAtivo: true,
    lembreteHorasAntes: 2,
    confirmacaoAutomatica: false,
    notificarNovosAgendamentos: true,
    notificarCancelamentos: true,
    notificarNoShows: true,
  }),
  
  // Mensagens Personalizadas
  mensagens: jsonb('mensagens').$type<{
    boasVindas: string;
    confirmacao: string;
    lembrete: string;
    cancelamento: string;
    agradecimento: string;
  }>(),
  
  // Plano e Billing
  plano: text('plano').default('trial').notNull(),
  trialEndsAt: timestamp('trial_ends_at'),
  stripeCustomerId: text('stripe_customer_id'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  
  // Status
  ativo: boolean('ativo').default(true).notNull(),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

```typescript
// src/lib/db/schema/users.ts

export const usuarios = pgTable('usuarios', {
  id: uuid('id').defaultRandom().primaryKey(),
  
  // Auth (Neon Auth / NextAuth)
  email: text('email').notNull().unique(),
  emailVerified: timestamp('email_verified'),
  image: text('image'),
  
  // Provider info
  provider: text('provider'), // 'google', 'apple', 'credentials'
  providerAccountId: text('provider_account_id'),
  
  // Profile
  nome: text('nome').notNull(),
  telefone: text('telefone'),
  avatar: text('avatar'),
  
  // Tenant
  barbeariaId: uuid('barbearia_id')
    .references(() => barbearias.id, { onDelete: 'cascade' })
    .notNull(),
  
  // Role e Permissões
  role: text('role').notNull().default('barber'),
  // 'owner' - Dono, acesso total
  // 'manager' - Gerente, quase tudo exceto billing
  // 'barber' - Barbeiro, só própria agenda
  
  permissoes: jsonb('permissoes').$type<{
    verTodosAgendamentos: boolean;
    editarAgendamentos: boolean;
    verRelatorios: boolean;
    gerenciarEquipe: boolean;
    gerenciarServicos: boolean;
    gerenciarClientes: boolean;
    acessarConfiguracoes: boolean;
  }>(),
  
  // Vinculação com perfil de barbeiro (se for barbeiro)
  barbeiroId: uuid('barbeiro_id').references(() => barbeiros.id),
  
  // Status
  ativo: boolean('ativo').default(true).notNull(),
  ultimoAcesso: timestamp('ultimo_acesso'),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

```typescript
// src/lib/db/schema/barbers.ts

export const barbeiros = pgTable('barbeiros', {
  id: uuid('id').defaultRandom().primaryKey(),
  
  barbeariaId: uuid('barbearia_id')
    .references(() => barbearias.id, { onDelete: 'cascade' })
    .notNull(),
  
  // Identificação
  nome: text('nome').notNull(),
  apelido: text('apelido'),
  bio: text('bio'),
  foto: text('foto'),
  
  // Visual no calendário
  cor: text('cor').default('#25D366').notNull(),
  
  // Horário de trabalho (pode ser diferente da barbearia)
  horarioPersonalizado: boolean('horario_personalizado').default(false),
  config: jsonb('config').$type<{
    horarioAbertura: string;
    horarioFechamento: string;
    diasTrabalho: number[];
    intervaloAlmoco?: {
      inicio: string;
      fim: string;
    };
  }>(),
  
  // Serviços que realiza (se vazio, faz todos)
  servicosIds: uuid('servicos_ids').array(),
  
  // Comissão
  comissaoTipo: text('comissao_tipo').default('percentual'), // 'percentual', 'fixo', 'nenhum'
  comissaoValor: integer('comissao_valor').default(0), // % ou valor fixo em centavos
  
  // Ordenação e status
  ordem: integer('ordem').default(0).notNull(),
  ativo: boolean('ativo').default(true).notNull(),
  
  // Métricas rápidas (desnormalizadas para performance)
  totalAgendamentos: integer('total_agendamentos').default(0),
  mediaAvaliacao: integer('media_avaliacao'), // 1-5 * 100 para precisão
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

```typescript
// src/lib/db/schema/services.ts

export const servicos = pgTable('servicos', {
  id: uuid('id').defaultRandom().primaryKey(),
  
  barbeariaId: uuid('barbearia_id')
    .references(() => barbearias.id, { onDelete: 'cascade' })
    .notNull(),
  
  // Identificação
  nome: text('nome').notNull(),
  descricao: text('descricao'),
  
  // Tempo e preço
  duracaoMinutos: integer('duracao_minutos').default(30).notNull(),
  preco: integer('preco').notNull(), // Em centavos (R$ 35,00 = 3500)
  
  // Visual
  cor: text('cor'),
  icone: text('icone'),
  
  // Categorização
  categoria: text('categoria'), // 'corte', 'barba', 'combo', 'tratamento'
  
  // Configurações
  ativo: boolean('ativo').default(true).notNull(),
  exibirNoWhatsapp: boolean('exibir_no_whatsapp').default(true),
  ordem: integer('ordem').default(0).notNull(),
  
  // Métricas (desnormalizadas)
  totalAgendamentos: integer('total_agendamentos').default(0),
  receitaTotal: integer('receita_total').default(0), // Em centavos
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

```typescript
// src/lib/db/schema/clients.ts

export const clientes = pgTable('clientes', {
  id: uuid('id').defaultRandom().primaryKey(),
  
  barbeariaId: uuid('barbearia_id')
    .references(() => barbearias.id, { onDelete: 'cascade' })
    .notNull(),
  
  // Identificação
  nome: text('nome').notNull(),
  whatsapp: text('whatsapp').notNull(),
  email: text('email'),
  
  // Dados adicionais
  dataNascimento: timestamp('data_nascimento'),
  genero: text('genero'), // 'M', 'F', 'O'
  foto: text('foto'),
  
  // Endereço (opcional, para futuras features)
  endereco: jsonb('endereco').$type<{
    rua?: string;
    numero?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
  }>(),
  
  // Origem
  origem: text('origem').default('whatsapp'), // 'whatsapp', 'manual', 'indicacao'
  indicadoPor: uuid('indicado_por').references(() => clientes.id),
  
  // Observações internas
  observacoes: text('observacoes'),
  
  // Tags para segmentação
  tags: text('tags').array(),
  
  // Status
  vip: boolean('vip').default(false),
  bloqueado: boolean('bloqueado').default(false),
  motivoBloqueio: text('motivo_bloqueio'),
  
  // Timestamps
  primeiraVisita: timestamp('primeira_visita'),
  ultimaVisita: timestamp('ultima_visita'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Métricas do cliente (tabela separada para não poluir a principal)
export const clienteMetricas = pgTable('cliente_metricas', {
  id: uuid('id').defaultRandom().primaryKey(),
  clienteId: uuid('cliente_id')
    .references(() => clientes.id, { onDelete: 'cascade' })
    .notNull()
    .unique(),
  
  // Contadores
  totalAgendamentos: integer('total_agendamentos').default(0),
  totalConcluidos: integer('total_concluidos').default(0),
  totalCancelados: integer('total_cancelados').default(0),
  totalNoShows: integer('total_no_shows').default(0),
  
  // Financeiro
  ticketMedio: integer('ticket_medio').default(0), // Centavos
  gastoTotal: integer('gasto_total').default(0),   // Centavos
  
  // Frequência
  frequenciaMediaDias: integer('frequencia_media_dias'), // Dias entre visitas
  
  // Avaliações
  mediaAvaliacoes: integer('media_avaliacoes'), // 1-5 * 100
  totalAvaliacoes: integer('total_avaliacoes').default(0),
  
  // Scores calculados
  scoreEngajamento: integer('score_engajamento'), // 0-100
  scoreRisco: integer('score_risco'),             // 0-100 (risco de churn)
  scoreLTV: integer('score_ltv'),                 // Lifetime value estimado
  
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Preferências aprendidas do cliente
export const clientePreferencias = pgTable('cliente_preferencias', {
  id: uuid('id').defaultRandom().primaryKey(),
  clienteId: uuid('cliente_id')
    .references(() => clientes.id, { onDelete: 'cascade' })
    .notNull()
    .unique(),
  
  // Preferências de atendimento
  barbeiroPreferidoId: uuid('barbeiro_preferido_id').references(() => barbeiros.id),
  servicoMaisFrequente: uuid('servico_mais_frequente').references(() => servicos.id),
  
  // Preferências de horário
  diaPreferido: integer('dia_preferido'),           // 0-6
  horarioPreferido: text('horario_preferido'),      // "14:00"
  periodoPreferido: text('periodo_preferido'),      // 'manha', 'tarde', 'noite'
  
  // Comportamento
  antecedenciaMediaHoras: integer('antecedencia_media_horas'), // Quanto antes costuma marcar
  taxaCancelamento: integer('taxa_cancelamento'),              // % de cancelamentos
  respondeRapido: boolean('responde_rapido'),                  // Confirma lembretes rápido
  
  // Preferências de comunicação
  prefereAudio: boolean('prefere_audio').default(false),
  idioma: text('idioma').default('pt-BR'),
  
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

```typescript
// src/lib/db/schema/appointments.ts

export const agendamentos = pgTable('agendamentos', {
  id: uuid('id').defaultRandom().primaryKey(),
  
  // Relacionamentos principais
  barbeariaId: uuid('barbearia_id')
    .references(() => barbearias.id, { onDelete: 'cascade' })
    .notNull(),
  clienteId: uuid('cliente_id')
    .references(() => clientes.id)
    .notNull(),
  barbeiroId: uuid('barbeiro_id')
    .references(() => barbeiros.id),
  servicoId: uuid('servico_id')
    .references(() => servicos.id)
    .notNull(),
  
  // Data e hora
  dataHora: timestamp('data_hora').notNull(),
  dataHoraFim: timestamp('data_hora_fim').notNull(),
  duracaoMinutos: integer('duracao_minutos').notNull(),
  
  // Status
  status: text('status').default('agendado').notNull(),
  // 'agendado' → 'confirmado' → 'em_atendimento' → 'concluido'
  //           → 'cancelado_cliente'
  //           → 'cancelado_barbearia'
  //           → 'no_show'
  //           → 'remarcado'
  
  // Valor no momento do agendamento
  precoServico: integer('preco_servico').notNull(), // Centavos
  desconto: integer('desconto').default(0),         // Centavos
  precoFinal: integer('preco_final').notNull(),     // Centavos
  
  // Origem e contexto
  origem: text('origem').default('whatsapp').notNull(),
  // 'whatsapp', 'dashboard_manual', 'dashboard_gestor', 'link_agendamento'
  criadoPor: uuid('criado_por').references(() => usuarios.id),
  conversaId: uuid('conversa_id').references(() => conversas.id),
  
  // Lembretes
  lembreteEnviado: boolean('lembrete_enviado').default(false),
  lembreteEnviadoEm: timestamp('lembrete_enviado_em'),
  
  // Confirmação
  confirmado: boolean('confirmado').default(false),
  confirmadoEm: timestamp('confirmado_em'),
  confirmadoVia: text('confirmado_via'), // 'whatsapp', 'dashboard'
  
  // Conclusão
  concluidoEm: timestamp('concluido_em'),
  
  // Cancelamento
  canceladoEm: timestamp('cancelado_em'),
  canceladoPor: text('cancelado_por'), // 'cliente', 'barbearia', 'sistema'
  motivoCancelamento: text('motivo_cancelamento'),
  
  // Remarcação
  remarcadoDe: uuid('remarcado_de').references(() => agendamentos.id),
  remarcadoPara: uuid('remarcado_para'),
  
  // Notas
  observacoes: text('observacoes'),
  observacoesInternas: text('observacoes_internas'),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  // Índices para queries frequentes
  barbeariaDataIdx: index('agendamentos_barbearia_data_idx')
    .on(table.barbeariaId, table.dataHora),
  barbeiroDataIdx: index('agendamentos_barbeiro_data_idx')
    .on(table.barbeiroId, table.dataHora),
  clienteIdx: index('agendamentos_cliente_idx')
    .on(table.clienteId),
  statusIdx: index('agendamentos_status_idx')
    .on(table.status),
}));

// Histórico de alterações do agendamento (audit log)
export const agendamentoHistorico = pgTable('agendamento_historico', {
  id: uuid('id').defaultRandom().primaryKey(),
  agendamentoId: uuid('agendamento_id')
    .references(() => agendamentos.id, { onDelete: 'cascade' })
    .notNull(),
  
  acao: text('acao').notNull(),
  // 'criado', 'confirmado', 'remarcado', 'cancelado', 'concluido', 'no_show', 'editado'
  
  dadosAnteriores: jsonb('dados_anteriores'),
  dadosNovos: jsonb('dados_novos'),
  
  realizadoPor: text('realizado_por'), // 'cliente', 'barbeiro', 'gestor', 'sistema', 'agente'
  usuarioId: uuid('usuario_id').references(() => usuarios.id),
  
  ip: text('ip'),
  userAgent: text('user_agent'),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Feedback/avaliação do agendamento
export const agendamentoFeedback = pgTable('agendamento_feedback', {
  id: uuid('id').defaultRandom().primaryKey(),
  agendamentoId: uuid('agendamento_id')
    .references(() => agendamentos.id, { onDelete: 'cascade' })
    .notNull()
    .unique(),
  
  nota: integer('nota').notNull(), // 1-5
  comentario: text('comentario'),
  
  // Avaliações específicas (opcional)
  notaAtendimento: integer('nota_atendimento'),
  notaPontualidade: integer('nota_pontualidade'),
  notaAmbiente: integer('nota_ambiente'),
  
  // Sentimento detectado por IA
  sentimento: text('sentimento'), // 'positivo', 'neutro', 'negativo'
  
  respondidoEm: timestamp('respondido_em'),
  respostaPublica: text('resposta_publica'),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

```typescript
// src/lib/db/schema/blocks.ts

export const bloqueios = pgTable('bloqueios', {
  id: uuid('id').defaultRandom().primaryKey(),
  
  barbeariaId: uuid('barbearia_id')
    .references(() => barbearias.id, { onDelete: 'cascade' })
    .notNull(),
  
  // Pode ser geral ou específico de barbeiro
  barbeiroId: uuid('barbeiro_id').references(() => barbeiros.id),
  
  // Período
  dataInicio: timestamp('data_inicio').notNull(),
  dataFim: timestamp('data_fim').notNull(),
  diaInteiro: boolean('dia_inteiro').default(false),
  
  // Identificação
  motivo: text('motivo').notNull(),
  tipo: text('tipo').default('manual'),
  // 'almoco', 'folga', 'ferias', 'feriado', 'manutencao', 'manual'
  
  // Recorrência
  recorrente: boolean('recorrente').default(false),
  recorrencia: jsonb('recorrencia').$type<{
    tipo: 'diario' | 'semanal' | 'mensal';
    diasSemana?: number[];  // Para semanal: [1, 2, 3, 4, 5]
    diaMes?: number;        // Para mensal: dia do mês
    dataFim?: string;       // Quando termina a recorrência
  }>(),
  
  // Visual
  cor: text('cor').default('#9CA3AF'),
  
  // Quem criou
  criadoPor: uuid('criado_por').references(() => usuarios.id),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

```typescript
// src/lib/db/schema/conversations.ts

export const conversas = pgTable('conversas', {
  id: uuid('id').defaultRandom().primaryKey(),
  
  barbeariaId: uuid('barbearia_id')
    .references(() => barbearias.id, { onDelete: 'cascade' })
    .notNull(),
  
  clienteId: uuid('cliente_id').references(() => clientes.id),
  
  // WhatsApp
  whatsappFrom: text('whatsapp_from').notNull(),
  whatsappTo: text('whatsapp_to').notNull(), // Número da barbearia
  
  // Estado do agente
  estado: text('estado').default('inicio').notNull(),
  // 'inicio', 'identificando', 'menu_principal', 'agendando_servico',
  // 'agendando_barbeiro', 'agendando_data', 'agendando_horario',
  // 'confirmando', 'cancelando', 'remarcando', 'finalizado', 'humano'
  
  // Dados parciais do fluxo em andamento
  contexto: jsonb('contexto').$type<{
    intencao?: string;
    servicoId?: string;
    barbeiroId?: string;
    data?: string;
    horario?: string;
    agendamentoId?: string;
    tentativas?: number;
    ultimaIntencao?: string;
  }>(),
  
  // Controle
  ativa: boolean('ativa').default(true),
  transferidaParaHumano: boolean('transferida_para_humano').default(false),
  motivoTransferencia: text('motivo_transferencia'),
  
  // Expiração
  ultimaInteracao: timestamp('ultima_interacao').defaultNow(),
  expiraEm: timestamp('expira_em'),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  barbeariaWhatsappIdx: uniqueIndex('conversas_unique')
    .on(table.barbeariaId, table.whatsappFrom),
}));

export const mensagens = pgTable('mensagens', {
  id: uuid('id').defaultRandom().primaryKey(),
  
  barbeariaId: uuid('barbearia_id')
    .references(() => barbearias.id, { onDelete: 'cascade' })
    .notNull(),
  conversaId: uuid('conversa_id')
    .references(() => conversas.id, { onDelete: 'cascade' })
    .notNull(),
  clienteId: uuid('cliente_id').references(() => clientes.id),
  
  // Direção
  direcao: text('direcao').notNull(), // 'entrada', 'saida'
  
  // Conteúdo
  tipo: text('tipo').default('texto').notNull(),
  // 'texto', 'imagem', 'audio', 'documento', 'template', 'interativo'
  conteudo: text('conteudo').notNull(),
  
  // Mídia (se aplicável)
  midiaUrl: text('midia_url'),
  midiaType: text('midia_type'),
  
  // WhatsApp IDs
  whatsappMsgId: text('whatsapp_msg_id'),
  whatsappStatus: text('whatsapp_status'),
  // 'enviado', 'entregue', 'lido', 'falhou'
  whatsappTimestamp: timestamp('whatsapp_timestamp'),
  whatsappError: text('whatsapp_error'),
  
  // Processamento pelo agente
  processadaPeloAgente: boolean('processada_pelo_agente').default(false),
  intencaoDetectada: text('intencao_detectada'),
  confiancaIntencao: integer('confianca_intencao'), // 0-100
  entidadesExtraidas: jsonb('entidades_extraidas'),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  conversaIdx: index('mensagens_conversa_idx').on(table.conversaId),
  createdAtIdx: index('mensagens_created_at_idx').on(table.createdAt),
}));
```

```typescript
// src/lib/db/schema/analytics.ts

// Métricas agregadas por dia
export const metricasDiarias = pgTable('metricas_diarias', {
  id: uuid('id').defaultRandom().primaryKey(),
  
  barbeariaId: uuid('barbearia_id')
    .references(() => barbearias.id, { onDelete: 'cascade' })
    .notNull(),
  barbeiroId: uuid('barbeiro_id').references(() => barbeiros.id),
  
  data: timestamp('data').notNull(),
  
  // Agendamentos
  totalAgendamentos: integer('total_agendamentos').default(0),
  agendamentosConfirmados: integer('agendamentos_confirmados').default(0),
  agendamentosConcluidos: integer('agendamentos_concluidos').default(0),
  agendamentosCancelados: integer('agendamentos_cancelados').default(0),
  noShows: integer('no_shows').default(0),
  
  // Financeiro
  receitaBruta: integer('receita_bruta').default(0),      // Centavos
  descontos: integer('descontos').default(0),
  receitaLiquida: integer('receita_liquida').default(0),
  ticketMedio: integer('ticket_medio').default(0),
  
  // Ocupação
  slotsDisponiveis: integer('slots_disponiveis').default(0),
  slotsOcupados: integer('slots_ocupados').default(0),
  taxaOcupacao: integer('taxa_ocupacao').default(0),      // Percentual * 100
  
  // Clientes
  clientesNovos: integer('clientes_novos').default(0),
  clientesRecorrentes: integer('clientes_recorrentes').default(0),
  
  // WhatsApp
  mensagensRecebidas: integer('mensagens_recebidas').default(0),
  mensagensEnviadas: integer('mensagens_enviadas').default(0),
  conversasIniciadas: integer('conversas_iniciadas').default(0),
  conversasConvertidas: integer('conversas_convertidas').default(0), // Viraram agendamento
  
  // Horários populares
  horariosPopulares: jsonb('horarios_populares').$type<{
    horario: string;
    quantidade: number;
  }[]>(),
  
  // Serviços populares
  servicosPopulares: jsonb('servicos_populares').$type<{
    servicoId: string;
    quantidade: number;
    receita: number;
  }[]>(),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  barbeariaDataIdx: uniqueIndex('metricas_diarias_unique')
    .on(table.barbeariaId, table.barbeiroId, table.data),
}));

// Insights gerados por IA
export const aiInsights = pgTable('ai_insights', {
  id: uuid('id').defaultRandom().primaryKey(),
  
  barbeariaId: uuid('barbearia_id')
    .references(() => barbearias.id, { onDelete: 'cascade' })
    .notNull(),
  
  // Tipo de insight
  tipo: text('tipo').notNull(),
  // 'oportunidade', 'alerta', 'tendencia', 'recomendacao', 'anomalia'
  
  categoria: text('categoria').notNull(),
  // 'receita', 'ocupacao', 'clientes', 'servicos', 'barbeiros', 'horarios'
  
  // Conteúdo
  titulo: text('titulo').notNull(),
  descricao: text('descricao').notNull(),
  
  // Dados de suporte
  dados: jsonb('dados').$type<{
    metricas?: Record<string, number>;
    comparacao?: {
      atual: number;
      anterior: number;
      variacao: number;
    };
    sugestoes?: string[];
  }>(),
  
  // Importância
  prioridade: text('prioridade').default('media'),
  // 'alta', 'media', 'baixa'
  
  // Status
  lido: boolean('lido').default(false),
  lidoEm: timestamp('lido_em'),
  descartado: boolean('descartado').default(false),
  
  // Validade
  validoAte: timestamp('valido_ate'),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

---

# 5. ORQUESTRAÇÃO DO AGENTE WHATSAPP (n8n)

## 5.1 Arquitetura do Fluxo

```
┌──────────────────────────────────────────────────────────────────────┐
│                         WHATSAPP CLOUD API                           │
│                    (Webhook de mensagens)                            │
└───────────────────────────────┬──────────────────────────────────────┘
                                │
                                ▼
┌──────────────────────────────────────────────────────────────────────┐
│                              n8n                                      │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                    WEBHOOK RECEIVER                             │  │
│  │  - Valida assinatura Meta                                       │  │
│  │  - Extrai dados da mensagem                                     │  │
│  │  - Identifica barbearia pelo phone_number_id                    │  │
│  └────────────────────────────────┬───────────────────────────────┘  │
│                                   │                                   │
│                                   ▼                                   │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                    CONTEXT LOADER                               │  │
│  │  - Busca/cria conversa no banco                                 │  │
│  │  - Carrega estado atual                                         │  │
│  │  - Busca/cria cliente                                           │  │
│  │  - Carrega dados da barbearia                                   │  │
│  └────────────────────────────────┬───────────────────────────────┘  │
│                                   │                                   │
│                                   ▼                                   │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                    INTENT CLASSIFIER                            │  │
│  │  - Envia para Claude API                                        │  │
│  │  - Classifica intenção                                          │  │
│  │  - Extrai entidades                                             │  │
│  └────────────────────────────────┬───────────────────────────────┘  │
│                                   │                                   │
│                                   ▼                                   │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                    STATE MACHINE                                │  │
│  │  - Executa ação baseada no estado + intenção                    │  │
│  │  - Chama API do AgendaBarber para CRUD                          │  │
│  │  - Atualiza estado da conversa                                  │  │
│  └────────────────────────────────┬───────────────────────────────┘  │
│                                   │                                   │
│                                   ▼                                   │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                    RESPONSE GENERATOR                           │  │
│  │  - Gera resposta natural com Claude                             │  │
│  │  - Formata para WhatsApp (emojis, listas)                       │  │
│  │  - Envia via WhatsApp API                                       │  │
│  └────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌──────────────────────────────────────────────────────────────────────┐
│                       AGENDABARBER API                               │
│                   (Next.js API Routes)                               │
│                                                                      │
│  POST /api/webhook/n8n                                               │
│  ├── action: 'getContext'      → Retorna contexto da conversa        │
│  ├── action: 'getSlots'        → Retorna horários disponíveis        │
│  ├── action: 'createAppointment' → Cria agendamento                  │
│  ├── action: 'updateAppointment' → Atualiza agendamento              │
│  ├── action: 'cancelAppointment' → Cancela agendamento               │
│  ├── action: 'getAppointments'   → Lista agendamentos do cliente     │
│  ├── action: 'updateConversation' → Atualiza estado da conversa      │
│  └── action: 'logMessage'        → Registra mensagem                 │
└──────────────────────────────────────────────────────────────────────┘
```

## 5.2 Estados da Conversa (State Machine)

```
                              ┌─────────┐
                              │  INICIO │
                              └────┬────┘
                                   │
                    ┌──────────────┼──────────────┐
                    │              │              │
                    ▼              ▼              ▼
             ┌──────────┐  ┌──────────┐  ┌──────────────┐
             │ AGENDANDO│  │CANCELANDO│  │ CONSULTANDO  │
             └────┬─────┘  └────┬─────┘  └──────┬───────┘
                  │             │               │
         ┌────────┼────────┐    │               │
         ▼        ▼        ▼    ▼               ▼
    ┌────────┐┌───────┐┌──────┐┌────────┐ ┌──────────┐
    │SERVICO ││BARBEIRO││ DATA ││CONFIRMA│ │  LISTA   │
    └───┬────┘└───┬────┘└──┬───┘└───┬────┘ │AGENDAMENT│
        │         │        │        │      └────┬─────┘
        └────────┬┴────────┘        │           │
                 │                  │           │
                 ▼                  ▼           │
           ┌──────────┐      ┌───────────┐     │
           │ HORARIO  │      │ CONFIRMAR │     │
           └────┬─────┘      │ CANCELAR  │     │
                │            └─────┬─────┘     │
                ▼                  │           │
           ┌──────────┐            │           │
           │CONFIRMANDO│           │           │
           └────┬─────┘            │           │
                │                  │           │
                └────────┬─────────┴───────────┘
                         ▼
                   ┌───────────┐
                   │ FINALIZADO│
                   └───────────┘
```

## 5.3 Workflow n8n Detalhado

```json
// n8n/workflows/whatsapp-agent.json (estrutura conceitual)

{
  "name": "WhatsApp Agent - AgendaBarber",
  "nodes": [
    {
      "name": "Webhook WhatsApp",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "path": "whatsapp-webhook",
        "method": "POST",
        "responseMode": "onReceived"
      }
    },
    {
      "name": "Validate Signature",
      "type": "n8n-nodes-base.function",
      "parameters": {
        "functionCode": "// Valida assinatura X-Hub-Signature-256"
      }
    },
    {
      "name": "Extract Message Data",
      "type": "n8n-nodes-base.function",
      "parameters": {
        "functionCode": `
          const entry = $input.item.json.entry?.[0];
          const change = entry?.changes?.[0];
          const value = change?.value;
          
          // Ignora status updates
          if (!value?.messages?.[0]) {
            return { json: { skip: true } };
          }
          
          const message = value.messages[0];
          
          return {
            json: {
              phoneNumberId: value.metadata.phone_number_id,
              from: message.from,
              messageId: message.id,
              timestamp: message.timestamp,
              type: message.type,
              text: message.text?.body || '',
              // Suporte futuro para áudio, imagem, etc
            }
          };
        `
      }
    },
    {
      "name": "Skip Check",
      "type": "n8n-nodes-base.if",
      "parameters": {
        "conditions": {
          "boolean": [{ "value1": "={{$json.skip}}", "value2": true }]
        }
      }
    },
    {
      "name": "Get Context from API",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "={{$env.AGENDABARBER_API_URL}}/api/webhook/n8n",
        "method": "POST",
        "body": {
          "action": "getContext",
          "phoneNumberId": "={{$json.phoneNumberId}}",
          "clienteWhatsapp": "={{$json.from}}"
        }
      }
    },
    {
      "name": "Classify Intent with Claude",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "https://api.anthropic.com/v1/messages",
        "method": "POST",
        "headers": {
          "x-api-key": "={{$env.ANTHROPIC_API_KEY}}",
          "anthropic-version": "2023-06-01"
        },
        "body": "={{$node['Build Claude Prompt'].json}}"
      }
    },
    {
      "name": "Build Claude Prompt",
      "type": "n8n-nodes-base.function",
      "parameters": {
        "functionCode": `
          const context = $node['Get Context from API'].json;
          const message = $node['Extract Message Data'].json;
          
          const systemPrompt = \`
Você é um classificador de intenções para um chatbot de agendamento de barbearia.

ESTADO ATUAL: \${context.estado}
CONTEXTO: \${JSON.stringify(context.contexto)}
BARBEARIA: \${context.barbearia.nome}
CLIENTE: \${context.cliente?.nome || 'Novo cliente'}

Analise a mensagem e retorne APENAS um JSON válido:
{
  "intencao": "agendar|cancelar|remarcar|consultar|informacoes|saudacao|confirmar|negar|outro",
  "confianca": 0-100,
  "entidades": {
    "servico": "nome do serviço se mencionado",
    "barbeiro": "nome do barbeiro se mencionado",
    "data": "YYYY-MM-DD se mencionado",
    "horario": "HH:MM se mencionado",
    "sim_nao": "sim|nao se for resposta binária"
  },
  "nomeCliente": "nome se o cliente informou"
}
\`;

          return {
            json: {
              model: "claude-3-haiku-20240307",
              max_tokens: 300,
              system: systemPrompt,
              messages: [
                { role: "user", content: message.text }
              ]
            }
          };
        `
      }
    },
    {
      "name": "Parse Claude Response",
      "type": "n8n-nodes-base.function",
      "parameters": {
        "functionCode": `
          const response = $input.item.json;
          const text = response.content[0].text;
          
          try {
            return { json: JSON.parse(text) };
          } catch (e) {
            return { json: { intencao: 'outro', confianca: 0 } };
          }
        `
      }
    },
    {
      "name": "State Machine Router",
      "type": "n8n-nodes-base.switch",
      "parameters": {
        "dataPropertyName": "={{$node['Get Context from API'].json.estado}}",
        "rules": [
          { "value": "inicio" },
          { "value": "agendando_servico" },
          { "value": "agendando_barbeiro" },
          { "value": "agendando_data" },
          { "value": "agendando_horario" },
          { "value": "confirmando" },
          { "value": "cancelando" }
        ]
      }
    },
    // ... nodes específicos para cada estado ...
    {
      "name": "Handle Inicio",
      "type": "n8n-nodes-base.function",
      "parameters": {
        "functionCode": `
          const intent = $node['Parse Claude Response'].json;
          const context = $node['Get Context from API'].json;
          
          let novoEstado = 'inicio';
          let acao = null;
          let dados = {};
          
          switch (intent.intencao) {
            case 'agendar':
            case 'saudacao':
              novoEstado = 'agendando_servico';
              break;
            case 'cancelar':
              novoEstado = 'cancelando';
              break;
            case 'consultar':
              acao = 'getAppointments';
              break;
            case 'informacoes':
              // Permanece em inicio, só responde
              break;
          }
          
          return {
            json: {
              novoEstado,
              acao,
              dados,
              intent
            }
          };
        `
      }
    },
    {
      "name": "Get Available Slots",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "={{$env.AGENDABARBER_API_URL}}/api/webhook/n8n",
        "method": "POST",
        "body": {
          "action": "getSlots",
          "barbeariaId": "={{$node['Get Context from API'].json.barbearia.id}}",
          "data": "={{$json.contexto.data}}",
          "servicoId": "={{$json.contexto.servicoId}}",
          "barbeiroId": "={{$json.contexto.barbeiroId}}"
        }
      }
    },
    {
      "name": "Create Appointment",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "={{$env.AGENDABARBER_API_URL}}/api/webhook/n8n",
        "method": "POST",
        "body": {
          "action": "createAppointment",
          "barbeariaId": "={{$json.barbearia.id}}",
          "clienteId": "={{$json.cliente.id}}",
          "servicoId": "={{$json.contexto.servicoId}}",
          "barbeiroId": "={{$json.contexto.barbeiroId}}",
          "data": "={{$json.contexto.data}}",
          "horario": "={{$json.contexto.horario}}",
          "conversaId": "={{$json.conversa.id}}"
        }
      }
    },
    {
      "name": "Generate Response with Claude",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "https://api.anthropic.com/v1/messages",
        "method": "POST",
        "body": "={{$node['Build Response Prompt'].json}}"
      }
    },
    {
      "name": "Build Response Prompt",
      "type": "n8n-nodes-base.function",
      "parameters": {
        "functionCode": `
          const context = $node['Get Context from API'].json;
          const stateResult = $node['State Machine Result'].json;
          
          const systemPrompt = \`
Você é o assistente virtual da \${context.barbearia.nome} via WhatsApp.
Seja simpático, use emojis com moderação (máximo 3), e seja DIRETO.

ESTADO: \${stateResult.novoEstado}
DADOS DISPONÍVEIS: \${JSON.stringify(stateResult.dados)}

Gere uma resposta natural para o cliente.
Se precisar listar opções, use formato numerado.
Máximo 3 parágrafos curtos.
\`;

          return {
            json: {
              model: "claude-3-haiku-20240307",
              max_tokens: 500,
              system: systemPrompt,
              messages: [
                { role: "user", content: "Gere a resposta para o cliente." }
              ]
            }
          };
        `
      }
    },
    {
      "name": "Send WhatsApp Message",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "https://graph.facebook.com/v18.0/{{$node['Extract Message Data'].json.phoneNumberId}}/messages",
        "method": "POST",
        "headers": {
          "Authorization": "Bearer {{$env.WHATSAPP_TOKEN}}"
        },
        "body": {
          "messaging_product": "whatsapp",
          "to": "={{$node['Extract Message Data'].json.from}}",
          "type": "text",
          "text": {
            "body": "={{$node['Generate Response with Claude'].json.content[0].text}}"
          }
        }
      }
    },
    {
      "name": "Update Conversation State",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "={{$env.AGENDABARBER_API_URL}}/api/webhook/n8n",
        "method": "POST",
        "body": {
          "action": "updateConversation",
          "conversaId": "={{$json.conversa.id}}",
          "estado": "={{$json.novoEstado}}",
          "contexto": "={{$json.contexto}}"
        }
      }
    },
    {
      "name": "Log Messages",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "={{$env.AGENDABARBER_API_URL}}/api/webhook/n8n",
        "method": "POST",
        "body": {
          "action": "logMessage",
          "conversaId": "={{$json.conversa.id}}",
          "mensagemEntrada": {
            "conteudo": "={{$node['Extract Message Data'].json.text}}",
            "whatsappMsgId": "={{$node['Extract Message Data'].json.messageId}}"
          },
          "mensagemSaida": {
            "conteudo": "={{$node['Generate Response with Claude'].json.content[0].text}}"
          }
        }
      }
    }
  ]
}
```

## 5.4 API Endpoints para n8n

```typescript
// src/app/api/webhook/n8n/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

// Schema de validação
const actionSchema = z.discriminatedUnion('action', [
  z.object({
    action: z.literal('getContext'),
    phoneNumberId: z.string(),
    clienteWhatsapp: z.string(),
  }),
  z.object({
    action: z.literal('getSlots'),
    barbeariaId: z.string(),
    data: z.string(),
    servicoId: z.string().optional(),
    barbeiroId: z.string().optional(),
  }),
  z.object({
    action: z.literal('createAppointment'),
    barbeariaId: z.string(),
    clienteId: z.string(),
    servicoId: z.string(),
    barbeiroId: z.string().optional(),
    data: z.string(),
    horario: z.string(),
    conversaId: z.string(),
  }),
  z.object({
    action: z.literal('updateAppointment'),
    agendamentoId: z.string(),
    status: z.string().optional(),
    dataHora: z.string().optional(),
  }),
  z.object({
    action: z.literal('cancelAppointment'),
    agendamentoId: z.string(),
    motivo: z.string().optional(),
  }),
  z.object({
    action: z.literal('getAppointments'),
    clienteId: z.string(),
    status: z.string().optional(),
  }),
  z.object({
    action: z.literal('updateConversation'),
    conversaId: z.string(),
    estado: z.string(),
    contexto: z.record(z.any()),
  }),
  z.object({
    action: z.literal('logMessage'),
    conversaId: z.string(),
    mensagemEntrada: z.object({
      conteudo: z.string(),
      whatsappMsgId: z.string().optional(),
    }),
    mensagemSaida: z.object({
      conteudo: z.string(),
    }),
  }),
]);

export async function POST(request: NextRequest) {
  try {
    // Validar API key do n8n
    const apiKey = request.headers.get('x-api-key');
    if (apiKey !== process.env.N8N_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = actionSchema.parse(body);

    switch (parsed.action) {
      case 'getContext':
        return handleGetContext(parsed);
      case 'getSlots':
        return handleGetSlots(parsed);
      case 'createAppointment':
        return handleCreateAppointment(parsed);
      case 'updateAppointment':
        return handleUpdateAppointment(parsed);
      case 'cancelAppointment':
        return handleCancelAppointment(parsed);
      case 'getAppointments':
        return handleGetAppointments(parsed);
      case 'updateConversation':
        return handleUpdateConversation(parsed);
      case 'logMessage':
        return handleLogMessage(parsed);
      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (error) {
    console.error('n8n webhook error:', error);
    return NextResponse.json(
      { error: 'Internal error', details: String(error) },
      { status: 500 }
    );
  }
}

async function handleGetContext(data: { phoneNumberId: string; clienteWhatsapp: string }) {
  // 1. Encontrar barbearia pelo phoneNumberId
  const barbearia = await db.query.barbearias.findFirst({
    where: eq(barbearias.whatsappPhoneNumberId, data.phoneNumberId),
    with: {
      servicos: { where: eq(servicos.ativo, true), orderBy: servicos.ordem },
      barbeiros: { where: eq(barbeiros.ativo, true), orderBy: barbeiros.ordem },
    },
  });

  if (!barbearia) {
    return NextResponse.json({ error: 'Barbearia not found' }, { status: 404 });
  }

  // 2. Buscar ou criar cliente
  let cliente = await db.query.clientes.findFirst({
    where: and(
      eq(clientes.barbeariaId, barbearia.id),
      eq(clientes.whatsapp, data.clienteWhatsapp)
    ),
  });

  if (!cliente) {
    const [novoCliente] = await db.insert(clientes).values({
      barbeariaId: barbearia.id,
      nome: 'Cliente WhatsApp',
      whatsapp: data.clienteWhatsapp,
      origem: 'whatsapp',
    }).returning();
    cliente = novoCliente;
  }

  // 3. Buscar ou criar conversa
  let conversa = await db.query.conversas.findFirst({
    where: and(
      eq(conversas.barbeariaId, barbearia.id),
      eq(conversas.whatsappFrom, data.clienteWhatsapp)
    ),
  });

  if (!conversa) {
    const [novaConversa] = await db.insert(conversas).values({
      barbeariaId: barbearia.id,
      clienteId: cliente.id,
      whatsappFrom: data.clienteWhatsapp,
      whatsappTo: barbearia.whatsapp,
      estado: 'inicio',
      contexto: {},
    }).returning();
    conversa = novaConversa;
  }

  // Verificar se conversa expirou (15 min sem interação)
  const quinzeMinutosAtras = new Date(Date.now() - 15 * 60 * 1000);
  if (conversa.ultimaInteracao && conversa.ultimaInteracao < quinzeMinutosAtras) {
    // Resetar conversa
    await db.update(conversas)
      .set({ estado: 'inicio', contexto: {} })
      .where(eq(conversas.id, conversa.id));
    conversa = { ...conversa, estado: 'inicio', contexto: {} };
  }

  return NextResponse.json({
    barbearia: {
      id: barbearia.id,
      nome: barbearia.nome,
      config: barbearia.config,
      servicos: barbearia.servicos,
      barbeiros: barbearia.barbeiros,
    },
    cliente: {
      id: cliente.id,
      nome: cliente.nome,
      whatsapp: cliente.whatsapp,
    },
    conversa: {
      id: conversa.id,
      estado: conversa.estado,
      contexto: conversa.contexto,
    },
  });
}

async function handleGetSlots(data: {
  barbeariaId: string;
  data: string;
  servicoId?: string;
  barbeiroId?: string;
}) {
  // Implementar lógica de slots disponíveis
  // Similar ao que já foi definido anteriormente
  const slots = await getAvailableSlots(
    data.barbeariaId,
    data.data,
    data.servicoId,
    data.barbeiroId
  );
  
  return NextResponse.json({ slots });
}

async function handleCreateAppointment(data: {
  barbeariaId: string;
  clienteId: string;
  servicoId: string;
  barbeiroId?: string;
  data: string;
  horario: string;
  conversaId: string;
}) {
  // Buscar serviço para pegar duração e preço
  const servico = await db.query.servicos.findFirst({
    where: eq(servicos.id, data.servicoId),
  });

  if (!servico) {
    return NextResponse.json({ error: 'Serviço not found' }, { status: 404 });
  }

  // Calcular data/hora
  const [hora, minuto] = data.horario.split(':').map(Number);
  const dataHora = new Date(data.data);
  dataHora.setHours(hora, minuto, 0, 0);
  
  const dataHoraFim = new Date(dataHora.getTime() + servico.duracaoMinutos * 60000);

  // Verificar conflitos
  const conflito = await db.query.agendamentos.findFirst({
    where: and(
      eq(agendamentos.barbeariaId, data.barbeariaId),
      data.barbeiroId ? eq(agendamentos.barbeiroId, data.barbeiroId) : undefined,
      gte(agendamentos.dataHora, dataHora),
      lte(agendamentos.dataHora, dataHoraFim),
      not(inArray(agendamentos.status, ['cancelado_cliente', 'cancelado_barbearia']))
    ),
  });

  if (conflito) {
    return NextResponse.json({ error: 'Horário não disponível' }, { status: 409 });
  }

  // Criar agendamento
  const [agendamento] = await db.insert(agendamentos).values({
    barbeariaId: data.barbeariaId,
    clienteId: data.clienteId,
    servicoId: data.servicoId,
    barbeiroId: data.barbeiroId,
    dataHora,
    dataHoraFim,
    duracaoMinutos: servico.duracaoMinutos,
    precoServico: servico.preco,
    precoFinal: servico.preco,
    origem: 'whatsapp',
    conversaId: data.conversaId,
    status: 'agendado',
  }).returning();

  // Atualizar métricas do cliente
  await db.update(clienteMetricas)
    .set({
      totalAgendamentos: sql`${clienteMetricas.totalAgendamentos} + 1`,
      updatedAt: new Date(),
    })
    .where(eq(clienteMetricas.clienteId, data.clienteId));

  return NextResponse.json({ agendamento });
}

// ... implementar demais handlers ...
```

---

# 6. FUNCIONALIDADES DA IA

## 6.1 Análise de Dados e Insights

```typescript
// src/lib/services/ai-insights.ts

import Anthropic from '@anthropic-ai/sdk';
import { db } from '@/lib/db';

const anthropic = new Anthropic();

interface InsightRequest {
  barbeariaId: string;
  periodo: 'semana' | 'mes' | 'trimestre';
}

export async function generateInsights(request: InsightRequest) {
  // 1. Coletar dados do período
  const dados = await collectAnalyticsData(request.barbeariaId, request.periodo);
  
  // 2. Enviar para Claude analisar
  const prompt = `
Você é um analista de dados especializado em negócios de barbearias.
Analise os dados abaixo e gere insights acionáveis.

DADOS DO PERÍODO (${request.periodo}):
${JSON.stringify(dados, null, 2)}

Gere insights nas seguintes categorias:
1. OPORTUNIDADES DE RECEITA
2. ALERTAS DE RISCO
3. TENDÊNCIAS
4. RECOMENDAÇÕES DE AÇÃO

Para cada insight, forneça:
- Título curto e direto
- Descrição explicativa
- Dados de suporte
- Sugestão de ação
- Prioridade (alta/media/baixa)

Responda em JSON válido com array de insights.
`;

  const response = await anthropic.messages.create({
    model: 'claude-3-sonnet-20240229', // Sonnet para análise mais profunda
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }],
  });

  const insights = JSON.parse(response.content[0].text);
  
  // 3. Salvar insights no banco
  for (const insight of insights) {
    await db.insert(aiInsights).values({
      barbeariaId: request.barbeariaId,
      tipo: insight.tipo,
      categoria: insight.categoria,
      titulo: insight.titulo,
      descricao: insight.descricao,
      dados: insight.dados,
      prioridade: insight.prioridade,
      validoAte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
    });
  }

  return insights;
}

async function collectAnalyticsData(barbeariaId: string, periodo: string) {
  const dataInicio = getDataInicio(periodo);
  const dataFim = new Date();

  // Métricas agregadas
  const metricas = await db.query.metricasDiarias.findMany({
    where: and(
      eq(metricasDiarias.barbeariaId, barbeariaId),
      gte(metricasDiarias.data, dataInicio),
      lte(metricasDiarias.data, dataFim)
    ),
  });

  // Top clientes
  const topClientes = await db.query.clientes.findMany({
    where: eq(clientes.barbeariaId, barbeariaId),
    orderBy: desc(clienteMetricas.gastoTotal),
    limit: 10,
    with: { metricas: true },
  });

  // Clientes em risco (não vieram há muito tempo)
  const clientesRisco = await db.query.clientes.findMany({
    where: and(
      eq(clientes.barbeariaId, barbeariaId),
      lte(clientes.ultimaVisita, new Date(Date.now() - 45 * 24 * 60 * 60 * 1000))
    ),
    with: { metricas: true },
  });

  // Serviços populares
  const servicosPopulares = await db
    .select({
      servicoId: agendamentos.servicoId,
      nome: servicos.nome,
      quantidade: count(),
      receita: sum(agendamentos.precoFinal),
    })
    .from(agendamentos)
    .innerJoin(servicos, eq(agendamentos.servicoId, servicos.id))
    .where(and(
      eq(agendamentos.barbeariaId, barbeariaId),
      gte(agendamentos.dataHora, dataInicio),
      eq(agendamentos.status, 'concluido')
    ))
    .groupBy(agendamentos.servicoId, servicos.nome)
    .orderBy(desc(count()));

  // Horários populares
  const horariosPopulares = await db.execute(sql`
    SELECT 
      EXTRACT(HOUR FROM data_hora) as hora,
      COUNT(*) as quantidade
    FROM agendamentos
    WHERE barbearia_id = ${barbeariaId}
      AND data_hora >= ${dataInicio}
      AND status = 'concluido'
    GROUP BY EXTRACT(HOUR FROM data_hora)
    ORDER BY quantidade DESC
    LIMIT 5
  `);

  // Taxa de conversão WhatsApp
  const conversasTotal = await db.query.conversas.count({
    where: and(
      eq(conversas.barbeariaId, barbeariaId),
      gte(conversas.createdAt, dataInicio)
    ),
  });

  const conversasConvertidas = await db.query.conversas.count({
    where: and(
      eq(conversas.barbeariaId, barbeariaId),
      gte(conversas.createdAt, dataInicio),
      isNotNull(conversas.clienteId) // Teve agendamento
    ),
  });

  return {
    periodo,
    metricas: aggregateMetrics(metricas),
    topClientes: topClientes.slice(0, 5),
    clientesRisco: clientesRisco.length,
    servicosPopulares,
    horariosPopulares,
    taxaConversaoWhatsapp: conversasTotal > 0 
      ? (conversasConvertidas / conversasTotal) * 100 
      : 0,
  };
}
```

## 6.2 Insights Pré-definidos

```typescript
// Tipos de insights que a IA pode gerar

const INSIGHT_TYPES = {
  // OPORTUNIDADES
  HORARIO_OCIOSO: {
    tipo: 'oportunidade',
    categoria: 'ocupacao',
    trigger: (dados) => dados.taxaOcupacao < 60,
    template: 'Sua taxa de ocupação está em {taxa}%. Considere promoções para os horários de {horarios}.',
  },
  
  CLIENTE_VIP_SUMIU: {
    tipo: 'alerta',
    categoria: 'clientes',
    trigger: (dados) => dados.clientesVipSemVisita > 0,
    template: '{quantidade} clientes VIP não visitam há mais de 30 dias.',
  },
  
  SERVICO_EM_ALTA: {
    tipo: 'tendencia',
    categoria: 'servicos',
    trigger: (dados) => dados.servicoEmCrescimento,
    template: 'O serviço "{servico}" cresceu {percentual}% este mês.',
  },
  
  NO_SHOW_ALTO: {
    tipo: 'alerta',
    categoria: 'agendamentos',
    trigger: (dados) => dados.taxaNoShow > 15,
    template: 'Taxa de no-show em {taxa}%. Considere ativar confirmação obrigatória.',
  },
  
  BARBEIRO_DESTAQUE: {
    tipo: 'tendencia',
    categoria: 'barbeiros',
    trigger: (dados) => dados.barbeiroComMaisAgendamentos,
    template: '{barbeiro} teve o melhor desempenho com {quantidade} atendimentos.',
  },
  
  CLIENTE_PRESTES_A_RETORNAR: {
    tipo: 'oportunidade',
    categoria: 'clientes',
    trigger: (dados) => dados.clientesParaRetorno.length > 0,
    template: '{quantidade} clientes costumam retornar nesta semana. Que tal enviar um lembrete?',
  },
};
```

---

# 7. FUNCIONALIDADES DO MVP

## 7.1 Escopo do MVP

### Dashboard (Web)

| Funcionalidade | Prioridade | Descrição |
|----------------|------------|-----------|
| Login/Cadastro | P0 | Google e Apple Sign-In via Neon Auth |
| Agenda/Calendário | P0 | Visualização dia/semana, criar/editar agendamentos |
| Gestão de Clientes | P0 | Lista, busca, detalhes, histórico |
| Gestão de Serviços | P0 | CRUD de serviços |
| Gestão de Equipe | P1 | CRUD de barbeiros, horários individuais |
| Bloqueios | P1 | Almoço, folgas, feriados |
| Relatórios Básicos | P1 | Agendamentos, receita, ocupação |
| Insights IA | P2 | Análise automática semanal |
| Configurações | P1 | Horários, notificações, WhatsApp |

### WhatsApp Agent (via n8n)

| Funcionalidade | Prioridade | Descrição |
|----------------|------------|-----------|
| Agendar | P0 | Fluxo completo de agendamento |
| Cancelar | P0 | Cancelamento com confirmação |
| Consultar | P1 | Ver próximos agendamentos |
| Remarcar | P1 | Alterar data/hora |
| Lembrete Automático | P1 | 2h antes do agendamento |
| Confirmação | P1 | Pedir confirmação via template |

## 7.2 Features Futuras (Pós-MVP)

| Feature | Fase | Descrição |
|---------|------|-----------|
| Multi-unidade | V2 | Gerenciar várias barbearias |
| Pagamento Online | V2 | Sinal/Pré-pagamento |
| Fila de Espera | V2 | Lista de espera para horários lotados |
| Programa de Fidelidade | V2 | Pontos, recompensas |
| Marketing Automatizado | V3 | Campanhas de retorno |
| Integração Financeira | V3 | Controle de caixa, comissões |
| App Cliente | V3 | App nativo para clientes |

---

# 8. INSTRUÇÕES PARA CLAUDE CODE

## 8.1 Ordem de Implementação

```
FASE 1: Setup e Infraestrutura
1. Criar projeto Next.js com estrutura de pastas
2. Configurar Tailwind + Shadcn/UI
3. Configurar Drizzle ORM + Neon
4. Criar schema do banco e rodar migrations
5. Configurar NextAuth com Google/Apple

FASE 2: Design System
6. Receber código do Google Stitch
7. Extrair tokens de design (cores, fontes, espaçamentos)
8. Criar componentes base em /components/ui
9. Documentar Design System

FASE 3: Layout e Navegação
10. Criar layout do dashboard (sidebar desktop, bottom nav mobile)
11. Implementar autenticação e proteção de rotas
12. Criar estrutura de páginas básica

FASE 4: Calendário
13. Integrar FullCalendar
14. Implementar visualização dia/semana
15. Implementar criação de agendamento via calendário
16. Implementar drag-and-drop para remarcar

FASE 5: CRUD Principal
17. Implementar tRPC routers
18. CRUD de serviços
19. CRUD de barbeiros
20. CRUD de clientes
21. CRUD de bloqueios

FASE 6: Agendamentos
22. Modal de novo agendamento
23. Sheet de detalhes do agendamento
24. Lógica de slots disponíveis
25. Confirmação e cancelamento

FASE 7: Integração n8n
26. Criar endpoint /api/webhook/n8n
27. Implementar handlers de cada action
28. Testar com n8n local

FASE 8: Analytics
29. Implementar agregação de métricas diárias
30. Criar tela de relatórios
31. Implementar geração de insights com IA

FASE 9: Polish
32. Loading states e skeletons
33. Empty states
34. Tratamento de erros
35. Notificações toast
36. Responsividade final
```

## 8.2 Comandos Iniciais

```bash
# 1. Criar projeto
npx create-next-app@latest agendabarber --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# 2. Instalar dependências core
npm install drizzle-orm @neondatabase/serverless
npm install @trpc/server @trpc/client @trpc/react-query @tanstack/react-query
npm install next-auth@beta @auth/drizzle-adapter
npm install zod zustand date-fns
npm install @anthropic-ai/sdk

# 3. Instalar UI
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input label select tabs toast dialog sheet avatar badge separator dropdown-menu

# 4. Instalar FullCalendar
npm install @fullcalendar/core @fullcalendar/react @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction

# 5. Dev dependencies
npm install -D drizzle-kit @types/node
```

## 8.3 Variáveis de Ambiente

```env
# .env.example

# Neon Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Google OAuth
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Apple OAuth
APPLE_ID=""
APPLE_SECRET=""

# n8n
N8N_API_KEY="sua-chave-segura"
N8N_WEBHOOK_URL="https://seu-n8n.com/webhook/..."

# WhatsApp (para envio direto, se necessário)
WHATSAPP_TOKEN=""
WHATSAPP_PHONE_NUMBER_ID=""

# Anthropic
ANTHROPIC_API_KEY="sk-ant-..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

# 9. CONSIDERAÇÕES FINAIS

## 9.1 Pontos de Atenção

1. **Multi-tenancy:** TODAS as queries devem filtrar por `barbeariaId`
2. **Permissões:** Barbeiros só veem próprios dados; gestores veem tudo
3. **Timezone:** Sempre usar timezone da barbearia para cálculos
4. **Concorrência:** Verificar conflitos antes de criar agendamentos
5. **Rate limiting:** Proteger endpoints do n8n

## 9.2 Métricas de Sucesso Técnico

| Métrica | Meta |
|---------|------|
| Time to First Byte | < 200ms |
| Lighthouse Performance | > 90 |
| Tempo de resposta API | < 100ms (p95) |
| Uptime | > 99.9% |

## 9.3 Entregáveis

1. Código fonte completo no repositório
2. README com instruções de setup
3. Schema do banco documentado
4. Workflow n8n exportado
5. Design System documentado

---

*PRD AgendaBarber v1.0 - Fevereiro 2026*
