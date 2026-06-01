/**
 * Servicio de Airtable para CreditVE
 * Conecta el formulario directamente con la base de datos
 */

const AIRTABLE_TOKEN = import.meta.env.VITE_AIRTABLE_TOKEN
const BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID
const TABLE = import.meta.env.VITE_AIRTABLE_TABLE || 'Clientes'

const BASE_URL = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE)}`

const headers = {
  'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
  'Content-Type': 'application/json',
}

// ─── Tipos ────────────────────────────────────────────────
export interface SolicitudData {
  // Paso 1: Simulación
  monto: number
  cuota: number
  frecuencia: string

  // Paso 2: Registro
  nombre: string
  cedula: string
  telefono: string
  correo: string

  // Paso 3: Cuestionario
  fuenteIngresos: string
  sectorEconomico: string
  rangoIngresos: string
  destinoCredito: string

  // Paso 4: PDF
  archivoPDF?: string
}

// ─── Crear nuevo registro de solicitud ───────────────────
export async function crearSolicitud(data: SolicitudData): Promise<string> {
  const body = {
    fields: {
      // ── Campos existentes ──
      'Nombres': data.nombre,
      'Correo': data.correo,
      'Cédula': Number(data.cedula),
      'Celular WhatsApp': data.telefono,
      'Estado': 'Por Verificar',

      // ── Nuevos campos del simulador ──
      'Monto Solicitado': data.monto,
      'Cuota': data.cuota,
      'Frecuencia de Pago': data.frecuencia === 'quincenal' ? 'Quincenal' : 'Mensual',

      // ── Nuevos campos del cuestionario ──
      'Fuente de Ingresos': data.fuenteIngresos,
      'Sector Económico': data.sectorEconomico,
      'Rango de Ingresos': data.rangoIngresos,
      'Destino del Crédito': data.destinoCredito,

      // ── PDF (guardamos el nombre como referencia) ──
      'Datos Pago Móvil': data.archivoPDF
        ? `PDF subido: ${data.archivoPDF}`
        : '',

      // ── Verificación biométrica ──
      'Verificación Biométrica': 'Pendiente',
    }
  }

  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const err = await response.json()
    throw new Error(err?.error?.message || 'Error al crear registro en Airtable')
  }

  const result = await response.json()
  return result.id // Devuelve el Record ID de Airtable
}

// ─── Actualizar estado MetaMap ─────────────────────────
// (Lo usa Make.com ya configurado, pero lo dejamos aquí por si acaso)
export async function actualizarEstado(recordId: string, estado: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/${recordId}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ fields: { 'Estado': estado } }),
  })

  if (!response.ok) {
    const err = await response.json()
    throw new Error(err?.error?.message || 'Error al actualizar registro')
  }
}
