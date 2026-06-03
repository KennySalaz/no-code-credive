import { createRecord } from "../lib/airtable.mjs";
import { mapSolicitud } from "../lib/mapSolicitud.mjs";
import { getStore } from "@netlify/blobs";

const MAX_PDF_BYTES = 4 * 1024 * 1024; // 4 MB

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
