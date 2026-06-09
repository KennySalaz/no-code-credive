<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { gsap } from 'gsap'
import { esTelefonoVEValido, formatearTelefonoVE } from '../utils/telefono'
import { cedulaExiste } from '../services/airtable'

const props = defineProps<{ monto: number; cuota: number; frecuencia: string }>()
const emit = defineEmits<{ next: [data: any]; back: [] }>()

const STORAGE_KEY = 'creditve_registro'

const form = ref({ nombre: '', cedula: '', telefono: '', correo: '', confirmarCorreo: '' })
const errors = ref<Record<string, string>>({})
const loading = ref(false)
const cedulaChecking = ref(false)
const cedulaDuplicada = ref(false)
const cedulaVerificada = ref(false)
let cedulaTimer: ReturnType<typeof setTimeout> | undefined

// Restaura lo escrito si recargan la página (se borra al enviar la solicitud).
try {
  const guardado = localStorage.getItem(STORAGE_KEY)
  if (guardado) Object.assign(form.value, JSON.parse(guardado))
} catch {}
watch(form, (v) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(v)) } catch {}
}, { deep: true })

// Validez por campo: alimenta el check verde y habilita el botón "Continuar".
const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const nombreOk = computed(() => form.value.nombre.trim().length >= 3)
const cedulaOk = computed(() => {
  const c = String(form.value.cedula).replace(/\D/g, '')
  return c.length >= 6 && c.length <= 8 && cedulaVerificada.value && !cedulaDuplicada.value
})
const telefonoOk = computed(() => esTelefonoVEValido(form.value.telefono))
const correoOk = computed(() => correoRegex.test(form.value.correo))
const confirmarOk = computed(() =>
  correoOk.value &&
  form.value.correo.trim().toLowerCase() === form.value.confirmarCorreo.trim().toLowerCase()
)
const puedeAvanzar = computed(() =>
  nombreOk.value && cedulaOk.value && telefonoOk.value && correoOk.value && confirmarOk.value
)

onMounted(() => {
  gsap.from('.reg-card', { y: 30, opacity: 0, duration: 0.6, ease: 'power3.out' })
  gsap.from('.form-group', { y: 15, opacity: 0, duration: 0.5, stagger: 0.08, delay: 0.2, ease: 'power2.out' })
  // Si se restauró una cédula válida (recarga), verifícala de una vez.
  const ced = String(form.value.cedula).replace(/\D/g, '')
  if (ced.length >= 6 && ced.length <= 8) verificarCedula(ced)
})

const validate = () => {
  errors.value = {}
  if (!nombreOk.value) errors.value.nombre = 'Ingresa tu nombre completo'
  const ced = String(form.value.cedula).replace(/\D/g, '')
  if (ced.length < 6 || ced.length > 8) errors.value.cedula = 'Ingresa una cédula válida (6 a 8 dígitos)'
  else if (cedulaDuplicada.value) errors.value.cedula = 'Ya existe una solicitud con esta cédula.'
  if (!telefonoOk.value) errors.value.telefono = 'Ingresa un celular venezolano válido (ej: 0414-123-4567)'
  if (!correoOk.value) errors.value.correo = 'Ingresa un correo válido'
  if (!confirmarOk.value) errors.value.confirmarCorreo = 'Los correos no coinciden'
  return Object.keys(errors.value).length === 0
}

// Al salir del campo: da formato lindo al teléfono y valida que sea VE.
const onTelefonoBlur = () => {
  if (!form.value.telefono) return
  if (esTelefonoVEValido(form.value.telefono)) {
    form.value.telefono = formatearTelefonoVE(form.value.telefono)
    delete errors.value.telefono
  } else {
    errors.value.telefono = 'Ingresa un celular venezolano válido (ej: 0414-123-4567)'
  }
}

// Verifica la cédula contra el backend. Muestra loading dentro del input y
// solo da el check verde cuando confirma que la cédula está libre.
async function verificarCedula(ced: string) {
  cedulaChecking.value = true
  const dup = await cedulaExiste(ced)
  if (String(form.value.cedula).replace(/\D/g, '') !== ced) return // cambió mientras esperaba
  cedulaDuplicada.value = dup
  cedulaVerificada.value = true
  cedulaChecking.value = false
  if (dup) errors.value.cedula = 'Ya existe una solicitud con esta cédula.'
}

// Dispara la verificación mientras el usuario escribe, con un pequeño retraso.
watch(() => form.value.cedula, () => {
  cedulaVerificada.value = false
  cedulaDuplicada.value = false
  if (errors.value.cedula) errors.value.cedula = ''
  if (cedulaTimer) clearTimeout(cedulaTimer)
  const ced = String(form.value.cedula).replace(/\D/g, '')
  if (ced.length < 6 || ced.length > 8) { cedulaChecking.value = false; return }
  cedulaChecking.value = true
  cedulaTimer = setTimeout(() => verificarCedula(ced), 500)
})

const handleNext = async () => {
  if (!validate()) return
  loading.value = true
  await new Promise(r => setTimeout(r, 400))
  loading.value = false
  gsap.to('.reg-card', { x: -30, opacity: 0, duration: 0.35, ease: 'power2.in', onComplete: () => emit('next', form.value) })
}
</script>

<template>
  <div class="step-registro">
    <!-- Summary bar -->
    <div class="summary-bar">
      <div class="summary-item">
        <span class="sum-label">Monto</span>
        <span class="sum-val">${{ monto.toLocaleString() }}</span>
      </div>
      <div class="sum-divider"></div>
      <div class="summary-item">
        <span class="sum-label">Cuota {{ frecuencia }}</span>
        <span class="sum-val">{{ cuota.toLocaleString() }} Bs.</span>
      </div>
      <div class="sum-divider"></div>
      <div class="summary-item">
        <span class="sum-label">Plazo</span>
        <span class="sum-val">1 {{ frecuencia === 'quincenal' ? 'quincena' : 'mes' }}</span>
      </div>
    </div>

    <div class="reg-card">
      <div class="card-header">
        <div class="step-badge">Paso 2 de 5</div>
        <h2 class="card-title">Información Personal</h2>
        <p class="card-sub">Necesitamos tus datos básicos para crear tu perfil</p>
      </div>

      <div class="form-body">
        <div class="form-group">
          <label class="f-label">Nombre Completo</label>
          <div :class="['f-input-wrap', errors.nombre && 'has-error']">
            <svg class="f-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            <input v-model="form.nombre" type="text" placeholder="Ej: María González" id="input-nombre" />
            <svg v-if="nombreOk" class="f-check" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
          </div>
          <span v-if="errors.nombre" class="f-error">{{ errors.nombre }}</span>
        </div>

        <div class="form-group">
          <label class="f-label">Cédula de Identidad</label>
          <div :class="['f-input-wrap', errors.cedula && 'has-error']">
            <svg class="f-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="5" width="20" height="14" rx="2"/><path d="M16 10H8M12 14H8"/>
            </svg>
            <input v-model="form.cedula" type="text" inputmode="numeric" placeholder="Ej: 23693479" id="input-cedula" />
            <div v-if="cedulaChecking" class="f-spinner"></div>
            <svg v-else-if="cedulaOk" class="f-check" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
          </div>
          <span v-if="errors.cedula" class="f-error">{{ errors.cedula }}</span>
        </div>

        <div class="form-group">
          <label class="f-label">Teléfono Celular (WhatsApp)</label>
          <div :class="['f-input-wrap', errors.telefono && 'has-error']">
            <svg class="f-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 10.27a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            <input v-model="form.telefono" @blur="onTelefonoBlur" type="tel" placeholder="Ej: 0414-123-4567" id="input-telefono" />
            <svg v-if="telefonoOk" class="f-check" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
          </div>
          <span v-if="errors.telefono" class="f-error">{{ errors.telefono }}</span>
        </div>

        <div class="form-group">
          <label class="f-label">Correo Electrónico</label>
          <div :class="['f-input-wrap', errors.correo && 'has-error']">
            <svg class="f-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
            </svg>
            <input v-model="form.correo" type="email" placeholder="correo@ejemplo.com" id="input-correo" />
            <svg v-if="correoOk" class="f-check" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
          </div>
          <span v-if="errors.correo" class="f-error">{{ errors.correo }}</span>
        </div>

        <div class="form-group">
          <label class="f-label">Confirmar Correo</label>
          <div :class="['f-input-wrap', errors.confirmarCorreo && 'has-error']">
            <svg class="f-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
            </svg>
            <input v-model="form.confirmarCorreo" type="email" placeholder="Repite tu correo" id="input-confirmar-correo" />
            <svg v-if="confirmarOk" class="f-check" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
          </div>
          <span v-if="errors.confirmarCorreo" class="f-error">{{ errors.confirmarCorreo }}</span>
        </div>
      </div>

      <div class="card-actions">
        <button class="btn-back" @click="$emit('back')" id="btn-back-reg">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Volver
        </button>
        <button class="btn-next" @click="handleNext" :disabled="loading || !puedeAvanzar" id="btn-next-reg">
          <span v-if="!loading">Continuar</span>
          <div v-else class="spinner"></div>
          <svg v-if="!loading" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.step-registro { max-width: 480px; margin: 0 auto; padding: 0 16px; }

.summary-bar {
  display: flex; align-items: center; justify-content: center; gap: 20px;
  background: rgba(0,200,150,0.06); border: 1px solid rgba(0,200,150,0.15);
  border-radius: 14px; padding: 14px 20px; margin-bottom: 24px;
}
.summary-item { text-align: center; }
.sum-label { display: block; font-size: 10px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
.sum-val { font-size: 16px; font-weight: 700; color: var(--primary); }
.sum-divider { width: 1px; height: 32px; background: var(--border); }

.reg-card {
  background: var(--bg-card); border: 1px solid var(--border); border-radius: 24px;
  overflow: hidden; box-shadow: var(--shadow-card); position: relative;
}
.reg-card::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
  background: linear-gradient(90deg, var(--primary), var(--accent));
}

.card-header { padding: 28px 28px 0; }
.step-badge {
  display: inline-block; background: rgba(108,99,255,0.12); border: 1px solid rgba(108,99,255,0.3);
  color: #a5a0ff; font-size: 11px; font-weight: 600; padding: 4px 12px;
  border-radius: 100px; margin-bottom: 14px; letter-spacing: 0.3px;
}
.card-title { font-size: 22px; font-weight: 800; color: var(--text-primary); margin-bottom: 6px; }
.card-sub { font-size: 14px; color: var(--text-secondary); }

.form-body { padding: 24px 28px; display: flex; flex-direction: column; gap: 18px; }

.form-group { display: flex; flex-direction: column; gap: 7px; }
.f-label { font-size: 13px; font-weight: 600; color: var(--text-secondary); }

.f-input-wrap {
  display: flex; align-items: center; gap: 12px;
  background: var(--bg-card-2); border: 1px solid var(--border);
  border-radius: 12px; padding: 14px 16px; transition: all 0.25s;
}
.f-input-wrap:focus-within {
  border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-glow);
}
.f-input-wrap.has-error { border-color: var(--danger); }
.f-icon { color: var(--text-muted); flex-shrink: 0; }

.f-input-wrap input {
  background: transparent; border: none; outline: none;
  font-size: 15px; color: var(--text-primary); flex: 1; min-width: 0;
  font-family: 'Inter', sans-serif; font-weight: 500;
}
.f-input-wrap input::placeholder { color: var(--text-muted); font-weight: 400; }
.f-error { font-size: 11px; color: var(--danger); padding-left: 4px; }
.f-hint { font-size: 11px; color: var(--text-muted); padding-left: 4px; }
.f-check { color: var(--primary); flex-shrink: 0; }
.f-spinner {
  width: 16px; height: 16px; flex-shrink: 0;
  border: 2px solid var(--border); border-top-color: var(--primary);
  border-radius: 50%; animation: f-spin 0.7s linear infinite;
}
@keyframes f-spin { to { transform: rotate(360deg); } }

.card-actions {
  display: flex; gap: 12px; padding: 0 28px 28px;
}
.btn-back {
  display: flex; align-items: center; gap: 8px;
  padding: 14px 20px; border-radius: 12px; border: 1px solid var(--border);
  background: transparent; color: var(--text-secondary); font-size: 14px; font-weight: 600;
  cursor: pointer; transition: all 0.25s;
}
.btn-back:hover { background: var(--bg-card-2); color: var(--text-primary); }

.btn-next {
  flex: 1; display: flex; align-items: center; justify-content: center; gap: 10px;
  padding: 14px 24px; border-radius: 12px; border: none;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: #000; font-size: 15px; font-weight: 800; cursor: pointer; transition: all 0.3s;
  box-shadow: 0 4px 20px var(--primary-glow);
}
.btn-next:hover:not(:disabled) { transform: translateY(-1px); filter: brightness(1.05); }
.btn-next:disabled { opacity: 0.7; cursor: not-allowed; }

.spinner {
  width: 18px; height: 18px; border: 2px solid rgba(0,0,0,0.3);
  border-top-color: #000; border-radius: 50%; animation: spin-slow 0.7s linear infinite;
}
</style>
