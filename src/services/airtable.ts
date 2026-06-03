/**
 * Servicio de solicitud (Tramo A) de CreditVE.
 * Habla con el backend (Netlify Function), no con Airtable directo:
 * la llave de Airtable vive solo en el servidor.
 */

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
  pdfBase64?: string
}

// ─── Crear nueva solicitud vía backend ───────────────────
export async function crearSolicitud(data: SolicitudData): Promise<void> {
  const res = await fetch('/api/solicitud', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nombre: data.nombre,
      correo: data.correo,
      telefono: data.telefono,
      cedula: data.cedula,
      fuenteIngresos: data.fuenteIngresos,
      sectorEconomico: data.sectorEconomico,
      rangoIngresos: data.rangoIngresos,
      destinoCredito: data.destinoCredito,
      pdfBase64: data.pdfBase64,
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error || 'No se pudo guardar la solicitud')
  }
}
