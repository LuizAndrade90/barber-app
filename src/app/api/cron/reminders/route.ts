import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { agendamentos } from "@/lib/db/schema";
import { eq, and, gte, lte } from "drizzle-orm";
import { timingSafeEqual } from "crypto";

function safeCompare(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    if (bufA.length !== bufB.length) return false;
    return timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  // Verificar autorizacao com comparacao timing-safe
  const authHeader = request.headers.get("authorization");
  const expectedSecret = process.env.CRON_SECRET;

  if (
    !authHeader ||
    !expectedSecret ||
    !safeCompare(authHeader, `Bearer ${expectedSecret}`)
  ) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const agora = new Date();
    const emDuasHoras = new Date(agora.getTime() + 2 * 60 * 60 * 1000);

    // Buscar agendamentos confirmados nas proximas 2 horas sem lembrete
    const pendentesLembrete = await db.query.agendamentos.findMany({
      where: and(
        eq(agendamentos.status, "confirmado"),
        eq(agendamentos.lembreteEnviado, false),
        gte(agendamentos.dataHora, agora),
        lte(agendamentos.dataHora, emDuasHoras)
      ),
      with: {
        cliente: true,
        barbeiro: true,
        servico: true,
        barbearia: true,
      },
    });

    // Marcar como lembrete enviado
    for (const agendamento of pendentesLembrete) {
      await db
        .update(agendamentos)
        .set({ lembreteEnviado: true })
        .where(eq(agendamentos.id, agendamento.id));
    }

    // Responder sem PII — apenas IDs e contagem
    return NextResponse.json({
      success: true,
      lembretes: pendentesLembrete.length,
      ids: pendentesLembrete.map((a) => a.id),
    });
  } catch (error) {
    console.error("Cron reminders error:", error);
    return NextResponse.json(
      { error: "Erro ao processar lembretes" },
      { status: 500 }
    );
  }
}
