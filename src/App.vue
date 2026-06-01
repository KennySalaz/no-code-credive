<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { gsap } from 'gsap'
import StepSimular from './components/StepSimular.vue'
import StepRegistro from './components/StepRegistro.vue'
import StepCuestionario from './components/StepCuestionario.vue'
import StepPDF from './components/StepPDF.vue'
import StepBiometria from './components/StepBiometria.vue'
import LandingHome from './components/LandingHome.vue'
import { crearSolicitud } from './services/airtable'

const isWizardOpen = ref(false)
const currentStep = ref(1)
const totalSteps = 5

// Listado de temas disponibles
const themes = [
  { name: 'default', color: '#00C896', label: 'Esmeralda' },
  { name: 'theme-ocean', color: '#00B2FE', label: 'Zafiro' },
  { name: 'theme-grape', color: '#9D4EDD', label: 'Amatista' },
  { name: 'theme-sunset', color: '#FF5E3A', label: 'Fuego' },
  { name: 'theme-volt', color: '#CCFF00', label: 'Volt' }
]

const activeTheme = ref(localStorage.getItem('creditve-theme') || 'default')

const changeTheme = (themeName: string) => {
  activeTheme.value = themeName
  localStorage.setItem('creditve-theme', themeName)
}

const stepData = ref({
  monto: 1200,
  cuota: 0,
  frecuencia: 'quincenal',
  nombre: '',
  cedula: '',
  telefono: '',
  correo: '',
  cuestionario: {} as any,
  pdf: '' as any
})

const airtableRecordId = ref('')
const submitting = ref(false)
const submitError = ref('')

const stepLabels = ['Simular', 'Registro', 'Perfil', 'Ingresos', 'Identidad']

const progressWidth = computed(() => `${((currentStep.value - 1) / (totalSteps - 1)) * 100}%`)

const animateIn = (dir: 1 | -1 = 1) => {
  const el = document.querySelector('.step-content')
  if (!el) return
  gsap.fromTo(el,
    { x: dir * 40, opacity: 0 },
    { x: 0, opacity: 1, duration: 0.45, ease: 'power2.out' }
  )
}

const goNext = (data?: any) => {
  if (currentStep.value < totalSteps) {
    if (data) Object.assign(stepData.value, data)
    currentStep.value++
    setTimeout(() => animateIn(1), 10)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const goBack = () => {
  if (currentStep.value > 1) {
    currentStep.value--
    setTimeout(() => animateIn(-1), 10)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    // Si vuelve atrás desde el paso 1, cerramos el wizard y volvemos al home
    isWizardOpen.value = false
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const startWizard = (step = 1) => {
  isWizardOpen.value = true
  currentStep.value = step
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const resetToHome = () => {
  isWizardOpen.value = false
  currentStep.value = 1
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleSimular = (data: { monto: number; cuota: number; frecuencia: string }) => {
  stepData.value.monto = data.monto
  stepData.value.cuota = data.cuota
  stepData.value.frecuencia = data.frecuencia
  currentStep.value = 2
  setTimeout(() => animateIn(1), 10)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleRegistro = (data: any) => {
  Object.assign(stepData.value, data)
  goNext()
}

const handleCuestionario = (data: any) => {
  stepData.value.cuestionario = data
  goNext()
}

const handlePDF = async (data: any) => {
  stepData.value.pdf = data
  submitting.value = true
  submitError.value = ''
  try {
    const recordId = await crearSolicitud({
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
    airtableRecordId.value = recordId
    goNext()
  } catch (err: any) {
    submitError.value = err.message || 'Error al guardar los datos. Intenta de nuevo.'
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  // Ambient background particles
  gsap.to('.bg-orb-1', { y: -30, x: 20, duration: 6, repeat: -1, yoyo: true, ease: 'sine.inOut' })
  gsap.to('.bg-orb-2', { y: 20, x: -15, duration: 8, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1 })
  gsap.to('.bg-orb-3', { y: -15, x: 10, duration: 5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 2 })
})
</script>

<template>
  <div :class="['app-shell', activeTheme]">
    <!-- Ambient BG orbs -->
    <div class="bg-orb bg-orb-1"></div>
    <div class="bg-orb bg-orb-2"></div>
    <div class="bg-orb bg-orb-3"></div>

    <!-- Navbar -->
    <nav class="navbar">
      <div class="nav-inner">
        <div class="nav-logo" @click="resetToHome" style="cursor: pointer;">
          <div class="logo-mark">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <span class="logo-text">Credit<span class="logo-ve">VE</span></span>
        </div>
        
        <!-- Controles de Tema -->
        <div class="theme-selector-wrap">
          <button 
            v-for="t in themes" 
            :key="t.name" 
            :class="['theme-dot-btn', activeTheme === t.name && 'active']"
            :style="{ backgroundColor: t.color }"
            :title="t.label"
            @click="changeTheme(t.name)"
          ></button>
        </div>

        <div class="nav-badge" v-if="!isWizardOpen">
          <span class="nav-dot"></span>
          Sistema seguro
        </div>
        <button class="nav-back-home" v-else @click="resetToHome">
          ✕ Cancelar
        </button>
      </div>
    </nav>

    <!-- Main content -->
    <main class="main-wrap">
      
      <!-- Home Informativo -->
      <LandingHome v-if="!isWizardOpen" @startWizard="startWizard" />

      <!-- Wizard de Solicitud en 5 Pasos -->
      <div v-else class="wizard-container">
        <!-- Stepper (hidden on step 1) -->
        <div v-if="currentStep > 1" class="stepper-wrap">
          <div class="stepper-bar">
            <div class="stepper-progress" :style="{ width: progressWidth }"></div>
          </div>
          <div class="stepper-steps">
            <div
              v-for="(label, i) in stepLabels"
              :key="i"
              :class="['stepper-step', currentStep > i + 1 && 'done', currentStep === i + 1 && 'active']"
            >
              <div class="step-dot">
                <svg v-if="currentStep > i + 1" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span v-else>{{ i + 1 }}</span>
              </div>
              <span class="step-label">{{ label }}</span>
            </div>
          </div>
        </div>

        <!-- Steps -->
        <div class="step-content">
          <Transition name="slide" mode="out-in">
            <StepSimular v-if="currentStep === 1" @next="handleSimular" />
            <StepRegistro
              v-else-if="currentStep === 2"
              :monto="stepData.monto"
              :cuota="stepData.cuota"
              :frecuencia="stepData.frecuencia"
              @next="handleRegistro"
              @back="goBack"
            />
            <StepCuestionario
              v-else-if="currentStep === 3"
              @next="handleCuestionario"
              @back="goBack"
            />
            <StepPDF
              v-else-if="currentStep === 4"
              :monto="stepData.monto"
              :cuota="stepData.cuota"
              :frecuencia="stepData.frecuencia"
              :submitting="submitting"
              @next="handlePDF"
              @back="goBack"
            />
            <StepBiometria
              v-else-if="currentStep === 5"
              :monto="stepData.monto"
              :cuota="stepData.cuota"
              :frecuencia="stepData.frecuencia"
              :nombre="stepData.nombre"
              @back="goBack"
              @finish="() => {}"
            />
          </Transition>

          <!-- Sending overlay -->
          <div v-if="submitting" class="sending-overlay">
            <div class="sending-card">
              <div class="sending-spinner"></div>
              <p class="sending-title">Guardando tu solicitud...</p>
              <p class="sending-sub">Registrando tus datos de forma segura</p>
            </div>
          </div>

          <!-- Error banner -->
          <div v-if="submitError" class="error-banner">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>{{ submitError }}</span>
            <button class="error-close" @click="submitError = ''">✕</button>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="app-footer">
      <p>© 2025 CreditVE · Microcrédito Express Digital</p>
      <div class="footer-badges">
        <span>🔐 SSL</span>
        <span>🛡️ AES-256</span>
        <span>⚡ MetaMap KYC</span>
      </div>
    </footer>
  </div>
</template>

<style>
/* Transitions */
.slide-enter-active, .slide-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-enter-from { opacity: 0; transform: translateX(30px); }
.slide-leave-to { opacity: 0; transform: translateX(-30px); }
</style>

<style scoped>
/* Shell */
.app-shell {
  min-height: 100vh; display: flex; flex-direction: column;
  background: var(--bg-dark); position: relative; overflow-x: hidden;
}

/* BG orbs */
.bg-orb {
  position: fixed; border-radius: 50%; pointer-events: none; z-index: 0; filter: blur(80px);
}
.bg-orb-1 {
  width: 500px; height: 500px; top: -150px; right: -100px;
  background: radial-gradient(circle, var(--orb-color-1) 0%, transparent 70%);
}
.bg-orb-2 {
  width: 400px; height: 400px; bottom: 100px; left: -150px;
  background: radial-gradient(circle, var(--orb-color-2) 0%, transparent 70%);
}
.bg-orb-3 {
  width: 300px; height: 300px; top: 40%; left: 50%; transform: translateX(-50%);
  background: radial-gradient(circle, var(--orb-color-3) 0%, transparent 70%);
}

/* Navbar */
.navbar {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  background: rgba(7, 11, 20, 0.85); backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
}
.nav-inner {
  max-width: 680px; margin: 0 auto; padding: 0 20px; height: 60px;
  display: flex; align-items: center; justify-content: space-between;
}
.nav-logo { display: flex; align-items: center; gap: 10px; }
.logo-mark {
  width: 36px; height: 36px; border-radius: 10px;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  display: flex; align-items: center; justify-content: center; color: #000;
}
.logo-text { font-size: 20px; font-weight: 900; color: var(--text-primary); letter-spacing: -0.5px; }
.logo-ve { color: var(--primary); }

.nav-badge {
  display: flex; align-items: center; gap: 7px;
  font-size: 12px; color: var(--text-secondary); font-weight: 500;
}
.nav-dot {
  width: 7px; height: 7px; border-radius: 50%; background: var(--primary);
  animation: pulse-glow 2s ease-in-out infinite;
}
.nav-back-home {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border);
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}
.nav-back-home:hover {
  background: rgba(255, 77, 106, 0.1);
  border-color: rgba(255, 77, 106, 0.3);
  color: #FF4D6A;
}

/* Selector de temas */
.theme-selector-wrap {
  display: flex; gap: 8px; align-items: center;
  background: rgba(255,255,255,0.03); border: 1px solid var(--border);
  padding: 4px 8px; border-radius: 100px;
}
.theme-dot-btn {
  width: 14px; height: 14px; border-radius: 50%; border: 2px solid transparent;
  cursor: pointer; transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0.6; padding: 0; outline: none;
}
.theme-dot-btn:hover {
  transform: scale(1.3); opacity: 1;
}
.theme-dot-btn.active {
  border-color: var(--text-primary); transform: scale(1.2); opacity: 1;
  box-shadow: 0 0 10px rgba(255,255,255,0.2);
}

/* Main */
.main-wrap {
  flex: 1; padding: 80px 0 40px; position: relative; z-index: 1;
}

/* Stepper */
.stepper-wrap {
  max-width: 480px; margin: 0 auto 32px; padding: 0 20px;
}
.stepper-bar {
  height: 4px; background: rgba(255,255,255,0.06); border-radius: 2px;
  margin-bottom: 16px; position: relative; overflow: visible;
}
.stepper-progress {
  height: 100%; background: linear-gradient(90deg, var(--primary), var(--accent));
  border-radius: 2px; transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0 10px var(--primary-glow);
}
.stepper-steps {
  display: flex; justify-content: space-between;
}
.stepper-step {
  display: flex; flex-direction: column; align-items: center; gap: 6px;
}
.step-dot {
  width: 28px; height: 28px; border-radius: 50%;
  border: 2px solid var(--border); background: var(--bg-dark);
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 700; color: var(--text-muted);
  transition: all 0.4s; position: relative;
}
.stepper-step.active .step-dot {
  border-color: var(--primary); color: var(--primary); background: rgba(0,200,150,0.1);
  box-shadow: 0 0 12px var(--primary-glow);
}
.stepper-step.done .step-dot {
  border-color: var(--primary); background: var(--primary); color: #000;
}
.step-label {
  font-size: 10px; color: var(--text-muted); font-weight: 500;
  transition: color 0.3s;
}
.stepper-step.active .step-label { color: var(--primary); font-weight: 700; }
.stepper-step.done .step-label { color: var(--text-secondary); }

/* Step content */
.step-content { position: relative; }

/* Footer */
.app-footer {
  padding: 20px; text-align: center; border-top: 1px solid var(--border);
  font-size: 12px; color: var(--text-muted); position: relative; z-index: 1;
  display: flex; flex-direction: column; gap: 8px; align-items: center;
}
.footer-badges { display: flex; gap: 16px; font-size: 11px; }

/* Sending overlay */
.sending-overlay {
  position: fixed; inset: 0; z-index: 200;
  background: rgba(7,11,20,0.85); backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center;
}
.sending-card {
  background: var(--bg-card); border: 1px solid rgba(0,200,150,0.2);
  border-radius: 24px; padding: 40px 48px; text-align: center;
  box-shadow: 0 20px 60px rgba(0,0,0,0.5);
}
.sending-spinner {
  width: 48px; height: 48px; border: 3px solid rgba(0,200,150,0.2);
  border-top-color: var(--primary); border-radius: 50%;
  animation: spin-slow 0.8s linear infinite; margin: 0 auto 20px;
}
.sending-title { font-size: 18px; font-weight: 700; color: var(--text-primary); margin-bottom: 6px; }
.sending-sub { font-size: 14px; color: var(--text-secondary); }

/* Error banner */
.error-banner {
  position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
  z-index: 200; max-width: 440px; width: calc(100% - 32px);
  background: rgba(255,77,106,0.1); border: 1px solid rgba(255,77,106,0.4);
  border-radius: 14px; padding: 14px 16px;
  display: flex; align-items: center; gap: 12px;
  color: #FF4D6A; font-size: 13px; font-weight: 500;
  box-shadow: 0 8px 32px rgba(255,77,106,0.2);
}
.error-banner svg { flex-shrink: 0; }
.error-banner span { flex: 1; }
.error-close {
  background: transparent; border: none; color: #FF4D6A;
  font-size: 16px; cursor: pointer; padding: 0 4px; flex-shrink: 0;
}
</style>
