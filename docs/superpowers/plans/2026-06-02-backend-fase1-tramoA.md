# Backend CreditVE — Fase 1: Tramo A seguro (Implementation Plan)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reemplazar la escritura directa e insegura a Airtable por una función Netlify (`POST /api/solicitud`) que crea la solicitud del Tramo A con los nombres/tipos REALES de la tabla `Clientes` y un `Token` único, probada en local.

**Architecture:** SPA Vue (Vite) servida por Netlify. Las llamadas a Airtable salen del navegador y pasan a una función serverless de Netlify que tiene la llave en variables de entorno del servidor. La función mapea el payload del formulario a los campos reales y crea el registro vía la REST API de Airtable.

**Tech Stack:** Vue 3 + Vite, Netlify Functions 2.0 (Node 18+, `export default` con `Request`/`Response`), `fetch` y `crypto.randomUUID()` nativos (sin SDKs), Vitest para tests de lógica pura.

**Nota de preferencia del usuario:** los `git commit` de cada tarea se confirman con el usuario antes de ejecutarse (no se commitea automáticamente). No se hace `push` sin confirmar.

**Alcance de Fase 1 (acotado a propósito):** solo datos básicos del solicitante + token + estado inicial. El cuestionario, el monto, el PDF, el Tramo B y los correos de Make son fases posteriores (ver Roadmap al final).

---

## Estructura de archivos

- Crear: `netlify.toml` — config de build, carpeta de funciones y redirect `/api/*`.
- Crear: `netlify/lib/airtable.mjs` — cliente mínimo de Airtable (crear registro). Una sola responsabilidad: hablar con la REST API.
- Crear: `netlify/lib/mapSolicitud.mjs` — lógica PURA que mapea el payload del form a los campos reales de Airtable. Sin red; testeable.
- Crear: `netlify/functions/health.mjs` — endpoint de prueba de vida.
- Crear: `netlify/functions/solicitud.mjs` — `POST /api/solicitud`.
- Crear: `tests/mapSolicitud.test.mjs` — tests de la lógica de mapeo.
- Modificar: `src/services/airtable.ts` — `crearSolicitud` deja de llamar a Airtable directo y llama a `/api/solicitud`.
- Modificar: `.env` — añadir variables server-side (sin prefijo `VITE_`).
- Modificar: `package.json` — devDeps (`netlify-cli`, `vitest`) y scripts (`dev:netlify`, `test`).

---

## Prerrequisito manual (Airtable)

Antes de la Tarea 3 hay que crear UN campo en la tabla `Clientes` (no se puede por API: el token solo tiene `schema.bases:read`, no `:write`).

- [ ] **Crear el campo `Token` en la tabla `Clientes`**
  - En Airtable, tabla `Clientes` → "+" para nuevo campo → Nombre exacto: `Token` → Tipo: **Single line text**.
  - (Opcional) Marcarlo como único no es necesario; el código garantiza unicidad con UUID.

---

## Task 1: Configurar Netlify y endpoint de salud

**Files:**
- Create: `netlify.toml`
- Create: `netlify/functions/health.mjs`
- Modify: `package.json`
- Modify: `.env`

- [ ] **Step 1: Crear `netlify.toml`**

```toml
[build]
  command = "npm run build"
  publish = "dist"
  functions = "netlify/functions"

# netlify dev levanta Vite y hace de proxy de las funciones
[dev]
  command = "npm run dev"
  targetPort = 5173

# /api/x -> función "x"
[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

- [ ] **Step 2: Crear la función de salud `netlify/functions/health.mjs`**

```js
export default async () => {
  return Response.json({ ok: true, service: "creditve-api" });
};
```

- [ ] **Step 3: Añadir variables server-side al `.env`**

Duplicar los valores de los `VITE_*` ya existentes, con nombres sin prefijo (las funciones no deben depender de variables `VITE_`, que están pensadas para el cliente):

```
AIRTABLE_TOKEN=<mismo valor que VITE_AIRTABLE_TOKEN>
AIRTABLE_BASE_ID=<mismo valor que VITE_AIRTABLE_BASE_ID>
AIRTABLE_TABLE=Clientes
```

- [ ] **Step 4: Instalar Netlify CLI y añadir script**

Run:
```bash
npm install -D netlify-cli
```
Luego añadir a `package.json` en `"scripts"`:
```json
"dev:netlify": "netlify dev"
```

- [ ] **Step 5: Levantar y probar el endpoint de salud**

Run:
```bash
npm run dev:netlify
```
En otra terminal:
```bash
curl -s http://localhost:8888/api/health
```
Expected: `{"ok":true,"service":"creditve-api"}`
(Netlify dev sirve en el puerto 8888 por defecto y hace proxy de Vite y de las funciones.)

- [ ] **Step 6: Commit** (confirmar con el usuario antes)

```bash
git add netlify.toml netlify/functions/health.mjs package.json package-lock.json
git commit -m "chore: configurar Netlify Functions + endpoint /api/health"
```

---

## Task 2: Cliente mínimo de Airtable

**Files:**
- Create: `netlify/lib/airtable.mjs`

- [ ] **Step 1: Crear `netlify/lib/airtable.mjs`**

```js
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
```

- [ ] **Step 2: Verificación rápida de variables (sin tocar Airtable)**

Run:
```bash
node -e "import('./netlify/lib/airtable.mjs').then(()=>console.log('módulo OK'))"
```
Expected: `módulo OK` (no debe lanzar errores de sintaxis/import).

- [ ] **Step 3: Commit** (confirmar con el usuario antes)

```bash
git add netlify/lib/airtable.mjs
git commit -m "feat: cliente minimo de Airtable para funciones"
```

---

## Task 3: Lógica de mapeo (TDD) + función `POST /api/solicitud`

**Files:**
- Create: `netlify/lib/mapSolicitud.mjs`
- Create: `tests/mapSolicitud.test.mjs`
- Create: `netlify/functions/solicitud.mjs`
- Modify: `package.json` (script de test)

- [ ] **Step 1: Instalar Vitest y añadir script**

Run:
```bash
npm install -D vitest
```
Añadir a `package.json` en `"scripts"`:
```json
"test": "vitest run"
```

- [ ] **Step 2: Escribir el test que falla `tests/mapSolicitud.test.mjs`**

```js
import { describe, it, expect } from "vitest";
import { mapSolicitud } from "../netlify/lib/mapSolicitud.mjs";

describe("mapSolicitud", () => {
  const input = {
    nombre: "  Ana Pérez ",
    correo: "ana@example.com",
    telefono: "0412-1234567",
    cedula: "V-12.345.678",
  };

  it("usa los nombres de campo reales de la tabla Clientes", () => {
    const f = mapSolicitud(input, "tok-123");
    expect(Object.keys(f).sort()).toEqual(
      ["Cedula", "Celular", "Correo", "Estado", "Nombres", "Token"].sort()
    );
  });

  it("recorta el nombre y fija estado inicial y token", () => {
    const f = mapSolicitud(input, "tok-123");
    expect(f.Nombres).toBe("Ana Pérez");
    expect(f.Estado).toBe("Por Verificar");
    expect(f.Token).toBe("tok-123");
  });

  it("convierte la cédula a número (Cedula es number en Airtable)", () => {
    const f = mapSolicitud(input, "tok-123");
    expect(f.Cedula).toBe(12345678);
    expect(typeof f.Cedula).toBe("number");
  });

  it("omite Cedula si no hay dígitos válidos", () => {
    const f = mapSolicitud({ ...input, cedula: "abc" }, "tok-123");
    expect(f.Cedula).toBeUndefined();
  });
});
```

- [ ] **Step 3: Correr el test y verificar que falla**

Run: `npm test`
Expected: FAIL — `Cannot find module '../netlify/lib/mapSolicitud.mjs'` (aún no existe).

- [ ] **Step 4: Implementar `netlify/lib/mapSolicitud.mjs`**

```js
// Lógica PURA: mapea el payload del formulario a los campos REALES de la
// tabla Clientes. Solo incluye campos que existen hoy en Airtable.
export function mapSolicitud(input, token) {
  const fields = {
    Nombres: String(input.nombre ?? "").trim(),
    Correo: String(input.correo ?? "").trim(),
    Celular: String(input.telefono ?? "").trim(),
    Estado: "Por Verificar",
    Token: token,
  };

  // Cedula es de tipo number en Airtable: extraer solo dígitos.
  const digits = String(input.cedula ?? "").replace(/\D/g, "");
  if (digits.length > 0) {
    fields.Cedula = Number(digits);
  }

  return fields;
}
```

- [ ] **Step 5: Correr el test y verificar que pasa**

Run: `npm test`
Expected: PASS (4 tests).

- [ ] **Step 6: Implementar la función `netlify/functions/solicitud.mjs`**

```js
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
```

- [ ] **Step 7: Probar la función contra Airtable real (integración manual)**

Con `npm run dev:netlify` corriendo, en otra terminal:
```bash
curl -s -X POST http://localhost:8888/api/solicitud \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Prueba QA","correo":"qa@example.com","telefono":"04120000000","cedula":"V-9.999.999"}'
```
Expected: `{"ok":true}`
Verificación: abrir la tabla `Clientes` en Airtable y confirmar un nuevo registro con
`Nombres=Prueba QA`, `Cedula=9999999` (número), `Estado=Por Verificar` y un `Token` con UUID.

- [ ] **Step 8: Commit** (confirmar con el usuario antes)

```bash
git add netlify/lib/mapSolicitud.mjs tests/mapSolicitud.test.mjs netlify/functions/solicitud.mjs package.json package-lock.json
git commit -m "feat: POST /api/solicitud crea el registro del Tramo A con token"
```

---

## Task 4: Conectar el frontend del Tramo A a la función

**Files:**
- Modify: `src/services/airtable.ts`

- [ ] **Step 1: Reemplazar la llamada directa a Airtable por la función**

En `src/services/airtable.ts`, sustituir el cuerpo de `crearSolicitud` para que haga POST a `/api/solicitud` en lugar de a la API de Airtable. Dejar el resto del archivo (tipos) como está por ahora.

```ts
// Crea la solicitud a través del backend (Netlify Function), sin exponer la llave.
export async function crearSolicitud(data: SolicitudData): Promise<void> {
  const res = await fetch('/api/solicitud', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nombre: data.nombre,
      correo: data.correo,
      telefono: data.telefono,
      cedula: data.cedula,
    }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error || 'No se pudo guardar la solicitud')
  }
}
```

- [ ] **Step 2: Ajustar el llamador en `src/App.vue`**

`handlePDF` hoy espera un `recordId` de `crearSolicitud`. Como la función ya no lo devuelve (el token no viaja al cliente en Fase 1), quitar el uso de `airtableRecordId`:

En `src/App.vue`, dentro de `handlePDF`, reemplazar:
```ts
    const recordId = await crearSolicitud({ /* ... */ })
    airtableRecordId.value = recordId
    goNext()
```
por:
```ts
    await crearSolicitud({
      monto: stepData.value.monto,
      cuota: stepData.value.cuota,
      frecuencia: stepData.value.frecuencia,
      nombre: stepData.value.nombre,
      cedula: stepData.value.cedula,
      telefono: stepData.value.telefono,
      correo: stepData.value.correo,
      fuenteIngresos: stepData.value.cuestionario.fuenteIngresos,
      sectorEconomico: stepData.value.cuestionario.sectorEconomico,
      rangoIngresos: stepData.value.cuestionario.rangoIngresos,
      destinoCredito: stepData.value.cuestionario.destinoCredito,
      archivoPDF: data.archivo,
    })
    goNext()
```

Además, eliminar de `src/App.vue` la línea ya sin uso `const airtableRecordId = ref('')`
(su única asignación se quitó arriba), para que `npm run build` no falle por variable
declarada y no usada.

- [ ] **Step 3: Probar el flujo desde la UI**

Con `npm run dev:netlify` corriendo, abrir `http://localhost:8888`, completar el wizard hasta el paso que dispara `crearSolicitud` y enviar.
Expected: sin errores en consola; aparece un nuevo registro correcto en Airtable (`Estado=Por Verificar`, `Token` con UUID).

- [ ] **Step 4: Verificar que el build de tipos pasa**

Run: `npm run build`
Expected: build OK (sin errores de TypeScript por `airtableRecordId`/`crearSolicitud`).

- [ ] **Step 5: Commit** (confirmar con el usuario antes)

```bash
git add src/services/airtable.ts src/App.vue
git commit -m "feat: el Tramo A guarda via /api/solicitud (sin llave en el cliente)"
```

---

## Roadmap de fases siguientes (se planifican aparte, una por plan)

Estas NO son tareas de este plan; son el mapa de los próximos planes (cada uno con su propio detalle TDD):

- **Fase 2 — Cuestionario, monto y PDF:** crear campos en Airtable (cuestionario, `Monto USD`/`Cuota USD`, `PDF Movimientos`), subir el PDF a Netlify Blobs y servirlo con `GET /api/pdf`, guardar el cuestionario.
- **Fase 3 — Tramo B (token sin sesión):** `GET /api/solicitud?token=`, vista `/continuar`, `POST /api/pago-movil`, `POST /api/firmar`; reorganizar el frontend en los dos tramos.
- **Fase 4 — Make y MetaMap:** escenarios de correo (aprobación con enlace+token, contrato) disparados por estado; validar el webhook de MetaMap; congelar `Tasa BCV Aplicada` al firmar.
- **Transversal:** tabla/registro `Config` para el flag de admisión ("lista de espera") y la tasa BCV.
