interface HorarioConfig {
  inicio: string;
  fim: string;
  ativo: boolean;
}

interface Bloqueio {
  dataInicio: Date;
  dataFim: Date;
  diaInteiro: boolean;
}

interface Agendamento {
  dataHora: Date;
  dataHoraFim: Date;
}

interface Slot {
  horaInicio: string;
  horaFim: string;
}

const DIAS_SEMANA = [
  "domingo",
  "segunda",
  "terca",
  "quarta",
  "quinta",
  "sexta",
  "sabado",
];

function parseHora(hora: string): number {
  const [h, m] = hora.split(":").map(Number);
  return h * 60 + m;
}

function formatarMinutos(minutos: number): string {
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

export function calculateAvailableSlots(
  barbeariaConfig: {
    horarioFuncionamento: Record<string, HorarioConfig>;
    intervaloSlots: number;
  },
  barbeiroConfig: Record<string, HorarioConfig> | null,
  agendamentosDoDia: Agendamento[],
  bloqueiosDoDia: Bloqueio[],
  duracaoServico: number,
  data: Date
): Slot[] {
  const diaSemana = DIAS_SEMANA[data.getDay()];

  // Usar horario do barbeiro se disponivel, senao da barbearia
  const horario = barbeiroConfig?.[diaSemana] ??
    barbeariaConfig.horarioFuncionamento[diaSemana];

  if (!horario || !horario.ativo) {
    return [];
  }

  const intervalo = barbeariaConfig.intervaloSlots || 30;
  const inicioMinutos = parseHora(horario.inicio);
  const fimMinutos = parseHora(horario.fim);

  // Verificar se ha bloqueio de dia inteiro
  const temBloqueioInteiro = bloqueiosDoDia.some((b) => b.diaInteiro);
  if (temBloqueioInteiro) {
    return [];
  }

  // Gerar todos os slots possiveis
  const slots: Slot[] = [];
  for (let min = inicioMinutos; min + duracaoServico <= fimMinutos; min += intervalo) {
    const slotInicio = min;
    const slotFim = min + duracaoServico;

    // Verificar conflito com agendamentos
    const temConflito = agendamentosDoDia.some((a) => {
      const agInicio = a.dataHora.getHours() * 60 + a.dataHora.getMinutes();
      const agFim = a.dataHoraFim.getHours() * 60 + a.dataHoraFim.getMinutes();
      return slotInicio < agFim && slotFim > agInicio;
    });

    // Verificar conflito com bloqueios
    const temBloqueio = bloqueiosDoDia.some((b) => {
      const bInicio = b.dataInicio.getHours() * 60 + b.dataInicio.getMinutes();
      const bFim = b.dataFim.getHours() * 60 + b.dataFim.getMinutes();
      return slotInicio < bFim && slotFim > bInicio;
    });

    if (!temConflito && !temBloqueio) {
      slots.push({
        horaInicio: formatarMinutos(slotInicio),
        horaFim: formatarMinutos(slotFim),
      });
    }
  }

  return slots;
}
