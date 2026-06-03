<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'

const props = defineProps<{ monto: number; cuota: number; frecuencia: string }>()
const emit = defineEmits<{ next: [data: any]; back: [] }>()

const archivo = ref<File | null>(null)
const isDragging = ref(false)
const uploading = ref(false)
const uploaded = ref(false)

onMounted(() => {
  gsap.from('.pdf-card', { y: 30, opacity: 0, duration: 0.6, ease: 'power3.out' })
})

const onFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files?.[0]) setFile(target.files[0])
}

const setFile = (file: File) => {
  if (file.type !== 'application/pdf') {
    alert('Solo se aceptan archivos PDF')
    return
  }
  if (file.size > 4 * 1024 * 1024) {
    alert('El archivo no debe superar 4MB')
    return
  }
  archivo.value = file
}

const onDrop = (e: DragEvent) => {
  isDragging.value = false
  const file = e.dataTransfer?.files[0]
  if (file) setFile(file)
}

const removeFile = () => { archivo.value = null; uploaded.value = false }

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result).split(',')[1] ?? '')
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

const handleNext = async () => {
  if (!archivo.value) return
  uploading.value = true
  const pdfBase64 = await fileToBase64(archivo.value)
  uploading.value = false
  uploaded.value = true
  await new Promise(r => setTimeout(r, 800))
  gsap.to('.pdf-card', { x: -30, opacity: 0, duration: 0.35, ease: 'power2.in',
    onComplete: () => emit('next', { archivo: archivo.value?.name, pdfBase64 })
  })
}

const formatSize = (bytes: number) => {
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}
</script>

<template>
  <div class="step-pdf">
    <div class="pdf-card">
      <div class="card-header">
        <div class="step-badge">Paso 4 de 5</div>
        <h2 class="card-title">Verificar Ingresos</h2>
        <p class="card-sub">Adjunta tu PDF de movimientos bancarios (últimos 3 meses) o estado de cuenta de Pago Móvil</p>
      </div>

      <!-- Resumen -->
      <div class="credit-summary">
        <div class="cs-row">
          <span class="cs-label">Monto Solicitado</span>
          <span class="cs-val">${{ monto.toLocaleString() }}</span>
        </div>
        <div class="cs-row">
          <span class="cs-label">Cuota {{ frecuencia === 'quincenal' ? 'Quincenal' : 'Mensual' }}</span>
          <span class="cs-val primary">{{ cuota.toLocaleString() }} Bs. <span class="cs-note">(Indexada BCV)</span></span>
        </div>
        <div class="cs-row">
          <span class="cs-label">Estado</span>
          <span class="cs-badge">En Revisión</span>
        </div>
      </div>

      <!-- Drop zone -->
      <div class="upload-area">
        <div
          v-if="!archivo"
          :class="['drop-zone', isDragging && 'dragging']"
          @dragover.prevent="isDragging = true"
          @dragleave="isDragging = false"
          @drop.prevent="onDrop"
          @click="($refs.fileInput as HTMLInputElement).click()"
        >
          <input ref="fileInput" type="file" accept=".pdf" @change="onFileChange" style="display:none" id="input-pdf" />
          <div class="drop-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="12" y1="18" x2="12" y2="12"/>
              <line x1="9" y1="15" x2="15" y2="15"/>
            </svg>
          </div>
          <p class="drop-title">Arrastra tu PDF aquí</p>
          <p class="drop-sub">o haz clic para seleccionarlo</p>
          <span class="drop-limit">Máx. 4MB · Solo archivos .PDF</span>
        </div>

        <!-- File selected -->
        <div v-else class="file-preview" :class="uploaded && 'uploaded'">
          <div class="file-icon">
            <svg v-if="!uploaded" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color:var(--primary)">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <div class="file-info">
            <span class="file-name">{{ archivo.name }}</span>
            <span class="file-size">{{ formatSize(archivo.size) }}</span>
          </div>
          <button v-if="!uploaded" class="file-remove" @click="removeFile">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="info-note">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        Acepta estados de cuenta de Mercantil, Banesco, Provincial, Bicentenario o historial de Pago Móvil.
      </div>

      <div class="card-actions">
        <button class="btn-back" @click="$emit('back')" id="btn-back-pdf">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Volver
        </button>
        <button
          class="btn-next"
          @click="handleNext"
          :disabled="!archivo || uploading || uploaded"
          id="btn-next-pdf"
        >
          <template v-if="uploading">
            <div class="spinner"></div>
            <span>Subiendo...</span>
          </template>
          <template v-else-if="uploaded">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <span>¡Subido!</span>
          </template>
          <template v-else>
            <span>Continuar</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </template>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.step-pdf { max-width: 480px; margin: 0 auto; padding: 0 16px; }

.pdf-card {
  background: var(--bg-card); border: 1px solid var(--border); border-radius: 24px;
  overflow: hidden; box-shadow: var(--shadow-card); position: relative;
}
.pdf-card::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
  background: linear-gradient(90deg, #FFB800, var(--primary));
}

.card-header { padding: 28px 28px 0; }
.step-badge {
  display: inline-block; background: rgba(255,184,0,0.1); border: 1px solid rgba(255,184,0,0.3);
  color: #FFB800; font-size: 11px; font-weight: 600; padding: 4px 12px;
  border-radius: 100px; margin-bottom: 14px;
}
.card-title { font-size: 22px; font-weight: 800; color: var(--text-primary); margin-bottom: 6px; }
.card-sub { font-size: 14px; color: var(--text-secondary); line-height: 1.5; }

.credit-summary {
  margin: 20px 28px; background: var(--bg-card-2); border: 1px solid var(--border);
  border-radius: 14px; padding: 16px 18px; display: flex; flex-direction: column; gap: 10px;
}
.cs-row { display: flex; align-items: center; justify-content: space-between; }
.cs-label { font-size: 13px; color: var(--text-secondary); }
.cs-val { font-size: 14px; font-weight: 700; color: var(--text-primary); }
.cs-val.primary { color: var(--primary); }
.cs-note { font-size: 10px; color: var(--text-muted); font-weight: 400; }
.cs-badge {
  font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 100px;
  background: rgba(255,184,0,0.1); border: 1px solid rgba(255,184,0,0.3); color: #FFB800;
}

.upload-area { padding: 0 28px 20px; }

.drop-zone {
  border: 2px dashed var(--border); border-radius: 16px; padding: 36px 20px;
  display: flex; flex-direction: column; align-items: center; gap: 10px;
  cursor: pointer; transition: all 0.25s; text-align: center;
}
.drop-zone:hover, .drop-zone.dragging {
  border-color: var(--primary); background: rgba(0,200,150,0.05);
}
.drop-icon {
  width: 64px; height: 64px; background: rgba(0,200,150,0.08); border: 1px solid rgba(0,200,150,0.2);
  border-radius: 16px; display: flex; align-items: center; justify-content: center;
  color: var(--primary); margin-bottom: 4px;
}
.drop-title { font-size: 16px; font-weight: 700; color: var(--text-primary); }
.drop-sub { font-size: 13px; color: var(--text-secondary); }
.drop-limit { font-size: 11px; color: var(--text-muted); }

.file-preview {
  display: flex; align-items: center; gap: 14px;
  background: rgba(0,200,150,0.06); border: 1px solid rgba(0,200,150,0.2);
  border-radius: 14px; padding: 16px 18px; transition: all 0.3s;
}
.file-preview.uploaded { border-color: var(--primary); background: rgba(0,200,150,0.1); }
.file-icon {
  width: 42px; height: 42px; background: rgba(0,200,150,0.12);
  border-radius: 10px; display: flex; align-items: center; justify-content: center; color: var(--primary); flex-shrink: 0;
}
.file-info { flex: 1; min-width: 0; }
.file-name { display: block; font-size: 13px; font-weight: 600; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.file-size { font-size: 11px; color: var(--text-muted); }
.file-remove {
  background: transparent; border: 1px solid var(--border); color: var(--text-muted);
  width: 28px; height: 28px; border-radius: 8px; cursor: pointer; display: flex;
  align-items: center; justify-content: center; transition: all 0.2s; flex-shrink: 0;
}
.file-remove:hover { border-color: var(--danger); color: var(--danger); }

.info-note {
  display: flex; align-items: flex-start; gap: 10px;
  margin: 0 28px 20px; padding: 12px 14px;
  background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: 10px;
  font-size: 12px; color: var(--text-muted); line-height: 1.5;
}
.info-note svg { color: var(--text-muted); flex-shrink: 0; margin-top: 1px; }

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
.btn-next:hover:not(:disabled) { transform: translateY(-1px); }
.btn-next:disabled { opacity: 0.6; cursor: not-allowed; }
.spinner {
  width: 18px; height: 18px; border: 2px solid rgba(0,0,0,0.3);
  border-top-color: #000; border-radius: 50%; animation: spin-slow 0.7s linear infinite;
}
</style>
