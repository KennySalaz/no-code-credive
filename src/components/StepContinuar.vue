<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{ token: string }>()

const cargando = ref(true)
const estado = ref<string>('')        // en_revision | aprobado | completado | rechazado | no_existe | error
const nombre = ref('')

// Form de Pago Móvil
const pmTelefono = ref('')
const pmCedula = ref('')
const pmBanco = ref('')
const bancos = [
  'Banesco', 'Mercantil', 'Banco de Venezuela', 'Provincial (BBVA)',
  'Bicentenario', 'BNC', 'Bancaribe', 'Banplus', 'Venezolano de Crédito', 'Otro',
]

const enviando = ref(false)
const error = ref('')

onMounted(async () => {
  try {
    const res = await fetch(`/api/solicitud?token=${encodeURIComponent(props.token)}`)
    const data = await res.json()
    estado.value = data.estado || 'error'
    nombre.value = data.datos?.nombre || ''
  } catch {
    estado.value = 'error'
  } finally {
    cargando.value = false
  }
})

const confirmar = async () => {
  error.value = ''
  if (!pmTelefono.value || !pmCedula.value || !pmBanco.value) {
    error.value = 'Completa todos los datos de Pago Móvil.'
    return
  }
  enviando.value = true
  try {
    const r1 = await fetch('/api/pago-movil', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: props.token,
        pmTelefono: pmTelefono.value,
        pmCedula: pmCedula.value,
        pmBanco: pmBanco.value,
      }),
    })
    if (!r1.ok) throw new Error((await r1.json())?.error || 'No se pudo guardar el Pago Móvil')

    const r2 = await fetch('/api/firmar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: props.token }),
    })
    if (!r2.ok) throw new Error((await r2.json())?.error || 'No se pudo firmar')

    estado.value = 'completado'
  } catch (e: any) {
    error.value = e.message || 'Ocurrió un error. Intenta de nuevo.'
  } finally {
    enviando.value = false
  }
}
</script>

<template>
  <div class="continuar">
    <div class="cont-card">
      <!-- Cargando -->
      <div v-if="cargando" class="estado-msg">
        <div class="spinner"></div>
        <p>Validando tu enlace…</p>
      </div>

      <!-- En revisión -->
      <div v-else-if="estado === 'en_revision'" class="estado-msg">
        <h2>Tu solicitud está en revisión</h2>
        <p>Estamos revisando tus datos. Te escribiremos al correo cuando esté aprobada.</p>
      </div>

      <!-- Rechazado -->
      <div v-else-if="estado === 'rechazado'" class="estado-msg">
        <h2>Solicitud no aprobada</h2>
        <p>Por ahora no pudimos aprobar tu solicitud. Gracias por tu interés.</p>
      </div>

      <!-- Enlace inválido -->
      <div v-else-if="estado === 'no_existe' || estado === 'error'" class="estado-msg">
        <h2>Enlace inválido</h2>
        <p>Este enlace no es válido o expiró. Revisa el correo que te enviamos.</p>
      </div>

      <!-- Completado / firmado -->
      <div v-else-if="estado === 'completado'" class="estado-msg ok">
        <h2>¡Listo<span v-if="nombre">, {{ nombre }}</span>!</h2>
        <p>Tu contrato quedó firmado. Pronto recibirás el desembolso por Pago Móvil.</p>
      </div>

      <!-- Aprobado: form de Pago Móvil + firmar -->
      <div v-else-if="estado === 'aprobado'" class="form-wrap">
        <h2>¡Has sido pre-aprobado<span v-if="nombre">, {{ nombre }}</span>!</h2>
        <p class="sub">Completa tus datos de Pago Móvil para el desembolso y firma tu contrato.</p>

        <label>Teléfono de Pago Móvil</label>
        <input v-model="pmTelefono" type="tel" placeholder="04141234567" />

        <label>Cédula del titular</label>
        <input v-model="pmCedula" type="text" placeholder="V-12.345.678" />

        <label>Banco</label>
        <select v-model="pmBanco">
          <option value="" disabled>Selecciona tu banco</option>
          <option v-for="b in bancos" :key="b" :value="b">{{ b }}</option>
        </select>

        <p v-if="error" class="err">{{ error }}</p>

        <button class="btn-firmar" :disabled="enviando" @click="confirmar">
          {{ enviando ? 'Procesando…' : 'Confirmar y firmar' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.continuar { max-width: 460px; margin: 0 auto; padding: 0 16px; }
.cont-card {
  background: var(--bg-card); border: 1px solid var(--border); border-radius: 24px;
  padding: 32px 28px; box-shadow: var(--shadow-card);
}
.estado-msg { text-align: center; display: flex; flex-direction: column; gap: 12px; align-items: center; }
.estado-msg h2 { font-size: 22px; font-weight: 800; color: var(--text-primary); }
.estado-msg p { font-size: 14px; color: var(--text-secondary); line-height: 1.6; }
.estado-msg.ok h2 { color: var(--primary); }

.form-wrap h2 { font-size: 22px; font-weight: 800; color: var(--text-primary); margin-bottom: 6px; }
.form-wrap .sub { font-size: 14px; color: var(--text-secondary); margin-bottom: 20px; line-height: 1.5; }
.form-wrap label { display: block; font-size: 13px; color: var(--text-secondary); font-weight: 600; margin: 14px 0 6px; }
.form-wrap input, .form-wrap select {
  width: 100%; padding: 12px 14px; border-radius: 12px;
  border: 1px solid var(--border); background: var(--bg-card-2);
  color: var(--text-primary); font-size: 14px; outline: none;
}
.form-wrap input:focus, .form-wrap select:focus { border-color: var(--primary); }
.err { color: #FF4D6A; font-size: 13px; margin-top: 12px; }
.btn-firmar {
  width: 100%; margin-top: 22px; padding: 16px;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: #000; font-size: 15px; font-weight: 800; border: none; border-radius: 14px;
  cursor: pointer; transition: all 0.2s;
}
.btn-firmar:hover:not(:disabled) { transform: translateY(-1px); }
.btn-firmar:disabled { opacity: 0.6; cursor: not-allowed; }
.spinner {
  width: 36px; height: 36px; border: 3px solid rgba(0,200,150,0.2);
  border-top-color: var(--primary); border-radius: 50%;
  animation: spin-slow 0.8s linear infinite;
}
</style>
