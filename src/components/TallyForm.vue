<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

const emit = defineEmits<{
  (e: 'submit', email: string): void
}>()

const handleTallyMessage = (event: MessageEvent) => {
  // Asegurarnos de que el mensaje viene de Tally
  if (event.origin !== 'https://tally.so') return

  try {
    if (typeof event.data === 'string' && event.data.includes('Tally.FormSubmitted')) {
      const data = JSON.parse(event.data)
      if (data.event === 'Tally.FormSubmitted') {
        const fields = data.payload?.fields || []
        console.log('Campos de Tally recibidos:', JSON.stringify(fields, null, 2))
        
        // Buscar el campo que sea tipo email o que contenga "correo" / "email" en su etiqueta
        const emailField = fields.find((f: any) => 
          f.type === 'INPUT_EMAIL' || 
          f.type?.toLowerCase() === 'email' ||
          f.label?.toLowerCase().includes('correo') ||
          f.label?.toLowerCase().includes('email')
        )
        
        const email = emailField ? emailField.value : ''
        console.log('Formulario de Tally detectado. Email capturado:', email)
        emit('submit', email)
      }
    }
  } catch (error) {
    console.error('Error al parsear el mensaje de Tally:', error)
  }
}

onMounted(() => {
  window.addEventListener('message', handleTallyMessage)

  const TALLY_SCRIPT_URL = 'https://tally.so/widgets/embed.js'

  const loadEmbeds = () => {
    if (typeof (window as any).Tally !== 'undefined') {
      ;(window as any).Tally.loadEmbeds()
    } else {
      document.querySelectorAll('iframe[data-tally-src]:not([src])').forEach((el) => {
        const iframe = el as HTMLIFrameElement
        iframe.src = iframe.dataset.tallySrc || ''
      })
    }
  }

  if (typeof (window as any).Tally !== 'undefined') {
    loadEmbeds()
  } else if (!document.querySelector(`script[src="${TALLY_SCRIPT_URL}"]`)) {
    const script = document.createElement('script')
    script.src = TALLY_SCRIPT_URL
    script.onload = loadEmbeds
    script.onerror = loadEmbeds
    document.body.appendChild(script)
  }
})

onUnmounted(() => {
  window.removeEventListener('message', handleTallyMessage)
})
</script>

<template>
  <div class="w-full">
    <div class="mb-6 text-center">
      <h2 class="text-2xl font-bold text-white">Completa tus datos</h2>
      <p class="text-gray-400 text-sm mt-1">Tu información está cifrada y segura.</p>
    </div>

    <!-- Formulario Tally embebido -->
    <div class="rounded-xl overflow-hidden">
      <iframe
        data-tally-src="https://tally.so/embed/5BMjro?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
        loading="lazy"
        width="100%"
        height="200"
        frameborder="0"
        marginheight="0"
        marginwidth="0"
        title="Registro CreoPay"
      ></iframe>
    </div>
  </div>
</template>
