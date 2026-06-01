<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'

const emit = defineEmits<{ startWizard: [initialStep?: number] }>()

const activeWaStep = ref(1)

onMounted(() => {
  gsap.from('.hero-content > *', {
    y: 30,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out'
  })
  
  gsap.from('.feature-card', {
    scrollTrigger: '.features-grid',
    y: 40,
    opacity: 0,
    duration: 0.6,
    stagger: 0.1,
    ease: 'power2.out'
  })
})

const faqs = [
  {
    q: '¿Cómo funciona la indexación a la tasa oficial BCV?',
    a: 'Para proteger tu poder adquisitivo y garantizar transacciones transparentes, tu microcrédito se calcula en dólares base pero pagas en Bolívares a la tasa oficial del Banco Central de Venezuela (BCV) del día de tu pago.'
  },
  {
    q: '¿Qué requisitos necesito para aplicar?',
    a: 'Solo necesitas ser mayor de edad, tener una Cédula de Identidad venezolana laminada vigente, un número de teléfono celular con WhatsApp activo y un PDF con tu historial de Pago Móvil o movimientos bancarios recientes.'
  },
  {
    q: '¿Por qué utilizan verificación biométrica con MetaMap?',
    a: 'La seguridad es nuestra prioridad. MetaMap es el estándar global de verificación de identidad. Nos permite verificar mediante reconocimiento facial y biometría activa que tú realmente eres quien solicita el crédito, previniendo fraudes y suplantación de identidad de forma 100% segura.'
  },
  {
    q: '¿Cómo son los ciclos de pago y cobranza?',
    a: 'Nuestros créditos se estructuran en ciclos claros: Enviamos un recordatorio preventivo vía WhatsApp el día 13, la cuota oficial vence el día 15, se aplica un recargo por mora a partir del día 18, y si no hay pago para el día 26 el perfil entra automáticamente en lista de exclusión (Blacklist).'
  }
]
</script>

<template>
  <div class="landing-home">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <div class="badge-chip animate-float">
          <span class="chip-dot"></span>
          El Futuro del Microfinanciamiento Digital en Venezuela
        </div>
        <h1 class="main-title">
          Microcréditos al Instante. <br>
          <span class="gradient-text">Sin Papeleos, 100% Seguro.</span>
        </h1>
        <p class="hero-description">
          Obtén el financiamiento express que necesitas para impulsar tus proyectos personales o tu negocio. Indexado a tasa oficial BCV con verificación biométrica automatizada.
        </p>
        <div class="cta-group">
          <button class="btn-primary" @click="emit('startWizard', 1)">
            Solicitar Financiamiento
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
          <button class="btn-secondary" @click="emit('startWizard', 1)">
            Simular Cuota
          </button>
        </div>
        <div class="hero-stats">
          <div class="stat-item">
            <span class="stat-num">5 Min</span>
            <span class="stat-lbl">Aprobación Promedio</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-num">100%</span>
            <span class="stat-lbl">Onboarding Digital</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-num">BCV</span>
            <span class="stat-lbl">Tasa Oficial Garantizada</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Cómo Funciona Section -->
    <section class="section works-section">
      <div class="section-header">
        <span class="section-tag">PROCESO VELOZ</span>
        <h2 class="section-title">Tu Crédito en 4 Simples Pasos</h2>
        <p class="section-subtitle">Diseñamos una experiencia ágil apoyada en herramientas de última tecnología.</p>
      </div>

      <div class="steps-grid">
        <div class="step-card">
          <div class="step-num">01</div>
          <h3 class="step-card-title">Simulación</h3>
          <p class="step-card-text">Usa nuestro simulador inteligente indexado al BCV para calcular tu cuota exacta según el plazo que elijas.</p>
        </div>
        <div class="step-card">
          <div class="step-num">02</div>
          <h3 class="step-card-title">Registro Rápido</h3>
          <p class="step-card-text">Completa tus datos personales básicos e información socioeconómica en nuestro formulario optimizado.</p>
        </div>
        <div class="step-card">
          <div class="step-num">03</div>
          <h3 class="step-card-title">Carga de Ingresos</h3>
          <p class="step-card-text">Adjunta tu reporte en PDF de Pago Móvil o estados de cuenta bancarios para validar tus ingresos al instante.</p>
        </div>
        <div class="step-card">
          <div class="step-num">04</div>
          <h3 class="step-card-title">Biometría MetaMap</h3>
          <p class="step-card-text">Realiza una verificación facial interactiva (Face Match) y escanea tu cédula. ¡Máxima seguridad bancaria!</p>
        </div>
      </div>
    </section>

    <!-- WhatsApp Workflow Section -->
    <section class="section whatsapp-section">
      <div class="section-header">
        <span class="section-tag">EL PASO SIGUIENTE EN WHATSAPP</span>
        <h2 class="section-title">Tu Crédito continúa en WhatsApp</h2>
        <p class="section-subtitle">
          Una vez pre-aprobado, completas la firma de tu contrato y recibes el desembolso directamente en tu chat de WhatsApp. ¡Sin salir de tu conversación!
        </p>
      </div>

      <!-- Selector para móvil (Interactivo) -->
      <div class="wa-mobile-selector">
        <button 
          v-for="step in [1, 2, 3]" 
          :key="step"
          :class="['wa-tab-btn', activeWaStep === step && 'active']"
          @click="activeWaStep = step"
        >
          Paso {{ step }}
        </button>
      </div>

      <!-- Grid de WhatsApp: Escritorio muestra 3 teléfonos, Móvil muestra el seleccionado -->
      <div class="wa-workflow-container">
        <!-- Teléfono 1: Notificación de Pre-Aprobación -->
        <div :class="['wa-phone-card', activeWaStep === 1 && 'wa-active-mobile']">
          <div class="wa-step-header">
            <span class="wa-step-num">1</span>
            <div class="wa-step-info">
              <h3 class="wa-step-title">1. Notificación de Pre-Aprobación</h3>
              <p class="wa-step-desc">Recibes un mensaje con los detalles del microcrédito pre-aprobado y opciones directas.</p>
            </div>
          </div>
          
          <div class="whatsapp-mockup animate-float">
            <!-- Bezel/Notch -->
            <div class="phone-notch"></div>
            <!-- WhatsApp Screen -->
            <div class="wa-screen">
              <!-- WhatsApp Header -->
              <div class="wa-header">
                <div class="wa-header-left">
                  <span class="wa-back-arrow">←</span>
                  <div class="wa-avatar">
                    <span>CVE</span>
                    <span class="wa-verified">✓</span>
                  </div>
                  <div class="wa-profile-info">
                    <span class="wa-name">CreditVE</span>
                    <span class="wa-status">En línea</span>
                  </div>
                </div>
                <div class="wa-header-right">
                  <span class="wa-icon">📹</span>
                  <span class="wa-icon">📞</span>
                  <span class="wa-icon">⋮</span>
                </div>
              </div>
              
              <!-- WhatsApp Body -->
              <div class="wa-body">
                <div class="wa-date-badge">Today</div>
                
                <div class="wa-message incoming">
                  <div class="wa-bubble-text">
                    ✅ <strong>¡Felicidades!</strong> Tu microcrédito por <strong>1200 VES</strong> ha sido <strong>PRE-APROBADO</strong>.
                    <br><br>
                    Sujeto a la revisión final de tus movimientos bancarios.
                    <br><br>
                    Estamos listos para transferirte.
                  </div>
                  <div class="wa-time">12:13</div>
                  
                  <div class="wa-bubble-actions">
                    <button class="wa-action-btn wa-primary-btn">[FIRMAR CONTRATO]</button>
                    <button class="wa-action-btn wa-secondary-btn">[CANCELAR SOLICITUD]</button>
                  </div>
                </div>
              </div>
              
              <!-- WhatsApp Footer -->
              <div class="wa-footer-bar">
                <span class="wa-footer-icon">😊</span>
                <div class="wa-input-placeholder">Mensaje</div>
                <span class="wa-footer-icon">📎</span>
                <span class="wa-footer-icon">📷</span>
                <span class="wa-mic-btn">🎙️</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Conector 1 (Flecha) -->
        <div class="wa-flow-connector">
          <svg viewBox="0 0 100 40" fill="none" class="wa-arrow-svg">
            <path d="M10 20 Q50 35 90 20" stroke="var(--primary)" stroke-dasharray="5,5" stroke-width="2" stroke-linecap="round"/>
            <polygon points="90,20 82,15 84,23" fill="var(--primary)"/>
          </svg>
        </div>

        <!-- Teléfono 2: Firma Digital -->
        <div :class="['wa-phone-card', activeWaStep === 2 && 'wa-active-mobile']">
          <div class="wa-step-header">
            <span class="wa-step-num">2</span>
            <div class="wa-step-info">
              <h3 class="wa-step-title">2. Firma Digital (Aceptación)</h3>
              <p class="wa-step-desc">Confirmas los términos del contrato de forma legal escribiendo una frase clave en el chat.</p>
            </div>
          </div>
          
          <div class="whatsapp-mockup animate-float" style="animation-delay: 0.5s;">
            <!-- Bezel/Notch -->
            <div class="phone-notch"></div>
            <!-- WhatsApp Screen -->
            <div class="wa-screen">
              <!-- WhatsApp Header -->
              <div class="wa-header">
                <div class="wa-header-left">
                  <span class="wa-back-arrow">←</span>
                  <div class="wa-avatar">
                    <span>CVE</span>
                    <span class="wa-verified">✓</span>
                  </div>
                  <div class="wa-profile-info">
                    <span class="wa-name">CreditVE</span>
                    <span class="wa-status">En línea</span>
                  </div>
                </div>
                <div class="wa-header-right">
                  <span class="wa-icon">📹</span>
                  <span class="wa-icon">📞</span>
                  <span class="wa-icon">⋮</span>
                </div>
              </div>
              
              <!-- WhatsApp Body -->
              <div class="wa-body">
                <div class="wa-date-badge">Today</div>
                
                <div class="wa-message incoming">
                  <div class="wa-bubble-text">
                    📄 Este es tu contrato de microcrédito simplificado.
                    <br><br>
                    Por favor, lee y confirma que estás de acuerdo con los términos (Monto, Tasa, Plazos quincenales).
                    <br><br>
                    Para firmar digitalmente, escribe: <strong>"ACEPTO EL CONTRATO"</strong>
                  </div>
                  <div class="wa-time">12:13</div>
                </div>

                <div class="wa-message outgoing">
                  <div class="wa-bubble-text">
                    Acepto el contrato
                  </div>
                  <div class="wa-time">12:13 <span class="wa-ticks">✔✔</span></div>
                  <div class="wa-reaction">👍</div>
                </div>

                <div class="wa-message-button-container">
                  <button class="wa-action-btn wa-primary-btn w-100">[ACEPTO EL CONTRATO]</button>
                </div>
              </div>
              
              <!-- WhatsApp Footer -->
              <div class="wa-footer-bar">
                <span class="wa-footer-icon">😊</span>
                <div class="wa-input-placeholder">Mensaje</div>
                <span class="wa-footer-icon">📎</span>
                <span class="wa-footer-icon">📷</span>
                <span class="wa-mic-btn">🎙️</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Conector 2 (Flecha) -->
        <div class="wa-flow-connector">
          <svg viewBox="0 0 100 40" fill="none" class="wa-arrow-svg">
            <path d="M10 20 Q50 35 90 20" stroke="var(--primary)" stroke-dasharray="5,5" stroke-width="2" stroke-linecap="round"/>
            <polygon points="90,20 82,15 84,23" fill="var(--primary)"/>
          </svg>
        </div>

        <!-- Teléfono 3: Confirmación y Desembolso -->
        <div :class="['wa-phone-card', activeWaStep === 3 && 'wa-active-mobile']">
          <div class="wa-step-header">
            <span class="wa-step-num">3</span>
            <div class="wa-step-info">
              <h3 class="wa-step-title">3. Confirmación y Desembolso</h3>
              <p class="wa-step-desc">Se inyectan los fondos vía Pago Móvil al instante y se confirma tu transferencia.</p>
            </div>
          </div>
          
          <div class="whatsapp-mockup animate-float" style="animation-delay: 1s;">
            <!-- Bezel/Notch -->
            <div class="phone-notch"></div>
            <!-- WhatsApp Screen -->
            <div class="wa-screen">
              <!-- WhatsApp Header -->
              <div class="wa-header">
                <div class="wa-header-left">
                  <span class="wa-back-arrow">←</span>
                  <div class="wa-avatar">
                    <span>CVE</span>
                    <span class="wa-verified">✓</span>
                  </div>
                  <div class="wa-profile-info">
                    <span class="wa-name">CreditVE</span>
                    <span class="wa-status">En línea</span>
                  </div>
                </div>
                <div class="wa-header-right">
                  <span class="wa-icon">📹</span>
                  <span class="wa-icon">📞</span>
                  <span class="wa-icon">⋮</span>
                </div>
              </div>
              
              <!-- WhatsApp Body -->
              <div class="wa-body">
                <div class="wa-date-badge">Today</div>
                
                <div class="wa-message incoming">
                  <div class="wa-bubble-text">
                    💵 <strong>¡Contrato firmado!</strong> Hemos procesado tu transferencia de <strong>1200 VES</strong> via Pago Móvil a tu cuenta <strong>Mercantil</strong>.
                    <br><br>
                    El dinero debería reflejarse en los próximos 15 minutos.
                    <br><br>
                    ¡Gracias por confiar en CreditVE!
                  </div>
                  <div class="wa-time">12:10</div>
                  
                  <div class="wa-bubble-actions">
                    <button class="wa-action-btn wa-primary-btn">[VER MI ESTADO DE CRÉDITO]</button>
                    <button class="wa-action-btn wa-secondary-btn">[AYUDA / SOPORTE]</button>
                  </div>
                </div>
              </div>
              
              <!-- WhatsApp Footer -->
              <div class="wa-footer-bar">
                <span class="wa-footer-icon">😊</span>
                <div class="wa-input-placeholder">Mensaje</div>
                <span class="wa-footer-icon">📎</span>
                <span class="wa-footer-icon">📷</span>
                <span class="wa-mic-btn">🎙️</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Tecnología & Alianzas Section -->
    <section class="section tech-section">
      <div class="tech-container">
        <div class="tech-text">
          <span class="section-tag">SEGURIDAD FINTECH</span>
          <h2 class="section-title">Respaldo Tecnológico de Clase Mundial</h2>
          <p class="tech-description">
            No somos un prestamista común. Integramos las herramientas más robustas del ecosistema no-code y de seguridad de identidad digital global para darte una experiencia transparente, auditable y segura.
          </p>
          <ul class="tech-list">
            <li>
              <div class="tech-icon">🛡️</div>
              <div><strong>Verificación con MetaMap:</strong> Análisis biométrico inteligente para validar la veracidad de tu documentación oficial.</div>
            </li>
            <li>
              <div class="tech-icon">⚡</div>
              <div><strong>Alertas Vía WhatsApp:</strong> Notificaciones directas y automatizadas con tus montos calculados según la tasa oficial del día.</div>
            </li>
            <li>
              <div class="tech-icon">🗄️</div>
              <div><strong>Estructura Incorruptible:</strong> Tu historial crediticio es resguardado de forma encriptada bajo estándares globales.</div>
            </li>
          </ul>
        </div>
        <div class="tech-visual">
          <div class="glass-shield animate-float">
            <div class="shield-core">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <span class="shield-label">METAMAP VERIFIED</span>
            </div>
            <div class="shield-glow"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQs Section -->
    <section class="section faq-section">
      <div class="section-header">
        <span class="section-tag">SOPORTE Y TRANSPARENCIA</span>
        <h2 class="section-title">Preguntas Frecuentes</h2>
        <p class="section-subtitle">Queremos resolver todas tus dudas sobre nuestro sistema de financiamiento express.</p>
      </div>

      <div class="faq-grid">
        <div v-for="(faq, i) in faqs" :key="i" class="faq-card">
          <h3 class="faq-card-q">{{ faq.q }}</h3>
          <p class="faq-card-a">{{ faq.a }}</p>
        </div>
      </div>
    </section>

    <!-- Final Banner Section -->
    <section class="section cta-banner">
      <div class="banner-card">
        <h2 class="banner-title">¿Listo para impulsar tus proyectos?</h2>
        <p class="banner-text">Simula hoy tu microcrédito y obtén tu financiamiento de forma rápida, segura y transparente.</p>
        <button class="btn-primary animate-pulse-glow" @click="emit('startWizard', 1)">
          Iniciar Solicitud Express
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.landing-home {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Sections Base */
.section {
  padding: 80px 0;
}
.section-header {
  text-align: center;
  max-width: 600px;
  margin: 0 auto 50px;
}
.section-tag {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.5px;
  color: var(--primary);
  text-transform: uppercase;
  margin-bottom: 12px;
}
.section-title {
  font-size: clamp(1.8rem, 4vw, 2.4rem);
  font-weight: 850;
  color: var(--text-primary);
  line-height: 1.2;
  margin-bottom: 14px;
}
.section-subtitle {
  color: var(--text-secondary);
  font-size: 15px;
  line-height: 1.6;
}

/* Hero Section */
.hero-section {
  padding: 100px 0 60px;
  text-align: center;
  position: relative;
}
.badge-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(0, 200, 150, 0.08);
  border: 1px solid rgba(0, 200, 150, 0.2);
  color: var(--primary);
  font-size: 12px;
  font-weight: 600;
  padding: 6px 16px;
  border-radius: 100px;
  margin-bottom: 24px;
}
.chip-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--primary);
}
.main-title {
  font-size: clamp(2.4rem, 6vw, 4rem);
  font-weight: 900;
  line-height: 1.1;
  letter-spacing: -1.5px;
  margin-bottom: 20px;
}
.gradient-text {
  background: linear-gradient(135deg, var(--primary), var(--accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.hero-description {
  max-width: 650px;
  margin: 0 auto 36px;
  color: var(--text-secondary);
  font-size: clamp(15px, 2vw, 17px);
  line-height: 1.6;
}
.cta-group {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 50px;
  flex-wrap: wrap;
}
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: #000;
  font-weight: 800;
  font-size: 15px;
  padding: 16px 28px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 20px var(--primary-glow);
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px var(--primary-glow);
}
.btn-secondary {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border);
  color: var(--text-primary);
  font-weight: 600;
  font-size: 15px;
  padding: 16px 28px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.25s;
}
.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--text-secondary);
}

.hero-stats {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 32px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 20px 40px;
  max-width: 700px;
  margin: 0 auto;
  flex-wrap: wrap;
}
.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.stat-num {
  font-size: 20px;
  font-weight: 850;
  color: var(--primary);
}
.stat-lbl {
  font-size: 11px;
  color: var(--text-secondary);
  font-weight: 500;
}
.stat-divider {
  width: 1px;
  height: 32px;
  background: var(--border);
}

@media (max-width: 600px) {
  .hero-stats {
    flex-direction: column;
    gap: 16px;
    padding: 20px;
  }
  .stat-divider {
    display: none;
  }
}

/* Steps Grid */
.steps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 24px;
}
.step-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 28px;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}
.step-card:hover {
  transform: translateY(-4px);
  border-color: var(--primary-glow);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
}
.step-num {
  font-size: 36px;
  font-weight: 900;
  color: rgba(0, 200, 150, 0.15);
  line-height: 1;
  margin-bottom: 16px;
}
.step-card-title {
  font-size: 16px;
  font-weight: 750;
  color: var(--text-primary);
  margin-bottom: 10px;
}
.step-card-text {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.6;
}

/* Tech Section */
.tech-container {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 40px;
  background: linear-gradient(135deg, rgba(7, 11, 20, 0.6) 0%, rgba(108, 99, 255, 0.04) 100%);
  border: 1px solid var(--border);
  border-radius: 28px;
  padding: 48px;
  align-items: center;
}
@media (max-width: 768px) {
  .tech-container {
    grid-template-columns: 1fr;
    padding: 30px;
  }
}
.tech-description {
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 24px;
}
.tech-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.tech-list li {
  display: flex;
  gap: 14px;
  align-items: flex-start;
}
.tech-icon {
  font-size: 20px;
  flex-shrink: 0;
}
.tech-list li div {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
}
.tech-list li div strong {
  color: var(--text-primary);
}

.tech-visual {
  display: flex;
  justify-content: center;
}
.glass-shield {
  position: relative;
  width: 220px;
  height: 220px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 36px;
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
}
.shield-core {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  z-index: 2;
}
.shield-label {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1px;
  color: var(--primary);
  background: rgba(0, 200, 150, 0.1);
  padding: 4px 10px;
  border-radius: 100px;
}
.shield-glow {
  position: absolute;
  width: 140px;
  height: 140px;
  background: radial-gradient(circle, var(--primary-glow) 0%, transparent 70%);
  z-index: 1;
}

/* FAQ Section */
.faq-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
}
@media (max-width: 500px) {
  .faq-grid {
    grid-template-columns: 1fr;
  }
}
.faq-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 28px;
}
.faq-card-q {
  font-size: 15px;
  font-weight: 750;
  color: var(--text-primary);
  margin-bottom: 12px;
}
.faq-card-a {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.6;
}

/* CTA Banner */
.cta-banner {
  text-align: center;
}
.banner-card {
  background: linear-gradient(135deg, rgba(0, 200, 150, 0.05) 0%, rgba(108, 99, 255, 0.05) 100%);
  border: 1px solid rgba(0, 200, 150, 0.15);
  border-radius: 28px;
  padding: 50px 30px;
  max-width: 800px;
  margin: 0 auto;
}
.banner-title {
  font-size: clamp(1.8rem, 4vw, 2.2rem);
  font-weight: 850;
  margin-bottom: 12px;
}
.banner-text {
  color: var(--text-secondary);
  font-size: 14px;
  max-width: 500px;
  margin: 0 auto 28px;
  line-height: 1.6;
}

/* WhatsApp Flow Section */
.whatsapp-section {
  background: linear-gradient(180deg, transparent 0%, rgba(0, 200, 150, 0.03) 50%, transparent 100%);
  position: relative;
  overflow: hidden;
  padding: 80px 0;
}

.wa-mobile-selector {
  display: none;
  justify-content: center;
  gap: 8px;
  margin-bottom: 30px;
}

.wa-tab-btn {
  background: var(--bg-card);
  border: 1px solid var(--border);
  color: var(--text-secondary);
  padding: 8px 16px;
  border-radius: 100px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
}

.wa-tab-btn.active {
  background: var(--primary);
  color: #000;
  border-color: var(--primary);
  box-shadow: 0 4px 12px var(--primary-glow);
}

.wa-workflow-container {
  display: grid;
  grid-template-columns: 1fr auto 1fr auto 1fr;
  align-items: center;
  gap: 12px;
  margin: 40px auto;
  max-width: 960px;
}

.wa-phone-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.wa-step-header {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 20px;
  width: 100%;
  min-height: 70px;
}

.wa-step-num {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(0, 200, 150, 0.1);
  border: 1px solid var(--primary);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 13px;
  flex-shrink: 0;
}

.wa-step-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.wa-step-title {
  font-size: 14px;
  font-weight: 800;
  color: var(--text-primary);
}

.wa-step-desc {
  font-size: 11px;
  color: var(--text-secondary);
  line-height: 1.3;
}

.wa-flow-connector {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 100%;
  margin-top: 60px;
}

.wa-arrow-svg {
  width: 100%;
  height: 30px;
}

/* Smartphone Mockup */
.whatsapp-mockup {
  position: relative;
  width: 250px;
  height: 440px;
  background: #000;
  border: 8px solid #1a1a1a;
  border-radius: 32px;
  box-shadow: 0 15px 35px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.phone-notch {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 15px;
  background: #1a1a1a;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  z-index: 10;
}

/* WhatsApp Screen */
.wa-screen {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

/* WhatsApp Header */
.wa-header {
  height: 48px;
  padding: 10px 8px 6px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 2;
  box-shadow: 0 2px 4px rgba(0,0,0,0.08);
}

.wa-header-left {
  display: flex;
  align-items: center;
  gap: 4px;
  max-width: 75%;
}

.wa-back-arrow {
  font-size: 14px;
  color: var(--wa-header-text);
  cursor: pointer;
}

.wa-avatar {
  position: relative;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #00a884;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  font-weight: 800;
}

.wa-verified {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 10px;
  height: 10px;
  background: #00c292;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 6px;
  font-weight: 900;
  border: 1px solid white;
}

.wa-profile-info {
  display: flex;
  flex-direction: column;
}

.wa-name {
  font-size: 11px;
  font-weight: 700;
}

.wa-status {
  font-size: 8px;
  opacity: 0.8;
}

.wa-header-right {
  display: flex;
  gap: 10px;
  align-items: center;
  font-size: 11px;
  opacity: 0.9;
}

.wa-icon {
  cursor: pointer;
}

/* WhatsApp Body & Bubbles */
.wa-body {
  flex: 1;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  position: relative;
}

.wa-date-badge {
  align-self: center;
  font-size: 8px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 5px;
  text-transform: uppercase;
  margin-bottom: 6px;
  box-shadow: 0 1px 1px rgba(0,0,0,0.05);
}

.wa-message {
  max-width: 85%;
  border-radius: 8px;
  padding: 6px 8px;
  position: relative;
  box-shadow: 0 1px 1px rgba(0,0,0,0.15);
  display: flex;
  flex-direction: column;
}

.wa-message.incoming {
  align-self: flex-start;
  border-top-left-radius: 0;
}

.wa-message.outgoing {
  align-self: flex-end;
  border-top-right-radius: 0;
}

.wa-bubble-text {
  font-size: 10px;
  line-height: 1.35;
}

.wa-time {
  font-size: 7px;
  align-self: flex-end;
  margin-top: 3px;
  display: flex;
  align-items: center;
  gap: 2px;
}

.wa-ticks {
  color: #53bdeb;
}

.wa-reaction {
  position: absolute;
  bottom: -6px;
  right: 10px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 1px 3px;
  font-size: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.15);
}

/* Acciones de Mensaje Interactivo */
.wa-bubble-actions {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 8px;
  border-top: 1px solid rgba(0,0,0,0.05);
  padding-top: 6px;
}

.wa-action-btn {
  border: none;
  background: var(--primary);
  color: #000;
  font-size: 9px;
  font-weight: 800;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  transition: opacity 0.2s;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.wa-action-btn:hover {
  opacity: 0.9;
}

.wa-action-btn.wa-secondary-btn {
  background: rgba(255,255,255,0.06);
  border: 1px solid var(--border);
  color: var(--text-primary);
}

.wa-message-button-container {
  margin-top: 6px;
  align-self: center;
  width: 100%;
}

.w-100 {
  width: 100%;
}

/* WhatsApp Footer Bar */
.wa-footer-bar {
  height: 38px;
  padding: 4px 6px;
  display: flex;
  align-items: center;
  gap: 6px;
  border-top: 1px solid rgba(0,0,0,0.03);
}

.wa-footer-icon {
  font-size: 12px;
  cursor: pointer;
  opacity: 0.6;
}

.wa-input-placeholder {
  flex: 1;
  height: 26px;
  border-radius: 20px;
  padding: 5px 10px;
  font-size: 10px;
  display: flex;
  align-items: center;
}

.wa-mic-btn {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  cursor: pointer;
}

/* Adaptación del Mockup según Tema Claro/Oscuro de la Landing */
.whatsapp-mockup {
  --wa-header-bg: #1f2c34;
  --wa-header-text: #e9edef;
  --wa-body-bg: #0b141a;
  --wa-body-pattern: radial-gradient(#121b22 1px, transparent 1px);
  --wa-date-badge-bg: #182229;
  --wa-date-badge-text: #8696a0;
  --wa-incoming-bg: #202c33;
  --wa-incoming-text: #e9edef;
  --wa-outgoing-bg: #005c4b;
  --wa-outgoing-text: #e9edef;
  --wa-time-text: rgba(233, 237, 239, 0.6);
  --wa-footer-bg: #1f2c34;
  --wa-input-bg: #2a3942;
  --wa-input-text: #8696a0;
  --wa-mic-bg: #00a884;
}

.theme-ocean .whatsapp-mockup,
.theme-grape .whatsapp-mockup {
  --wa-header-bg: #008069;
  --wa-header-text: #ffffff;
  --wa-body-bg: #efeae2;
  --wa-body-pattern: radial-gradient(#e1d9d1 1px, transparent 1px);
  --wa-date-badge-bg: #ffffff;
  --wa-date-badge-text: #54656f;
  --wa-incoming-bg: #ffffff;
  --wa-incoming-text: #111b21;
  --wa-outgoing-bg: #d9fdd3;
  --wa-outgoing-text: #111b21;
  --wa-time-text: #667781;
  --wa-footer-bg: #f0f2f5;
  --wa-input-bg: #ffffff;
  --wa-input-text: #667781;
  --wa-mic-bg: #00a884;
}

/* Aplicación de Variables en Mockup */
.wa-header {
  background: var(--wa-header-bg);
  color: var(--wa-header-text);
}
.wa-back-arrow {
  color: var(--wa-header-text);
}
.wa-status {
  color: var(--wa-header-text);
}
.wa-body {
  background-color: var(--wa-body-bg);
  background-image: var(--wa-body-pattern);
  background-size: 15px 15px;
}
.wa-date-badge {
  background: var(--wa-date-badge-bg);
  color: var(--wa-date-badge-text);
}
.wa-message.incoming {
  background: var(--wa-incoming-bg);
  color: var(--wa-incoming-text);
}
.wa-message.outgoing {
  background: var(--wa-outgoing-bg);
  color: var(--wa-outgoing-text);
}
.wa-time {
  color: var(--wa-time-text);
}
.wa-footer-bar {
  background: var(--wa-footer-bg);
  color: var(--wa-header-text);
}
.wa-footer-icon {
  color: var(--wa-header-text);
}
.wa-input-placeholder {
  background: var(--wa-input-bg);
  color: var(--wa-input-text);
}
.wa-mic-btn {
  background: var(--wa-mic-bg);
  color: white;
}

/* Responsividad */
@media (max-width: 900px) {
  .wa-workflow-container {
    grid-template-columns: 1fr;
    gap: 24px;
    max-width: 270px;
  }
  .wa-flow-connector {
    display: none;
  }
  .wa-mobile-selector {
    display: flex;
  }
  .wa-phone-card {
    display: none;
  }
  .wa-phone-card.wa-active-mobile {
    display: flex;
  }
  .wa-step-header {
    min-height: auto;
    text-align: center;
    flex-direction: column;
    align-items: center;
    gap: 6px;
  }
}
</style>
