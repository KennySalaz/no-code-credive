import { createRecord } from "../lib/airtable.mjs";
import { mapSolicitud } from "../lib/mapSolicitud.mjs";

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

  // Validación mínima
  if (!body?.nombre || !body?.correo || !body?.telefono) {
    return Response.json(
      { ok: false, error: "Faltan datos obligatorios (nombre, correo, telefono)" },
      { status: 400 }
    );
  }

  const token = crypto.randomUUID();

  try {
    await createRecord(mapSolicitud(body, token));
    // No devolvemos el token: viajará al cliente solo por correo (fases siguientes).
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ ok: false, error: String(e.message || e) }, { status: 502 });
  }
};
