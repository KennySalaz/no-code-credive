<script setup lang="ts">
import { onMounted } from 'vue'
import { gsap } from 'gsap'

const props = defineProps<{ nombre?: string }>()
const emit = defineEmits<{ home: [] }>()

const primerNombre = (props.nombre || '').trim().split(/\s+/)[0] || ''

onMounted(() => {
  gsap.from('.enviado-card', { y: 30, opacity: 0, duration: 0.6, ease: 'power3.out' })
  gsap.from('.enviado-illus', { scale: 0.6, opacity: 0, duration: 0.7, ease: 'back.out(1.7)', delay: 0.15 })
  gsap.from('.enviado-step', { x: -18, opacity: 0, duration: 0.5, stagger: 0.12, delay: 0.45, ease: 'power2.out' })
})
</script>

<template>
  <div class="step-enviado">
    <div class="enviado-card">
      <div class="enviado-illus">
        <svg width="148" height="148" viewBox="0 0 200 200" fill="none">
          <circle cx="100" cy="100" r="92" fill="url(#ev-g)" opacity="0.08" />
          <circle cx="100" cy="100" r="68" fill="url(#ev-g)" opacity="0.10" />
          <rect x="46" y="66" width="108" height="76" rx="13" fill="var(--bg-card-2)" stroke="var(--primary)" stroke-width="3" />
          <path d="M51 75 L100 110 L149 75" fill="none" stroke="var(--primary)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
          <circle cx="146" cy="134" r="23" fill="var(--primary)" />
          <path d="M135 134 l7.5 7.5 l13 -15" fill="none" stroke="#04130d" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" />
          <circle cx="42" cy="48" r="3" fill="var(--primary)" opacity="0.7" />
          <circle cx="162" cy="52" r="4" fill="var(--accent)" opacity="0.6" />
          <circle cx="34" cy="118" r="2.5" fill="var(--accent)" opacity="0.6" />
          <circle cx="170" cy="110" r="2.5" fill="var(--primary)" opacity="0.5" />
          <defs>
            <linearGradient id="ev-g" x1="0" y1="0" x2="200" y2="200">
              <stop stop-color="var(--primary)" /><stop offset="1" stop-color="var(--accent)" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <h2 class="enviado-title">¡Solicitud recibida<span v-if="primerNombre">, {{ primerNombre }}</span>!</h2>
      <p class="enviado-msg">
        Estamos revisando tu solicitud. Te avisaremos el resultado por correo
        en un plazo de <strong>hasta 48 horas</strong>.
      </p>
      <p class="enviado-note">Revisa tu bandeja de entrada (y la carpeta de spam por si acaso).</p>

      <div class="enviado-steps">
        <div class="enviado-step done">
          <div class="es-dot">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12" /></svg>
          </div>
          <div class="es-txt"><span class="es-t">Solicitud recibida</span><span class="es-s">¡Listo!</span></div>
        </div>
        <div class="enviado-step">
          <div class="es-dot es-pulse"></div>
          <div class="es-txt"><span class="es-t">En revisión</span><span class="es-s">Hasta 48 horas</span></div>
        </div>
        <div class="enviado-step">
          <div class="es-dot"></div>
          <div class="es-txt"><span class="es-t">Resultado por correo</span><span class="es-s">Te llegará el estatus</span></div>
        </div>
      </div>

      <button class="enviado-btn" @click="emit('home')">Volver al inicio</button>
    </div>
  </div>
</template>

<style scoped>
.step-enviado { max-width: 480px; margin: 0 auto; padding: 0 16px; }
.enviado-card {
  background: var(--bg-card); border: 1px solid var(--border); border-radius: 24px;
  padding: 36px 28px; text-align: center; box-shadow: var(--shadow-card); position: relative; overflow: hidden;
}
.enviado-card::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
  background: linear-gradient(90deg, var(--primary), var(--accent));
}
.enviado-illus { display: flex; justify-content: center; margin-bottom: 6px; }
.enviado-title { font-size: 24px; font-weight: 800; color: var(--text-primary); margin-bottom: 10px; }
.enviado-msg { font-size: 15px; color: var(--text-secondary); line-height: 1.6; margin-bottom: 8px; }
.enviado-msg strong { color: var(--primary); }
.enviado-note { font-size: 13px; color: var(--text-muted); margin-bottom: 24px; }

.enviado-steps {
  text-align: left; display: flex; flex-direction: column; gap: 14px; margin-bottom: 26px;
  background: var(--bg-card-2); border: 1px solid var(--border); border-radius: 14px; padding: 18px;
}
.enviado-step { display: flex; align-items: center; gap: 14px; }
.es-dot {
  width: 26px; height: 26px; border-radius: 50%; border: 2px solid var(--border); flex-shrink: 0;
  display: flex; align-items: center; justify-content: center; color: #04130d;
}
.enviado-step.done .es-dot { background: var(--primary); border-color: var(--primary); }
.es-pulse { background: var(--primary); border-color: var(--primary); animation: es-pulse 1.7s ease-in-out infinite; }
@keyframes es-pulse {
  0%, 100% { box-shadow: 0 0 0 0 var(--primary-glow); }
  50% { box-shadow: 0 0 0 7px transparent; }
}
.es-txt { display: flex; flex-direction: column; gap: 1px; }
.es-t { font-size: 14px; font-weight: 700; color: var(--text-primary); }
.es-s { font-size: 12px; color: var(--text-muted); }

.enviado-btn {
  width: 100%; padding: 14px 24px; border-radius: 12px; border: none;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: #000; font-size: 15px; font-weight: 800; cursor: pointer; transition: all 0.3s;
  box-shadow: 0 4px 20px var(--primary-glow);
}
.enviado-btn:hover { transform: translateY(-1px); filter: brightness(1.05); }
</style>
