import { createRecord, getByToken, getByCedula } from "../lib/airtable.mjs";
import { mapSolicitud } from "../lib/mapSolicitud.mjs";
import { getStore } from "@netlify/blobs";

const MAX_PDF_BYTES = 4 * 1024 * 1024; // 4 MB

// Mapea el Estado real de Airtable a un estado simple para el Tramo B.
const ESTADO_TRAMO_B = {
  "Por Verificar": "en_revision",
  "Aprobado": "aprobado",
  "Verificado": "aprobado", // biometría hecha; sigue dentro del Tramo B
  "Contrato Firmado": "completado",
  "Activo": "completado",
  "Rechazado": "rechazado",
};

export default async (req) => {
  // GET /api/solicitud?token=  ->  Tramo B: validar el token y devolver el estado.
  if (req.method === "GET") {
    const params = new URL(req.url).searchParams;

    // Chequeo de cédula en vivo (Tramo A): ?cedula=...  ->  { existe: bool }
    const cedulaQuery = params.get("cedula");
    if (cedulaQuery) {
      const recs = await getByCedula(cedulaQuery);
      const existe = recs.some((r) => String(r.fields.Estado || "").trim() !== "Rechazado");
      return Response.json({ ok: true, existe });
    }

    const token = params.get("token");
    if (!token) return Response.json({ ok: false, error: "Falta token" }, { status: 400 });

    const rec = await getByToken(token);
    if (!rec) return Response.json({ ok: false, estado: "no_existe" }, { status: 404 });

    const estado = String(rec.fields.Estado || "").trim();
    const estadoNorm = ESTADO_TRAMO_B[estado] || "en_revision";
    const datos = estadoNorm === "aprobado" ? { nombre: rec.fields.Nombres || "" } : undefined;
    return Response.json({ ok: true, estado: estadoNorm, datos });
  }

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

  // Cédula única: el correo y el teléfono pueden repetirse, la cédula no.
  // Solo bloquea si ya hay una solicitud NO rechazada con esa cédula
  // (si la anterior fue rechazada, puede volver a intentar).
  const cedulaDigits = String(body.cedula ?? "").replace(/\D/g, "");
  if (cedulaDigits) {
    const existentes = await getByCedula(cedulaDigits);
    const activa = existentes.some((r) => String(r.fields.Estado || "").trim() !== "Rechazado");
    if (activa) {
      return Response.json(
        { ok: false, error: "Ya existe una solicitud registrada con esta cédula." },
        { status: 409 }
      );
    }
  }

  const token = crypto.randomUUID();
  const fields = mapSolicitud(body, token);

  // PDF opcional: llega como texto base64. Se guarda en Netlify Blobs
  // y en Airtable queda solo el enlace para abrirlo.
  if (body.pdfBase64) {
    const bytes = Buffer.from(body.pdfBase64, "base64");
    if (bytes.length === 0) {
      return Response.json({ ok: false, error: "PDF inválido" }, { status: 400 });
    }
    if (bytes.length > MAX_PDF_BYTES) {
      return Response.json({ ok: false, error: "El PDF supera el máximo de 4 MB" }, { status: 413 });
    }
    try {
      const store = getStore("pdfs");
      await store.set(token, bytes, { metadata: { contentType: "application/pdf" } });
      const origin = new URL(req.url).origin;
      fields["PDF Movimientos"] = `${origin}/api/pdf?token=${token}`;
    } catch (e) {
      return Response.json(
        { ok: false, error: "No se pudo guardar el PDF: " + String(e.message || e) },
        { status: 502 }
      );
    }
  }

  try {
    await createRecord(fields);
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ ok: false, error: String(e.message || e) }, { status: 502 });
  }
};
