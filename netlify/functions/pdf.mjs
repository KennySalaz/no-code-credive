import { getStore } from "@netlify/blobs";
import { getByToken } from "../lib/airtable.mjs";

// Sirve el PDF de movimientos de una solicitud, a partir de su token.
// El enlace a esta función queda guardado en el campo "PDF Movimientos".
export default async (req) => {
  const token = new URL(req.url).searchParams.get("token");
  if (!token) return new Response("Falta el token", { status: 400 });

  // Validar que el token corresponda a una solicitud real.
  const rec = await getByToken(token);
  if (!rec) return new Response("Solicitud no encontrada", { status: 404 });

  const store = getStore("pdfs");
  const data = await store.get(token, { type: "arrayBuffer" });
  if (!data) return new Response("Esta solicitud no tiene PDF", { status: 404 });

  return new Response(data, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="movimientos.pdf"',
    },
  });
};
