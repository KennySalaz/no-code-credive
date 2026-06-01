# CreoPay MVP - Copilot Instructions

## Proyecto
Plataforma de microcréditos (lending) MVP construida en Next.js 14 (App Router) + TypeScript + Tailwind CSS.

## Stack Técnico
- **Framework:** Next.js 14 App Router
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **Formulario:** Tally.so (embed + webhook)
- **Biometría:** MetaMap SDK (Face Match + OCR cédula)
- **Base de datos:** Airtable (via REST API)
- **Automatización:** Make.com (WhatsApp + tasa BCV)

## Flujo del Usuario
1. Landing → Formulario Tally (datos identidad + pago móvil)
2. Webhook Tally → Airtable (estado: Por Verificar)
3. MetaMap SDK (selfie + cédula) → Webhook MetaMap → Airtable (estado: Por Desembolsar)
4. Admin desembolsa → estado: Activo → Make.com activa cobranza WhatsApp

## Variables de Entorno (.env.local)
- AIRTABLE_API_KEY
- AIRTABLE_BASE_ID
- AIRTABLE_TABLE_NAME
- METAMAP_CLIENT_ID
- METAMAP_FLOW_ID
- METAMAP_WEBHOOK_SECRET
- TALLY_WEBHOOK_SECRET

## Convenciones
- Rutas API en /app/api/
- Componentes en /components/
- Tipos en /types/
- Usar server components por defecto, client components solo cuando sea necesario
