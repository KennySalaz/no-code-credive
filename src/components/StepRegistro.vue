<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'

const props = defineProps<{ monto: number; cuota: number; frecuencia: string }>()
const emit = defineEmits<{ next: [data: any]; back: [] }>()

const form = ref({ nombre: '', cedula: '', telefono: '', correo: '' })
const errors = ref<Record<string, string>>({})
const loading = ref(false)

onMounted(() => {
  gsap.from('.reg-card', { y: 30, opacity: 0, duration: 0.6, ease: 'power3.out' })
  gsap.from('.form-group', { y: 15, opacity: 0, duration: 0.5, stagger: 0.08, delay: 0.2, ease: 'power2.out' })
})

const validate = () => {
  errors.value = {}
  if (!form.value.nombre.trim()) errors.value.nombre = 'El nombre es requerido'
  if (!form.value.cedula || form.value.cedula.length < 6) errors.value.cedula = 'Ingresa una cédula válida'
  if (!form.value.telefono || form.value.telefono.length < 10) errors.value.telefono = 'Ingresa un teléfono válido'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.correo)) errors.value.correo = 'Ingresa un correo válido'
  return Object.keys(errors.value).length === 0
}

const handleNext = async () => {
  if (!validate()) return
  loading.value = true
  await new Promise(r => setTimeout(r, 600))
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
          </div>
          <span v-if="errors.nombre" class="f-error">{{ errors.nombre }}</span>
        </div>

        <div class="form-group">
          <label class="f-label">Cédula de Identidad</label>
          <div :class="['f-input-wrap', errors.cedula && 'has-error']">
            <svg class="f-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="5" width="20" height="14" rx="2"/><path d="M16 10H8M12 14H8"/>
            </svg>
            <input v-model="form.cedula" type="number" placeholder="Ej: 23693479" id="input-cedula" />
          </div>
          <span v-if="errors.cedula" class="f-error">{{ errors.cedula }}</span>
        </div>

        <div class="form-group">
          <label class="f-label">Teléfono Celular (WhatsApp)</label>
          <div :class="['f-input-wrap', errors.telefono && 'has-error']">
            <svg class="f-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 10.27a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            <input v-model="form.telefono" type="tel" placeholder="Ej: +58 412 000 0000" id="input-telefono" />
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
          </div>
          <span v-if="errors.correo" class="f-error">{{ errors.correo }}</span>
        </div>
      </div>

      <div class="card-actions">
        <button class="btn-back" @click="$emit('back')" id="btn-back-reg">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Volver
        </button>
        <button class="btn-next" @click="handleNext" :disabled="loading" id="btn-next-reg">
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
  font-size: 15px; color: var(--text-primary); width: 100%;
  font-family: 'Inter', sans-serif; font-weight: 500;
}
.f-input-wrap input::placeholder { color: var(--text-muted); font-weight: 400; }
.f-error { font-size: 11px; color: var(--danger); padding-left: 4px; }

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
