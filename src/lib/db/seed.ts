import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

async function seed() {
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql, { schema });

  console.log("Iniciando seed...");

  // 1. Barbearia
  const [barbearia] = await db
    .insert(schema.barbearias)
    .values({
      nome: "Barbearia do João",
      slug: "barbearia-do-joao",
      telefone: "(11) 99999-0001",
      email: "contato@barbeariadojoao.com.br",
      endereco: {
        rua: "Rua Augusta",
        numero: "1200",
        bairro: "Consolação",
        cidade: "São Paulo",
        estado: "SP",
        cep: "01304-001",
      },
      plano: "professional",
      whatsappNumero: "5511999990001",
    })
    .returning();

  console.log(`Barbearia criada: ${barbearia.nome}`);

  // 2. Usuários
  const [owner] = await db
    .insert(schema.usuarios)
    .values({
      barbeariaId: barbearia.id,
      nome: "João Silva",
      email: "joao@barbeariadojoao.com.br",
      role: "owner",
      permissoes: {
        gerenciarEquipe: true,
        gerenciarServicos: true,
        gerenciarClientes: true,
        verRelatorios: true,
        gerenciarConfiguracoes: true,
        gerenciarWhatsApp: true,
      },
    })
    .returning();

  const [usuarioBarbeiro] = await db
    .insert(schema.usuarios)
    .values({
      barbeariaId: barbearia.id,
      nome: "Carlos Santos",
      email: "carlos@barbeariadojoao.com.br",
      role: "barber",
    })
    .returning();

  console.log("Usuários criados: 2");

  // 3. Barbeiros
  const [barbeiro1] = await db
    .insert(schema.barbeiros)
    .values({
      barbeariaId: barbearia.id,
      usuarioId: owner.id,
      nome: "João Silva",
      apelido: "João",
      telefone: "(11) 99999-0001",
      corCalendario: "#25d466",
      especialidades: ["corte", "barba", "degradê"],
      comissao: 40,
      ordem: 1,
    })
    .returning();

  const [barbeiro2] = await db
    .insert(schema.barbeiros)
    .values({
      barbeariaId: barbearia.id,
      usuarioId: usuarioBarbeiro.id,
      nome: "Carlos Santos",
      apelido: "Carlão",
      telefone: "(11) 99999-0002",
      corCalendario: "#3b82f6",
      especialidades: ["corte", "platinado", "desenho"],
      comissao: 35,
      horarioPersonalizado: {
        segunda: { inicio: "10:00", fim: "20:00", ativo: true },
        terca: { inicio: "10:00", fim: "20:00", ativo: true },
        quarta: { inicio: "10:00", fim: "20:00", ativo: true },
        quinta: { inicio: "10:00", fim: "20:00", ativo: true },
        sexta: { inicio: "10:00", fim: "20:00", ativo: true },
        sabado: { inicio: "10:00", fim: "17:00", ativo: true },
        domingo: { inicio: "00:00", fim: "00:00", ativo: false },
      },
      ordem: 2,
    })
    .returning();

  console.log("Barbeiros criados: 2");

  // 4. Serviços
  const servicosData = [
    {
      barbeariaId: barbearia.id,
      nome: "Corte Social",
      descricao: "Corte tradicional com máquina e tesoura",
      duracaoMinutos: 30,
      precocentavos: 3500,
      categoria: "corte",
      icone: "content_cut",
      ordem: 1,
    },
    {
      barbeariaId: barbearia.id,
      nome: "Barba",
      descricao: "Barba completa com navalha e toalha quente",
      duracaoMinutos: 20,
      precocentavos: 2500,
      categoria: "barba",
      icone: "face",
      ordem: 2,
    },
    {
      barbeariaId: barbearia.id,
      nome: "Corte + Barba",
      descricao: "Combo completo de corte e barba",
      duracaoMinutos: 50,
      precocentavos: 5500,
      categoria: "combo",
      icone: "auto_awesome",
      ordem: 3,
    },
    {
      barbeariaId: barbearia.id,
      nome: "Degradê",
      descricao: "Corte degradê com acabamento perfeito",
      duracaoMinutos: 40,
      precocentavos: 4500,
      categoria: "corte",
      icone: "gradient",
      ordem: 4,
    },
    {
      barbeariaId: barbearia.id,
      nome: "Platinado",
      descricao: "Descoloração completa com proteção",
      duracaoMinutos: 90,
      precocentavos: 12000,
      categoria: "quimica",
      icone: "palette",
      ordem: 5,
    },
  ];

  const servicosCriados = await db
    .insert(schema.servicos)
    .values(servicosData)
    .returning();

  console.log(`Serviços criados: ${servicosCriados.length}`);

  // 5. Clientes
  const clientesData = [
    { nome: "Ricardo Oliveira", whatsapp: "5511988880001", tags: ["vip"], vip: true },
    { nome: "Fernando Costa", whatsapp: "5511988880002", tags: ["frequente"] },
    { nome: "Marcos Pereira", whatsapp: "5511988880003", tags: ["novo"] },
    { nome: "André Lima", whatsapp: "5511988880004", tags: ["frequente"] },
    { nome: "Paulo Mendes", whatsapp: "5511988880005", tags: [] as string[] },
    { nome: "Lucas Souza", whatsapp: "5511988880006", tags: ["vip"], vip: true },
    { nome: "Gabriel Rocha", whatsapp: "5511988880007", tags: [] as string[] },
    { nome: "Rafael Almeida", whatsapp: "5511988880008", tags: ["novo"] },
    { nome: "Bruno Ferreira", whatsapp: "5511988880009", tags: ["frequente"] },
    { nome: "Diego Santos", whatsapp: "5511988880010", tags: [] as string[] },
  ];

  const clientesCriados = await db
    .insert(schema.clientes)
    .values(
      clientesData.map((c) => ({
        barbeariaId: barbearia.id,
        nome: c.nome,
        whatsapp: c.whatsapp,
        tags: c.tags,
        vip: c.vip ?? false,
        fonte: "manual" as const,
      }))
    )
    .returning();

  console.log(`Clientes criados: ${clientesCriados.length}`);

  // 6. Métricas de clientes
  await db.insert(schema.clienteMetricas).values(
    clientesCriados.map((c, i) => ({
      clienteId: c.id,
      totalVisitas: Math.floor(Math.random() * 20) + 1,
      totalGasto: (Math.floor(Math.random() * 50) + 5) * 3500,
      ticketMedio: 3500 + Math.floor(Math.random() * 3000),
      cancelamentos: Math.floor(Math.random() * 3),
      noShows: Math.floor(Math.random() * 2),
      scoreConfiabilidade: 70 + Math.floor(Math.random() * 30),
      scoreFidelidade: Math.floor(Math.random() * 100),
    }))
  );

  console.log("Métricas de clientes criadas");

  // 7. Agendamentos (20 em status variados)
  const hoje = new Date();
  const statusOpcoes = [
    "agendado",
    "confirmado",
    "em_atendimento",
    "concluido",
    "cancelado",
    "no_show",
  ] as const;

  const agendamentosData = [];
  for (let i = 0; i < 20; i++) {
    const diaOffset = Math.floor(Math.random() * 14) - 7; // -7 a +7 dias
    const hora = 9 + Math.floor(Math.random() * 9); // 9h às 17h
    const minuto = Math.random() > 0.5 ? 0 : 30;
    const dataHora = new Date(hoje);
    dataHora.setDate(dataHora.getDate() + diaOffset);
    dataHora.setHours(hora, minuto, 0, 0);

    const barbeiro = Math.random() > 0.5 ? barbeiro1 : barbeiro2;
    const servico =
      servicosCriados[Math.floor(Math.random() * servicosCriados.length)];
    const cliente =
      clientesCriados[Math.floor(Math.random() * clientesCriados.length)];

    const status =
      diaOffset < 0
        ? statusOpcoes[Math.floor(Math.random() * 2) + 3] // concluido, cancelado, no_show
        : statusOpcoes[Math.floor(Math.random() * 3)]; // agendado, confirmado, em_atendimento

    const dataHoraFim = new Date(dataHora);
    dataHoraFim.setMinutes(
      dataHoraFim.getMinutes() + servico.duracaoMinutos
    );

    agendamentosData.push({
      barbeariaId: barbearia.id,
      barbeiroId: barbeiro.id,
      servicoId: servico.id,
      clienteId: cliente.id,
      dataHora,
      dataHoraFim,
      status,
      precoOriginal: servico.precocentavos,
      precoFinal: servico.precocentavos,
      origem: "manual" as const,
    });
  }

  const agendamentosCriados = await db
    .insert(schema.agendamentos)
    .values(agendamentosData)
    .returning();

  console.log(`Agendamentos criados: ${agendamentosCriados.length}`);

  // 8. Histórico para cada agendamento
  await db.insert(schema.agendamentoHistorico).values(
    agendamentosCriados.map((a) => ({
      agendamentoId: a.id,
      acao: "criado" as const,
      dadosNovos: { status: a.status },
      realizadoPor: "seed",
    }))
  );

  console.log("Histórico de agendamentos criado");

  // 9. Bloqueios de almoço (recorrentes)
  await db.insert(schema.bloqueios).values([
    {
      barbeariaId: barbearia.id,
      barbeiroId: barbeiro1.id,
      tipo: "almoco" as const,
      titulo: "Almoço",
      dataInicio: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 12, 0),
      dataFim: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 13, 0),
      recorrencia: {
        tipo: "semanal" as const,
        diasSemana: [1, 2, 3, 4, 5],
      },
    },
    {
      barbeariaId: barbearia.id,
      barbeiroId: barbeiro2.id,
      tipo: "almoco" as const,
      titulo: "Almoço",
      dataInicio: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 13, 0),
      dataFim: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 14, 0),
      recorrencia: {
        tipo: "semanal" as const,
        diasSemana: [1, 2, 3, 4, 5],
      },
    },
  ]);

  console.log("Bloqueios de almoço criados");

  console.log("\nSeed concluído com sucesso!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Erro no seed:", err);
  process.exit(1);
});
