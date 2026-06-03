const TOKEN = process.env.AIRTABLE_TOKEN;
const BASE = process.env.AIRTABLE_BASE_ID;
const TABLE = process.env.AIRTABLE_TABLE || "Clientes";

const ENDPOINT = `https://api.airtable.com/v0/${BASE}/${encodeURIComponent(TABLE)}`;

// Crea un registro en la tabla. Devuelve el id del registro creado.
export async function createRecord(fields) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fields }),
  });
  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try {
      const j = await res.json();
      detail = j?.error?.message || j?.error?.type || detail;
    } catch {}
    throw new Error(`Airtable createRecord falló: ${detail}`);
  }
  const json = await res.json();
  return json.id;
}
