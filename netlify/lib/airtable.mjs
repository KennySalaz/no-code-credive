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

// Busca un registro por su Token. Devuelve el registro o null.
export async function getByToken(token) {
  const formula = encodeURIComponent(`{Token} = '${token}'`);
  const res = await fetch(`${ENDPOINT}?filterByFormula=${formula}&maxRecords=1`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  if (!res.ok) return null;
  const json = await res.json();
  return (json.records && json.records[0]) || null;
}

// Actualiza campos de un registro por su id. Devuelve el id.
export async function updateRecord(recordId, fields) {
  const res = await fetch(`${ENDPOINT}/${recordId}`, {
    method: "PATCH",
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
    throw new Error(`Airtable updateRecord falló: ${detail}`);
  }
  return (await res.json()).id;
}
