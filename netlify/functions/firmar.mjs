import { getByToken, updateRecord } from "../lib/airtable.mjs";

// POST /api/firmar  -> Tramo B: marca el contrato como firmado.
export default async (req) => {
  if (req.method !== "POST") {
    return Response.json({ ok: false, error: "Método no permitido" }, { status: 405 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "JSON inválido" }, { status: 400 });
  }

  const token = body?.token;
  if (!token) return Response.json({ ok: false, error: "Falta token" }, { status: 400 });

  const rec = await getByToken(token);
  if (!rec) return Response.json({ ok: false, error: "Solicitud no encontrada" }, { status: 404 });

  const estado = String(rec.fields.Estado || "").trim();

  // Idempotente: si ya firmó, no falla.
  if (estado === "Contrato Firmado" || estado === "Activo") {
    return Response.json({ ok: true, yaFirmado: true });
  }
  if (!["Aprobado", "Verificado"].includes(estado)) {
    return Response.json({ ok: false, error: "Esta solicitud no está habilitada para firmar" }, { status: 409 });
  }

  try {
    await updateRecord(rec.id, { Estado: "Contrato Firmado" });
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ ok: false, error: String(e.message || e) }, { status: 502 });
  }
};
