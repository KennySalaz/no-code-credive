<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'

const props = defineProps<{
  email: string
}>()

const verificationDone = ref(false)
const verificationError = ref(false)

const metadataString = computed(() => {
  return JSON.stringify({ email: props.email })
})

onMounted(() => {
  // Cargar el script del SDK de MetaMap
  const script = document.createElement('script')
  script.src = 'https://web-button.metamap.com/button.js'
  script.async = true
  document.body.appendChild(script)

  script.onload = () => {
    const btn = document.querySelector('metamap-button')
    if (!btn) return

    // Evento: Usuario completó el flujo exitosamente
    btn.addEventListener('metamap:userFinishedSdk', (e: any) => {
      console.log('MetaMap verificación completada:', e.detail)
      verificationDone.value = true
    })

    // Evento: Usuario salió sin completar
    btn.addEventListener('metamap:exitedSdk', (e: any) => {
      console.log('MetaMap: el usuario salió sin completar', e.detail)
      verificationError.value = true
    })
  }
})
</script>

<template>
  <div class="w-full max-w-md mx-auto">
    <div class="text-center mb-8">
      <div class="w-16 h-16 bg-brand-500/20 text-brand-400 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
      </div>
      <h2 class="text-3xl font-bold text-white">Validemos tu identidad</h2>
      <p class="text-gray-400 mt-2 text-sm">Necesitamos una selfie y una foto de tu cédula. Tomará menos de 1 minuto.</p>
    </div>

    <div class="bg-gray-800 rounded-2xl border border-gray-700 p-8 shadow-2xl">
      
      <!-- Estado: Completado exitosamente -->
      <div v-if="verificationDone" class="text-center py-6">
        <div class="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-400"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        </div>
        <h3 class="text-green-400 font-bold text-xl">¡Verificación Enviada!</h3>
        <p class="text-gray-400 text-sm mt-2">Recibirás una respuesta en breve. Nuestro equipo revisará tu información.</p>
      </div>

      <!-- Estado: Salió sin completar -->
      <div v-else-if="verificationError" class="text-center py-6">
        <div class="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-yellow-400"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <h3 class="text-yellow-400 font-bold text-xl">Verificación Incompleta</h3>
        <p class="text-gray-400 text-sm mt-2">Parece que no terminaste el proceso. Puedes intentarlo de nuevo.</p>
        <button @click="verificationError = false" class="mt-4 text-brand-400 text-sm underline">Intentar de nuevo</button>
      </div>

      <!-- Estado: Inicial - Mostrar botón MetaMap -->
      <div v-else class="flex flex-col items-center gap-6">
        <div class="text-center text-gray-400 text-sm space-y-2">
          <p>📸 Ten lista tu <strong class="text-white">cédula de identidad</strong></p>
          <p>🤳 Asegúrate de tener buena <strong class="text-white">iluminación</strong></p>
          <p>📱 Permite el acceso a tu <strong class="text-white">cámara</strong> cuando se solicite</p>
        </div>

        <!-- Botón SDK de MetaMap -->
        <metamap-button
          clientid="6a18b6084616eb37196f011c"
          flowid="6a18b6084616eb37196f011a"
          color="#14b8a6"
          :metadata="metadataString"
        ></metamap-button>
      </div>

    </div>

    <div class="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
      <span>Verificación segura con tecnología MetaMap</span>
    </div>
  </div>
</template>

