<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'

const props = defineProps<{ monto: number; cuota: number; frecuencia: string; nombre: string }>()
const emit = defineEmits<{ back: []; finish: [] }>()

const launched = ref(false)

onMounted(() => {
  gsap.from('.bio-card', { y: 30, opacity: 0, duration: 0.6, ease: 'power3.out' })
  gsap.from('.bio-visual', { scale: 0.8, opacity: 0, duration: 0.7, delay: 0.2, ease: 'back.out(1.5)' })
})

const launchMetaMap = () => {
  launched.value = true
  // En producción: abrir MetaMap SDK
  // window.location.href = 'https://go.metamap.com/...'
  gsap.to('.launch-btn', { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 })
}
</script>

<template>
  <div class="step-biometria">
    <div class="bio-card">
      <div class="card-header">
        <div class="step-badge">Paso 5 de 5</div>
        <h2 class="card-title">Verificación Biométrica</h2>
        <p class="card-sub">Último paso. Confirma tu identidad con tu cédula y una selfie</p>
      </div>

      <!-- Resumen final -->
      <div class="final-summary">
        <div class="fs-header">Resumen de tu solicitud</div>
        <div class="fs-grid">
          <div class="fs-item">
            <span class="fs-label">Solicitante</span>
            <span class="fs-val">{{ nombre }}</span>
          </div>
          <div class="fs-item">
            <span class="fs-label">Monto Solicitado</span>
            <span class="fs-val primary">${{ monto.toLocaleString() }}</span>
          </div>
          <div class="fs-item">
            <span class="fs-label">Cuota {{ frecuencia === 'quincenal' ? 'Quincenal' : 'Mensual' }}</span>
            <span class="fs-val primary">{{ cuota.toLocaleString() }} Bs.</span>
          </div>
          <div class="fs-item">
            <span class="fs-label">Verificación</span>
            <span class="fs-badge">EN PROCESO</span>
          </div>
        </div>
      </div>

      <!-- Visual MetaMap -->
      <div class="bio-visual">
        <div class="face-scan">
          <div class="scan-ring ring1"></div>
          <div class="scan-ring ring2"></div>
          <div class="scan-ring ring3"></div>
          <div class="face-avatar">
            <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <div class="scan-line"></div>
        </div>
        <div class="bio-caption">
          <p class="bio-cap-title">Face Match + OCR Cédula</p>
          <p class="bio-cap-sub">Tecnología biométrica activa · Powered by MetaMap</p>
        </div>
      </div>

      <!-- Steps -->
      <div class="bio-steps">
        <div class="bio-step">
          <div class="bs-num">1</div>
          <div class="bs-text">
            <strong>Fotografía tu cédula</strong>
            <span>Parte frontal y trasera</span>
          </div>
        </div>
        <div class="bio-step">
          <div class="bs-num">2</div>
          <div class="bs-text">
            <strong>Tómate una selfie</strong>
            <span>Biometría facial activa (parpadea)</span>
          </div>
        </div>
        <div class="bio-step">
          <div class="bs-num">3</div>
          <div class="bs-text">
            <strong>Confirmación automática</strong>
            <span>Recibirás una respuesta en minutos</span>
          </div>
        </div>
      </div>

      <!-- CTA -->
      <div class="card-actions">
        <button class="btn-back" @click="$emit('back')" id="btn-back-bio">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Volver
        </button>
        <button class="launch-btn" @click="launchMetaMap" :class="launched && 'launched'" id="btn-launch-metamap">
          <template v-if="!launched">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
            </svg>
            <span>Iniciar Captura de Identidad</span>
          </template>
          <template v-else>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <span>¡Iniciado! Sigue las instrucciones</span>
          </template>
        </button>
      </div>

      <!-- Legal -->
      <p class="legal-note">
        Al continuar aceptas que CreditVE procese tus datos biométricos para verificación de identidad
        conforme a su política de privacidad. Datos encriptados con estándar AES-256.
      </p>
    </div>
  </div>
</template>

<style scoped>
.step-biometria { max-width: 480px; margin: 0 auto; padding: 0 16px; }

.bio-card {
  background: var(--bg-card); border: 1px solid var(--border); border-radius: 24px;
  overflow: hidden; box-shadow: var(--shadow-card); position: relative;
}
.bio-card::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
  background: linear-gradient(90deg, var(--accent), #FF4D6A, var(--primary));
}

.card-header { padding: 28px 28px 0; }
.step-badge {
  display: inline-block; background: rgba(108,99,255,0.12); border: 1px solid rgba(108,99,255,0.3);
  color: #a5a0ff; font-size: 11px; font-weight: 600; padding: 4px 12px;
  border-radius: 100px; margin-bottom: 14px;
}
.card-title { font-size: 22px; font-weight: 800; color: var(--text-primary); margin-bottom: 6px; }
.card-sub { font-size: 14px; color: var(--text-secondary); }

/* Final summary */
.final-summary {
  margin: 20px 28px; background: var(--bg-card-2); border: 1px solid var(--border); border-radius: 16px; overflow: hidden;
}
.fs-header {
  padding: 10px 16px; font-size: 11px; font-weight: 700; letter-spacing: 0.5px;
  text-transform: uppercase; color: var(--text-muted); border-bottom: 1px solid var(--border);
}
.fs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0; }
.fs-item { padding: 12px 16px; border-right: 1px solid var(--border); border-bottom: 1px solid var(--border); }
.fs-item:nth-child(even) { border-right: none; }
.fs-item:nth-child(3), .fs-item:nth-child(4) { border-bottom: none; }
.fs-label { display: block; font-size: 10px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.3px; margin-bottom: 4px; }
.fs-val { font-size: 14px; font-weight: 700; color: var(--text-primary); }
.fs-val.primary { color: var(--primary); }
.fs-badge {
  font-size: 10px; font-weight: 700; padding: 3px 10px; border-radius: 100px;
  background: rgba(108,99,255,0.12); border: 1px solid rgba(108,99,255,0.3); color: #a5a0ff; display: inline-block;
}

/* Face scan visual */
.bio-visual {
  display: flex; flex-direction: column; align-items: center; padding: 28px 28px 16px; gap: 16px;
}
.face-scan {
  position: relative; width: 140px; height: 140px; display: flex; align-items: center; justify-content: center;
}
.scan-ring {
  position: absolute; border-radius: 50%; border: 2px solid;
  animation: spin-slow linear infinite;
}
.ring1 {
  width: 140px; height: 140px; border-color: rgba(0,200,150,0.2) rgba(0,200,150,0.6) rgba(0,200,150,0.2) transparent;
  animation-duration: 3s;
}
.ring2 {
  width: 110px; height: 110px; border-color: transparent rgba(108,99,255,0.5) transparent rgba(108,99,255,0.5);
  animation-duration: 2s; animation-direction: reverse;
}
.ring3 {
  width: 82px; height: 82px; border-color: rgba(0,200,150,0.4) transparent transparent transparent;
  animation-duration: 1.5s;
}
.face-avatar {
  width: 60px; height: 60px; background: rgba(0,200,150,0.1); border: 1px solid rgba(0,200,150,0.3);
  border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--primary);
}
.scan-line {
  position: absolute; left: 50%; transform: translateX(-50%); width: 80%;
  height: 2px; background: linear-gradient(90deg, transparent, var(--primary), transparent);
  border-radius: 1px; animation: scan 2s ease-in-out infinite;
}
@keyframes scan {
  0% { top: 20%; }
  50% { top: 80%; }
  100% { top: 20%; }
}

.bio-caption { text-align: center; }
.bio-cap-title { font-size: 15px; font-weight: 700; color: var(--text-primary); }
.bio-cap-sub { font-size: 12px; color: var(--text-muted); margin-top: 2px; }

/* Steps */
.bio-steps { padding: 0 28px 8px; display: flex; flex-direction: column; gap: 12px; }
.bio-step { display: flex; align-items: center; gap: 14px; }
.bs-num {
  width: 28px; height: 28px; border-radius: 50%; background: rgba(0,200,150,0.12);
  border: 1px solid rgba(0,200,150,0.3); color: var(--primary); font-size: 13px; font-weight: 700;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.bs-text { display: flex; flex-direction: column; gap: 2px; }
.bs-text strong { font-size: 13px; color: var(--text-primary); font-weight: 600; }
.bs-text span { font-size: 11px; color: var(--text-muted); }

/* Actions */
.card-actions { display: flex; gap: 12px; padding: 20px 28px 16px; }

.btn-back {
  display: flex; align-items: center; gap: 8px;
  padding: 14px 20px; border-radius: 12px; border: 1px solid var(--border);
  background: transparent; color: var(--text-secondary); font-size: 14px; font-weight: 600;
  cursor: pointer; transition: all 0.25s;
}
.btn-back:hover { background: var(--bg-card-2); color: var(--text-primary); }

.launch-btn {
  flex: 1; display: flex; align-items: center; justify-content: center; gap: 10px;
  padding: 14px 20px; border-radius: 12px; border: none;
  background: linear-gradient(135deg, var(--accent), #5a51e8);
  color: #fff; font-size: 14px; font-weight: 800; cursor: pointer; transition: all 0.3s;
  box-shadow: 0 4px 20px var(--accent-glow);
}
.launch-btn:hover { transform: translateY(-1px); filter: brightness(1.05); }
.launch-btn.launched { background: linear-gradient(135deg, var(--primary), var(--primary-dark)); color: #000; box-shadow: 0 4px 20px var(--primary-glow); }

.legal-note {
  font-size: 10px; color: var(--text-muted); text-align: center;
  padding: 0 28px 24px; line-height: 1.6;
}
</style>
