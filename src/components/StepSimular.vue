<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { gsap } from 'gsap'

const emit = defineEmits<{ next: [data: { monto: number; cuota: number; frecuencia: string }] }>()

const monto = ref(1200)
const frecuencia = ref('quincenal')
const MIN = 500
const MAX = 2500

const tasaBCV = ref(549.37)

// Interés simple del 8% quincenal, 15% mensual
const tasaInteres = computed(() => frecuencia.value === 'quincenal' ? 0.08 : 0.15)

const cuotaUSD = computed(() => monto.value * (1 + tasaInteres.value))
const cuotaVES = computed(() => Math.round(cuotaUSD.value * tasaBCV.value))
const montoVES = computed(() => Math.round(monto.value * tasaBCV.value))

const sliderPercent = computed(() => ((monto.value - MIN) / (MAX - MIN)) * 100)

onMounted(() => {
  gsap.from('.sim-card', { y: 40, opacity: 0, duration: 0.8, ease: 'power3.out' })
  gsap.from('.sim-hero', { y: -20, opacity: 0, duration: 0.6, delay: 0.2, ease: 'power2.out' })
  gsap.from('.sim-features li', {
    x: -20, opacity: 0, duration: 0.5, stagger: 0.1, delay: 0.4, ease: 'power2.out'
  })
})

const handleNext = () => {
  gsap.to('.sim-card', {
    scale: 0.95, opacity: 0, y: -20, duration: 0.4, ease: 'power2.in',
    onComplete: () => emit('next', { monto: monto.value, cuota: cuotaVES.value, frecuencia: frecuencia.value })
  })
}
</script>

<template>
  <div class="step-simular">
    <!-- Hero section -->
    <div class="sim-hero text-center mb-10">
      <div class="badge-chip">
        <span class="chip-dot"></span>
        Microcrédito Express · Venezuela
      </div>
      <h1 class="hero-title">
        Tu dinero,<br>
        <span class="gradient-text">cuando lo necesitas</span>
      </h1>
      <p class="hero-sub">Simula tu microcrédito en segundos. Sin papeleo, sin filas, 100% digital.</p>
    </div>

    <!-- Simulator card -->
    <div class="sim-card">
      <div class="sim-card-header">
        <div class="sim-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
          </svg>
        </div>
        <div>
          <h2 class="sim-title">Simulador de Crédito</h2>
          <p class="sim-sub">Indexado a la tasa oficial BCV</p>
        </div>
        <div class="bcv-badge">BCV: {{ tasaBCV.toFixed(2) }} Bs/$</div>
      </div>

      <!-- Amount slider -->
      <div class="sim-field">
        <label class="sim-label">¿Cuánto necesitas?</label>
        <div class="amount-display">
          <span class="amount-value">${{ monto.toLocaleString() }}</span>
          <span class="amount-ves">≈ {{ montoVES.toLocaleString() }} Bs.</span>
        </div>
        <div class="slider-wrap">
          <input
            type="range"
            :min="MIN"
            :max="MAX"
            :step="100"
            v-model="monto"
            :style="`background: linear-gradient(to right, var(--primary) ${sliderPercent}%, var(--border) ${sliderPercent}%)`"
          />
          <div class="slider-labels">
            <span>${{ MIN }}</span>
            <span>${{ MAX }}</span>
          </div>
        </div>
      </div>

      <!-- Frequency -->
      <div class="sim-field">
        <label class="sim-label">¿Cuándo pagas?</label>
        <div class="freq-tabs">
          <button
            :class="['freq-tab', frecuencia === 'quincenal' && 'active']"
            @click="frecuencia = 'quincenal'"
          >
            1 Quincena
          </button>
          <button
            :class="['freq-tab', frecuencia === 'mensual' && 'active']"
            @click="frecuencia = 'mensual'"
          >
            1 Mes
          </button>
        </div>
      </div>

      <!-- Result -->
      <div class="sim-result">
        <div class="result-label">Tu cuota única a pagar</div>
        <div class="result-amount">{{ cuotaVES.toLocaleString() }} <span>Bs.</span></div>
        <div class="result-detail">
          ${{ cuotaUSD.toFixed(2) }} USD · Incluye intereses + indexación BCV oficial
        </div>
      </div>

      <!-- CTA -->
      <button class="btn-cta" @click="handleNext" id="btn-solicitar">
        <span>Solicitar mi Crédito Ahora</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </button>

      <!-- Trust badges -->
      <div class="trust-row">
        <span class="trust-item">🔒 100% Seguro</span>
        <span class="trust-item">⚡ Respuesta en minutos</span>
        <span class="trust-item">🇻🇪 Hecho en Venezuela</span>
      </div>
    </div>

    <!-- Features -->
    <ul class="sim-features">
      <li>
        <div class="feat-icon">✓</div>
        <div><strong>Sin garante</strong> — Proceso completamente individual</div>
      </li>
      <li>
        <div class="feat-icon">✓</div>
        <div><strong>100% Digital</strong> — Desde tu teléfono en minutos</div>
      </li>
      <li>
        <div class="feat-icon">✓</div>
        <div><strong>Tasa BCV</strong> — Transparente e indexada al dólar oficial</div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.step-simular { max-width: 520px; margin: 0 auto; padding: 0 16px; }

/* Hero */
.sim-hero { padding-top: 8px; }
.badge-chip {
  display: inline-flex; align-items: center; gap: 8px;
  background: rgba(0,200,150,0.1); border: 1px solid rgba(0,200,150,0.3);
  color: var(--primary); font-size: 12px; font-weight: 600; letter-spacing: 0.5px;
  padding: 6px 14px; border-radius: 100px; margin-bottom: 20px;
}
.chip-dot {
  width: 7px; height: 7px; border-radius: 50%; background: var(--primary);
  animation: pulse-glow 2s ease-in-out infinite;
}
.hero-title {
  font-size: clamp(2rem, 5vw, 2.8rem); font-weight: 900; line-height: 1.1;
  color: var(--text-primary); margin-bottom: 14px; letter-spacing: -1px;
}
.gradient-text {
  background: linear-gradient(135deg, var(--primary), var(--accent));
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.hero-sub { color: var(--text-secondary); font-size: 16px; line-height: 1.6; }

/* Card */
.sim-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 24px;
  padding: 28px;
  margin: 32px 0;
  box-shadow: var(--shadow-card);
  position: relative;
  overflow: hidden;
}
.sim-card::before {
  content: '';
  position: absolute; top: 0; left: 0; right: 0; height: 3px;
  background: linear-gradient(90deg, var(--primary), var(--accent));
}

.sim-card-header {
  display: flex; align-items: center; gap: 12px; margin-bottom: 28px;
}
.sim-icon {
  width: 44px; height: 44px; background: rgba(0,200,150,0.12);
  border: 1px solid rgba(0,200,150,0.3); border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  color: var(--primary); flex-shrink: 0;
}
.sim-title { font-size: 17px; font-weight: 700; color: var(--text-primary); }
.sim-sub { font-size: 12px; color: var(--text-secondary); margin-top: 2px; }
.bcv-badge {
  margin-left: auto; background: rgba(108,99,255,0.12);
  border: 1px solid rgba(108,99,255,0.3); color: #a5a0ff;
  font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 100px;
  white-space: nowrap;
}

/* Fields */
.sim-field { margin-bottom: 24px; }
.sim-label { font-size: 13px; color: var(--text-secondary); font-weight: 500; margin-bottom: 12px; display: block; }

.amount-display { display: flex; align-items: baseline; gap: 10px; margin-bottom: 14px; }
.amount-value { font-size: 36px; font-weight: 800; color: var(--primary); letter-spacing: -1px; }
.amount-ves { font-size: 14px; color: var(--text-muted); }

.slider-wrap { position: relative; }
.slider-labels { display: flex; justify-content: space-between; font-size: 11px; color: var(--text-muted); margin-top: 8px; }

/* Freq tabs */
.freq-tabs { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.freq-tab {
  padding: 12px; border-radius: 12px; border: 1px solid var(--border);
  background: transparent; color: var(--text-secondary); font-size: 14px; font-weight: 600;
  cursor: pointer; transition: all 0.25s;
}
.freq-tab.active {
  background: rgba(0,200,150,0.12); border-color: var(--primary); color: var(--primary);
  box-shadow: 0 0 16px var(--primary-glow);
}

/* Result */
.sim-result {
  background: linear-gradient(135deg, rgba(0,200,150,0.08), rgba(108,99,255,0.08));
  border: 1px solid rgba(0,200,150,0.2); border-radius: 16px;
  padding: 20px; text-align: center; margin-bottom: 24px;
}
.result-label { font-size: 12px; color: var(--text-secondary); font-weight: 500; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
.result-amount { font-size: 40px; font-weight: 900; color: var(--primary); letter-spacing: -2px; line-height: 1; }
.result-amount span { font-size: 20px; font-weight: 700; }
.result-detail { font-size: 11px; color: var(--text-muted); margin-top: 8px; }

/* CTA */
.btn-cta {
  width: 100%; padding: 18px 24px;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: #000; font-size: 16px; font-weight: 800;
  border: none; border-radius: 14px; cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 10px;
  transition: all 0.3s; letter-spacing: -0.3px;
  box-shadow: 0 4px 24px var(--primary-glow);
  margin-bottom: 16px;
}
.btn-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 32px var(--primary-glow); filter: brightness(1.05); }
.btn-cta:active { transform: translateY(0); }

/* Trust */
.trust-row { display: flex; justify-content: center; gap: 16px; flex-wrap: wrap; }
.trust-item { font-size: 11px; color: var(--text-muted); }

/* Features */
.sim-features { list-style: none; display: flex; flex-direction: column; gap: 12px; }
.sim-features li { display: flex; align-items: flex-start; gap: 12px; }
.feat-icon {
  width: 28px; height: 28px; border-radius: 8px; background: rgba(0,200,150,0.12);
  border: 1px solid rgba(0,200,150,0.3); color: var(--primary);
  display: flex; align-items: center; justify-content: center; font-size: 12px; flex-shrink: 0;
}
.sim-features li div { font-size: 14px; color: var(--text-secondary); line-height: 1.5; }
.sim-features li div strong { color: var(--text-primary); }
</style>
