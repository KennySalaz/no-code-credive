import { getByToken, updateRecord } from "../lib/airtable.mjs";

// POST /api/pago-movil  -> Tramo B: guarda los datos de cobro de Pago Móvil.
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

  const { token, pmTelefono, pmCedula, pmBanco } = body || {};
  if (!token) return Response.json({ ok: false, error: "Falta token" }, { status: 400 });
  if (!pmTelefono || !pmCedula || !pmBanco) {
    return Response.json({ ok: false, error: "Faltan datos de Pago Móvil" }, { status: 400 });
  }

  const rec = await getByToken(token);
  if (!rec) return Response.json({ ok: false, error: "Solicitud no encontrada" }, { status: 404 });

  // Solo dentro del Tramo B (aprobado o biometría hecha).
  const estado = String(rec.fields.Estado || "").trim();
  if (!["Aprobado", "Verificado"].includes(estado)) {
    return Response.json({ ok: false, error: "Esta solicitud no está habilitada para continuar" }, { status: 409 });
  }

  const cedNum = Number(String(pmCedula).replace(/\D/g, ""));
  const fields = {
    "PM Teléfono": String(pmTelefono),
    "PM Banco": String(pmBanco),
  };
  if (Number.isFinite(cedNum) && cedNum > 0) fields["PM Cédula Titular"] = cedNum;

  try {
    await updateRecord(rec.id, fields);
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ ok: false, error: String(e.message || e) }, { status: 502 });
  }
};
