# Backend CreditVE — Diseño (flujo en 2 tramos por correo, sin sesión)

Fecha: 2026-06-02
Estado: borrador para revisión

## 1. Contexto y objetivo

CreditVE es una SPA (Vue 3 + Vite) de solicitud de microcrédito. El flujo definitivo
del cliente parte el proceso en **dos visitas web separadas en el tiempo**, unidas por un
**correo**, con una **aprobación manual interna** en el medio:

1. Datos (registro básico, con "switch de lista de espera")
2. Cuestionario (preguntas financieras cortas)
3. Movimientos (carga obligatoria de PDF, últimos 2 meses) — **aquí se frena**
4. Aprobación (el equipo revisa PDF + cuestionario en Airtable y aprueba) → correo
5. Biometría (MetaMap) + datos de Pago Móvil (entra **desde el correo**)
6. Contrato (acepta con 1 clic) → contrato por correo → desembolso por Pago Móvil

**No hay sesión / login.** El reto es retomar el flujo correcto cuando el cliente vuelve
desde el correo. Hoy, además, el formulario habla con Airtable directo desde el navegador
con la llave **expuesta en el bundle** (riesgo de seguridad).

Objetivo de este backend:
- Esconder la llave de Airtable (server-side).
- Implementar la "sesión sin sesión" mediante un **token** en el enlace del correo.
- Cubrir los huecos actuales: subida real del PDF y reanudación del Tramo B.

## 2. Decisiones tomadas (brainstorming)

- **Proveedor:** Netlify (hosting del sitio + funciones serverless, free tier comercial).
- **Arquitectura:** Funciones Netlify como única puerta a Airtable; **Make solo para correos**.
- **Ya existe y se reutiliza:** Airtable (datos reales), Make (escenarios andando),
  MetaMap (flujo real). **Los correos del flujo nuevo aún no salen** → se montan en Make.
- **PDF:** se guarda en Netlify Blobs; en Airtable queda un link servido por una función.
- **Token:** UUID, un solo uso (se cierra al firmar), caduca a los 7 días de la aprobación.

## 3. Arquitectura

```
Navegador (Vue + Vite SPA)
  Vista "/"               -> Tramo A (pasos 1-3)
  Vista "/continuar?token=" -> Tramo B (pasos 5-6)
        |  fetch /api/*
        v
Funciones Netlify (/api/*)   <- ÚNICA puerta a Airtable; llave en env del servidor
        |              |               |
        v              v               v
   Airtable        Netlify Blobs    (lee) Tasa BCV
   estado+token    PDF
        |
        | cambios de estado
        v
      Make  ->  Correos (link con token, contrato)
   MetaMap --webhook--> actualiza estado en Airtable
```

Principios:
- El navegador **no** habla con Airtable. La llave vive en variables de entorno de Netlify.
- Una sola SPA, dos vistas según la URL. Sin login. Implica **reorganizar el wizard actual**
  (hoy 5 pasos de corrido) en: Tramo A = Datos → Cuestionario → Movimientos (crea la solicitud
  al final del Tramo A), y una vista nueva `/continuar` para el Tramo B.
- Airtable sigue siendo la base de la verdad (el equipo revisa/aprueba ahí).
- Make solo reacciona a cambios de estado para enviar correos.

## 4. Funciones (`/api/*`)

Se exponen como `/api/x` vía redirect en `netlify.toml` (físicamente en
`netlify/functions/`). Cada función valida sus inputs y responde JSON `{ ok, data?, error? }`.

| Función | Tramo | Entrada | Acción | Salida |
|---|---|---|---|---|
| `POST /api/solicitud` | A | datos + cuestionario + PDF (multipart) | Sube PDF a Blobs; crea registro en Airtable con `Token` (UUID) y estado inicial (según `Admisión abierta`). | `{ ok: true }` (sin token ni datos sensibles) |
| `GET /api/solicitud?token=` | B | token | Valida token y caducidad. Solo si estado = `Aprobado` devuelve datos mínimos para reanudar; si ya firmó devuelve `completado`; si no, `no_disponible`. | `{ ok, estado, datos? }` |
| `POST /api/pago-movil` | B | token + teléfono, cédula titular, banco | Guarda datos de Pago Móvil en el registro del token. | `{ ok: true }` |
| `POST /api/firmar` | B | token | Marca `Contrato firmado` y congela `Tasa BCV Aplicada`. Cierra el token. | `{ ok: true }` |
| `GET /api/tasa` | A y B | — | Lee la tasa BCV del día desde Airtable. | `{ ok, tasa }` |
| `GET /api/pdf?token=` | interno | token | Sirve el PDF de movimientos desde Blobs (para que el equipo lo abra desde Airtable). | PDF |

La biometría de MetaMap se lanza desde el navegador (su SDK, ya integrado en
`MetaMapVerify.vue`); su **resultado entra por webhook** (ver §6).

## 5. Datos

### 5.1 Variables de entorno (Netlify, server-side)
- `AIRTABLE_TOKEN`, `AIRTABLE_BASE_ID`, `AIRTABLE_TABLE` (migran desde los `VITE_*` actuales;
  dejan de viajar al cliente).
- `SITE_URL` (para construir el enlace del correo).

### 5.2 Campos en Airtable (tabla `Clientes`, base `appvdH…` = "CreoPay MVP")
Esquema REAL (vía Meta API) — única tabla `Clientes`:
- `Nombres` [singleLineText]
- `Cedula` [number]  ← es número, no texto
- `Celular` [phoneNumber]
- `Correo` [email]
- `Datos Pago Móvil` [multilineText]
- `Estado` [singleSelect]: `Por Verificar` | `Verificado` | `Activo` | `Mora` | `Blacklist`
- `Fecha de Desembolso` [date]
- `Dias Transcurridos` [formula]

> HALLAZGO: el código actual (`src/services/airtable.ts`) escribe nombres que NO coinciden
> con la tabla real — `Cédula` (con tilde) vs `Cedula`, `Celular WhatsApp` vs `Celular`— y
> varios campos inexistentes (`Monto Solicitado`, `Cuota`, `Frecuencia de Pago`,
> `Fuente de Ingresos`, `Sector Económico`, `Rango de Ingresos`, `Destino del Crédito`,
> `Verificación Biométrica`). Airtable rechaza campos desconocidos, así que el guardado
> actual probablemente falla. El backend debe usar los nombres EXACTOS de la tabla.

Campos a crear para el flujo nuevo:
- `Token` (texto, único) — llave del enlace de continuación.
- `Token Expira` (fecha) — caducidad (7 días tras aprobación).
- `PDF Movimientos` (URL) — link servido por `/api/pdf`.
- `PM Teléfono`, `PM Cédula Titular`, `PM Banco` — datos de Pago Móvil (hoy hay un solo campo
  de texto libre `Datos Pago Móvil`; se desglosa).
- `Tasa BCV Aplicada` (número) — tasa congelada al firmar (para el desembolso).
- `Monto USD`, `Cuota USD` — montos internos en USD (referencia; se muestran en Bs al cliente).
- `MetaMap ID` (texto, opcional) — referencia de la verificación.
- Campos para el cuestionario (paso 2): definir y crear (`Fuente de Ingresos`, etc.).

### 5.3 Máquina de estados (`Estado`)
El single-select REAL ya tiene: `Por Verificar`, `Verificado`, `Activo`, `Mora`, `Blacklist`
(los tres últimos son de cobranza). Se concilia el flujo nuevo REUSANDO los existentes y
AGREGANDO solo los que faltan (agregar opciones a un select no rompe nada; cambiar el
significado de las actuales sí, por eso se respeta):

```
(Tramo A)       (equipo)      (Tramo B)      (Tramo B)            (desembolso)  (cobranza)
Por Verificar ─► Aprobado* ─► Verificado ─► Contrato Firmado* ─► Activo ─► Mora / Blacklist
     │           (correo)     (MetaMap OK)   (correo + PDF)
     └─► Rechazado*
```
- NUEVOS a agregar al select: `Aprobado`, `Contrato Firmado`, `Rechazado`.
- REUSADOS: `Por Verificar` (fin Tramo A), `Verificado` (biometría OK), `Activo` (desembolsado).
- COBRANZA intacta: `Activo`, `Mora`, `Blacklist` (los maneja Make como hoy).

> A VALIDAR con Make: confirmar qué dispara Make en cada estado existente, para reusar
> `Por Verificar` / `Verificado` sin efectos colaterales. Se valida al montar los escenarios
> de correo (paso 6 del plan).

### 5.4 "Switch de lista de espera"
Un flag de configuración en Airtable (`Admisión abierta`, checkbox). `POST /api/solicitud`
lo lee: si está abierta → estado inicial `En revisión`; si cerrada → `Lista de espera`.

## 6. Flujo end-to-end

**Tramo A (público, sin token):**
1. Usuario completa Datos + Cuestionario + sube PDF.
2. `POST /api/solicitud`: sube PDF a Blobs, genera `Token`, crea registro
   (`En revisión` o `Lista de espera`). Pantalla "te avisamos por correo".

**Aprobación (interno):**
3. El equipo revisa en Airtable (abre `PDF Movimientos`), define `Monto/Cuota USD`,
   cambia estado a `Aprobado` (o `Rechazado`).
4. Make detecta `Aprobado` → envía correo con `SITE_URL/continuar?token=<Token>` y fija
   `Token Expira` = hoy + 7 días.

**Tramo B (desde el correo, con token):**
5. Cliente abre el enlace. La vista llama `GET /api/solicitud?token=`; si `Aprobado`,
   muestra el paso de Biometría + Pago Móvil.
6. MetaMap (SDK) → al terminar, su **webhook** marca `Biometría OK`
   (destino a validar: Make existente o función `/api/metamap-webhook`).
7. `POST /api/pago-movil` guarda teléfono, cédula titular y banco.
8. Contrato: la web muestra el monto en Bs (USD × tasa del día). `POST /api/firmar`
   marca `Contrato firmado`, congela `Tasa BCV Aplicada` y cierra el token.
9. Make detecta `Contrato firmado` → envía contrato en PDF por correo y avisa al equipo.
10. El equipo desembolsa por Pago Móvil y marca `Activo`.

## 7. Seguridad y manejo de errores

- Llave de Airtable solo en env de Netlify; el navegador nunca la ve.
- Funciones validan input y responden `{ ok:false, error }` con código HTTP adecuado.
- Token: UUID v4; búsqueda exacta; **un solo uso** (tras `Contrato firmado` el Tramo B
  responde `completado`); caducidad de 7 días.
- Idempotencia: reabrir un token ya usado o caducado no permite re-firmar.
- PDF: validar tipo `application/pdf` y tamaño máximo (p. ej. 10 MB).
- `/api/pdf` protegido por el mismo token (link interno en Airtable). Endurecible con URL
  firmada en el futuro.
- Webhook de MetaMap: validar secreto/firma.
- CORS: funciones solo aceptan el propio dominio.
- El front ya tiene patrón de banner de error reutilizable.

## 8. Pruebas y plan incremental ("ir probando")

Local con `netlify dev` (levanta Vite + funciones juntos; las env van en `.env` local).
Orden sugerido, probando en cada paso antes de seguir:

1. Configurar Netlify (`netlify.toml`, redirect `/api/*`) + `GET /api/tasa` leyendo Airtable. Probar.
2. `POST /api/solicitud` + conectar el front del Tramo A. Probar creando una solicitud real.
3. PDF a Blobs + `GET /api/pdf`. Probar que el equipo abra el PDF desde Airtable.
4. `GET /api/solicitud?token=` + vista `/continuar`. Probar reanudación.
5. `POST /api/pago-movil` + `POST /api/firmar`. Probar Tramo B completo.
6. Escenarios de Make: correo de aprobación (con token) y de contrato. Probar end-to-end.

## 9. Riesgos / pendientes a validar

- **Valores del campo `Estado`:** OBTENIDOS — `Por Verificar, Verificado, Activo, Mora,
  Blacklist`. La máquina de estados los reutiliza y agrega `Aprobado, Contrato Firmado,
  Rechazado`. PENDIENTE validar qué dispara Make en cada uno para no afectar la cobranza.
- **Config / "lista de espera" y tasa BCV:** hoy solo existe la tabla `Clientes` (no hay tabla
  de config). El flag de admisión y la tasa BCV irán en una tabla `Config` nueva o como
  variables de entorno de Netlify (a definir en el plan).
- **Nombres de campos:** usar los reales de la tabla (`Cedula`, `Celular`, …), no los del
  código actual (que está desalineado).
- **Webhook de MetaMap:** ver si hoy lo recibe Make y reusarlo, o crear función propia.
- **Monto aprobado:** RESUELTO — lo define el equipo en la aprobación: **$90 netos, cuota
  $62**. El simulador del front, si se mantiene, es solo orientativo.
- **Fuente de la tasa BCV:** Make ya maneja "tasa BCV"; reusar esa fuente/celda.
- **Tamaño del PDF** vs límites de Blobs (holgado, pero fijar máximo).

## 10. Fuera de alcance (YAGNI)

- Login / cuentas de usuario.
- Panel de administración propio (se usa Airtable).
- Pagos/cobranza automatizada (la cobranza por WhatsApp ya la maneja Make aparte).
- Migrar Airtable a otra base de datos.
