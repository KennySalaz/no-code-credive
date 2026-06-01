<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'

const emit = defineEmits<{ next: [data: any]; back: [] }>()

const form = ref({
  fuenteIngresos: '',
  sectorEconomico: '',
  rangoIngresos: '',
  destinoCredito: ''
})
const errors = ref<Record<string, string>>({})
const loading = ref(false)

onMounted(() => {
  gsap.from('.cues-card', { y: 30, opacity: 0, duration: 0.6, ease: 'power3.out' })
  gsap.from('.form-group', { y: 15, opacity: 0, duration: 0.5, stagger: 0.08, delay: 0.2, ease: 'power2.out' })
})

const validate = () => {
  errors.value = {}
  if (!form.value.fuenteIngresos) errors.value.fuenteIngresos = 'Selecciona una opción'
  if (!form.value.sectorEconomico) errors.value.sectorEconomico = 'Selecciona una opción'
  if (!form.value.rangoIngresos) errors.value.rangoIngresos = 'Selecciona una opción'
  if (!form.value.destinoCredito) errors.value.destinoCredito = 'Selecciona una opción'
  return Object.keys(errors.value).length === 0
}

const handleNext = async () => {
  if (!validate()) return
  loading.value = true
  await new Promise(r => setTimeout(r, 600))
  loading.value = false
  gsap.to('.cues-card', { x: -30, opacity: 0, duration: 0.35, ease: 'power2.in', onComplete: () => emit('next', form.value) })
}
</script>

<template>
  <div class="step-cuestionario">
    <div class="cues-card">
      <div class="card-header">
        <div class="step-badge">Paso 3 de 5</div>
        <h2 class="card-title">Cuestionario Socioeconómico</h2>
        <p class="card-sub">Nos ayuda a determinar el mejor crédito para ti</p>
      </div>

      <div class="form-body">
        <div class="form-group">
          <label class="f-label">Principal fuente de ingresos</label>
          <div :class="['f-select-wrap', errors.fuenteIngresos && 'has-error']">
            <svg class="f-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
            </svg>
            <select v-model="form.fuenteIngresos" id="sel-fuente">
              <option value="" disabled>Seleccionar...</option>
              <option value="empleado">Empleado / Asalariado</option>
              <option value="independiente">Trabajador Independiente</option>
              <option value="negocio">Dueño de Negocio</option>
              <option value="informal">Sector Informal</option>
              <option value="remesas">Remesas del Exterior</option>
            </select>
            <svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </div>
          <span v-if="errors.fuenteIngresos" class="f-error">{{ errors.fuenteIngresos }}</span>
        </div>

        <div class="form-group">
          <label class="f-label">Sector económico</label>
          <div :class="['f-select-wrap', errors.sectorEconomico && 'has-error']">
            <svg class="f-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            </svg>
            <select v-model="form.sectorEconomico" id="sel-sector">
              <option value="" disabled>Seleccionar...</option>
              <option value="comercio">Comercio / Ventas al por menor</option>
              <option value="servicios">Servicios</option>
              <option value="tecnologia">Tecnología</option>
              <option value="alimentos">Alimentos y Bebidas</option>
              <option value="salud">Salud</option>
              <option value="educacion">Educación</option>
              <option value="construccion">Construcción</option>
              <option value="otro">Otro</option>
            </select>
            <svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </div>
          <span v-if="errors.sectorEconomico" class="f-error">{{ errors.sectorEconomico }}</span>
        </div>

        <div class="form-group">
          <label class="f-label">Rango de ingresos mensuales (USD)</label>
          <div :class="['f-select-wrap', errors.rangoIngresos && 'has-error']">
            <svg class="f-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
            <select v-model="form.rangoIngresos" id="sel-rango">
              <option value="" disabled>Seleccionar...</option>
              <option value="menos100">Menos de $100</option>
              <option value="100-200">$100 - $200</option>
              <option value="200-400">$200 - $400</option>
              <option value="400-700">$400 - $700</option>
              <option value="mas700">Más de $700</option>
            </select>
            <svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </div>
          <span v-if="errors.rangoIngresos" class="f-error">{{ errors.rangoIngresos }}</span>
        </div>

        <div class="form-group">
          <label class="f-label">Destino del microcrédito</label>
          <div :class="['f-select-wrap', errors.destinoCredito && 'has-error']">
            <svg class="f-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <select v-model="form.destinoCredito" id="sel-destino">
              <option value="" disabled>Seleccionar...</option>
              <option value="capital-trabajo">Capital de trabajo</option>
              <option value="inventario">Inventario / Mercancía</option>
              <option value="equipo">Equipo o herramientas</option>
              <option value="emergencia">Emergencia personal</option>
              <option value="educacion">Educación</option>
              <option value="salud">Gastos médicos / Salud</option>
            </select>
            <svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </div>
          <span v-if="errors.destinoCredito" class="f-error">{{ errors.destinoCredito }}</span>
        </div>
      </div>

      <div class="card-actions">
        <button class="btn-back" @click="$emit('back')" id="btn-back-cues">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Volver
        </button>
        <button class="btn-next" @click="handleNext" :disabled="loading" id="btn-next-cues">
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
.step-cuestionario { max-width: 480px; margin: 0 auto; padding: 0 16px; }

.cues-card {
  background: var(--bg-card); border: 1px solid var(--border); border-radius: 24px;
  overflow: hidden; box-shadow: var(--shadow-card); position: relative;
}
.cues-card::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
  background: linear-gradient(90deg, var(--accent), var(--primary));
}

.card-header { padding: 28px 28px 0; }
.step-badge {
  display: inline-block; background: rgba(108,99,255,0.12); border: 1px solid rgba(108,99,255,0.3);
  color: #a5a0ff; font-size: 11px; font-weight: 600; padding: 4px 12px;
  border-radius: 100px; margin-bottom: 14px;
}
.card-title { font-size: 22px; font-weight: 800; color: var(--text-primary); margin-bottom: 6px; }
.card-sub { font-size: 14px; color: var(--text-secondary); }

.form-body { padding: 24px 28px; display: flex; flex-direction: column; gap: 18px; }
.form-group { display: flex; flex-direction: column; gap: 7px; }
.f-label { font-size: 13px; font-weight: 600; color: var(--text-secondary); }

.f-select-wrap {
  display: flex; align-items: center; gap: 12px;
  background: var(--bg-card-2); border: 1px solid var(--border);
  border-radius: 12px; padding: 14px 16px; transition: all 0.25s; position: relative;
}
.f-select-wrap:focus-within {
  border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-glow);
}
.f-select-wrap.has-error { border-color: var(--danger); }
.f-icon { color: var(--text-muted); flex-shrink: 0; }
.chevron { color: var(--text-muted); flex-shrink: 0; }

.f-select-wrap select {
  background: transparent; border: none; outline: none;
  font-size: 15px; color: var(--text-primary); width: 100%;
  font-family: 'Inter', sans-serif; font-weight: 500;
  appearance: none; -webkit-appearance: none; cursor: pointer;
}
.f-select-wrap select option { background: #1a2235; color: var(--text-primary); }
.f-error { font-size: 11px; color: var(--danger); padding-left: 4px; }

.card-actions { display: flex; gap: 12px; padding: 0 28px 28px; }

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
