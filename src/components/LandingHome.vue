<script setup lang="ts">
import { onMounted, ref } from 'vue'

const emit = defineEmits<{ startWizard: [step?: number] }>()
const root = ref<HTMLElement>()

onMounted(() => {
  const el = root.value
  if (!el) return

  // Hero tilt con el puntero
  const tilt = el.querySelector<HTMLElement>('.sim-wrap')
  const art = el.querySelector<HTMLElement>('.hero-art')
  if (tilt && art) {
    art.addEventListener('pointermove', (e) => {
      const r = art.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width - 0.5
      const py = (e.clientY - r.top) / r.height - 0.5
      tilt.style.transform = `rotateY(${px * 16}deg) rotateX(${-py * 16}deg)`
    })
    art.addEventListener('pointerleave', () => { tilt.style.transform = '' })
  }

  // Contadores animados
  const rm = matchMedia('(prefers-reduced-motion: reduce)').matches
  const fmt = (v: number, dec: number) =>
    v.toLocaleString('es-VE', { minimumFractionDigits: dec, maximumFractionDigits: dec })
  const obs = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (!entry.isIntersecting) return
    obs.unobserve(entry.target)
    const node = entry.target as HTMLElement
    const to = Number(node.dataset.to)
    const dec = to % 1 !== 0 ? 1 : 0
    const pre = node.dataset.pre || ''
    const suf = node.dataset.suf || ''
    const render = (v: number) => { node.textContent = pre + fmt(v, dec) + suf }
    if (rm) { render(to); return }
    let start: number | null = null
    const step = (t: number) => {
      if (start === null) start = t
      const p = Math.min((t - start) / 1400, 1)
      render((1 - Math.pow(1 - p, 3)) * to)
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }), { threshold: 0.4 })
  el.querySelectorAll('.cn').forEach((n) => obs.observe(n))
})
</script>

<template>
  <div class="landing-home" ref="root">

    <!-- HERO -->
    <header class="lh-wrap hero">
      <div>
        <div class="chip"><span class="d"></span>El futuro del microfinanciamiento digital en Venezuela</div>
        <h1>Microcréditos al<br>instante. <span class="g">Sin papeleos,<br>100% seguro.</span></h1>
        <p class="lead">Obtén el financiamiento express que necesitas para impulsar tu negocio o tus proyectos. Indexado a la tasa oficial BCV, con verificación biométrica automatizada.</p>
        <div class="cta-row">
          <button class="btn btn-pri btn-lg" @click="emit('startWizard', 1)">Solicitar Financiamiento →</button>
          <button class="btn btn-ghost btn-lg" @click="emit('startWizard', 1)">Simular Cuota</button>
        </div>
        <div class="stats">
          <div class="stat"><div class="n">5 Min</div><div class="l">Aprobación promedio</div></div>
          <div class="stat-div"></div>
          <div class="stat"><div class="n">100%</div><div class="l">Onboarding digital</div></div>
          <div class="stat-div"></div>
          <div class="stat"><div class="n">BCV</div><div class="l">Tasa oficial garantizada</div></div>
        </div>
      </div>
      <div class="hero-art">
        <div class="sim-scroll">
          <div class="sim-wrap">
            <div class="sim">
              <span class="bcv">BCV 549,37</span>
              <div class="sh"><div class="si">🧮</div><div><div class="st">Simulador de Crédito</div><div class="ss">Indexado a la tasa BCV</div></div></div>
              <div class="lab">¿Cuánto necesitas?</div>
              <div class="amt">$1.200 <small>≈ 659.244 Bs.</small></div>
              <div class="slider"><div class="knob"></div></div>
              <div class="res"><div class="rl">Tu cuota quincenal</div><div class="ra">711.984 Bs.</div></div>
              <button class="cta-mini" @click="emit('startWizard', 1)">Solicitar mi Crédito →</button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- MARQUEE de marca (sin herramientas) -->
    <div class="marquee">
      <div class="mq-track">
        <span class="mq-brand">Credit<b>VE</b></span><span>Microcrédito Express</span>
        <span class="mq-brand">Credit<b>VE</b></span><span>Tasa BCV oficial</span>
        <span class="mq-brand">Credit<b>VE</b></span><span>100% Digital</span>
        <span class="mq-brand">Credit<b>VE</b></span><span>Sin garante</span>
        <span class="mq-brand">Credit<b>VE</b></span><span>Aprobación en minutos</span>
        <span class="mq-brand">Credit<b>VE</b></span><span>Hecho en Venezuela 🇻🇪</span>
        <span class="mq-brand">Credit<b>VE</b></span><span>Microcrédito Express</span>
        <span class="mq-brand">Credit<b>VE</b></span><span>Tasa BCV oficial</span>
        <span class="mq-brand">Credit<b>VE</b></span><span>100% Digital</span>
        <span class="mq-brand">Credit<b>VE</b></span><span>Sin garante</span>
        <span class="mq-brand">Credit<b>VE</b></span><span>Aprobación en minutos</span>
        <span class="mq-brand">Credit<b>VE</b></span><span>Hecho en Venezuela 🇻🇪</span>
      </div>
    </div>

    <!-- STATEMENT -->
    <section class="statement">
      <p><span class="w">Crédito</span><span class="w">rápido,</span><span class="w">seguro,</span><span class="w">transparente</span><span class="w">y</span><span class="w">tuyo.</span></p>
    </section>

    <!-- WIZARD (CSS scroll-driven) -->
    <section class="wizard" id="como">
      <div class="wz-grid">
        <div class="wz-flow">
          <div class="wz-rail"><div class="wz-fill"></div></div>
          <div class="wz-intro"><span class="tag">Cómo funciona</span><h2>Tu crédito en 5 pasos</h2><p>Todo desde tu teléfono, en unos minutos. Baja para ver cada paso.</p></div>
          <div class="wz-step s0"><span class="wz-num">1</span><h3>Simula tu cuota</h3><p>Elige cuánto necesitas, entre $500 y $2.500. Calculamos tu cuota en Bolívares a la tasa oficial BCV del día.</p><div class="feat"><span>Quincenal o mensual</span><span>Tasa BCV</span></div></div>
          <div class="wz-step s1"><span class="wz-num">2</span><h3>Regístrate</h3><p>Nombre, cédula, teléfono con WhatsApp y correo. Sin filas ni papeleo: te contactamos por WhatsApp.</p><div class="feat"><span>4 campos</span><span>Datos cifrados</span></div></div>
          <div class="wz-step s2"><span class="wz-num">3</span><h3>Tu perfil</h3><p>Fuente de ingresos, sector, rango de ingresos y para qué es el crédito. Todo con un toque.</p><div class="feat"><span>Negocio · Empleado</span><span>Inventario · Capital</span></div></div>
          <div class="wz-step s3"><span class="wz-num">4</span><h3>Comprueba tus ingresos</h3><p>Sube un PDF con tus movimientos de los últimos 3 meses o tu historial de Pago Móvil.</p><div class="feat"><span>Solo PDF</span><span>Máx 4 MB</span></div></div>
          <div class="wz-step s4"><span class="wz-num">5</span><h3>Verifícate con MetaMap</h3><p>Escanea tu cédula (frente y atrás) y haz un Face Match. Seguridad biométrica de estándar global. Quedas “Por verificar”.</p><div class="feat"><span>Cédula + selfie</span><span>Anti-fraude</span></div></div>
        </div>

        <div class="wz-visual">
          <div class="wz-phone">
            <div class="island"></div>
            <div class="wz-screen e0">
              <div class="scr-top"><div class="brand"><span class="mk">C</span>Credit<b>VE</b></div><span class="pill">1/5</span></div>
              <div class="bars"><span class="on"></span><span></span><span></span><span></span><span></span></div>
              <div class="scr-h">¿Cuánto necesitas?</div>
              <div class="box"><div class="lab">Monto</div><div class="big">$1.200</div><div class="ves">≈ 659.244 Bs.</div><div class="miniSlider"><b></b></div></div>
              <div class="chips ch-row"><span class="chip2 on">Quincenal</span><span class="chip2">Mensual</span></div>
              <div class="box"><div class="lab">Tu cuota a pagar</div><div class="big">711.984 Bs.</div></div>
              <button class="scr-cta">Solicitar mi Crédito →</button>
            </div>
            <div class="wz-screen e1">
              <div class="scr-top"><div class="brand"><span class="mk">C</span>Credit<b>VE</b></div><span class="pill">2/5</span></div>
              <div class="bars"><span class="on"></span><span class="on"></span><span></span><span></span><span></span></div>
              <div class="scr-h">Tus datos</div>
              <div class="inp">👤 María González</div>
              <div class="inp act">🪪 V-12.345.678</div>
              <div class="inp">📱 +58 412-555-0142</div>
              <div class="inp">✉️ maria@email.com</div>
              <button class="scr-cta">Continuar →</button>
            </div>
            <div class="wz-screen e2">
              <div class="scr-top"><div class="brand"><span class="mk">C</span>Credit<b>VE</b></div><span class="pill">3/5</span></div>
              <div class="bars"><span class="on"></span><span class="on"></span><span class="on"></span><span></span><span></span></div>
              <div class="scr-h">Tu perfil</div>
              <div class="box box-sm"><div class="lab">Fuente de ingresos</div><div class="chips"><span class="chip2 on">Negocio propio</span><span class="chip2">Empleado</span></div></div>
              <div class="box box-sm"><div class="lab">Sector económico</div><div class="chips"><span class="chip2 on">Comercio</span><span class="chip2">Servicios</span></div></div>
              <div class="box box-sm"><div class="lab">Ingresos mensuales</div><div class="chips"><span class="chip2">1–3M</span><span class="chip2 on">3–5M</span><span class="chip2">+5M</span></div></div>
              <div class="box box-sm"><div class="lab">¿Para qué es?</div><div class="chips"><span class="chip2 on">Inventario</span><span class="chip2">Deuda</span></div></div>
              <button class="scr-cta">Continuar →</button>
            </div>
            <div class="wz-screen e3">
              <div class="scr-top"><div class="brand"><span class="mk">C</span>Credit<b>VE</b></div><span class="pill">4/5</span></div>
              <div class="bars"><span class="on"></span><span class="on"></span><span class="on"></span><span class="on"></span><span></span></div>
              <div class="scr-h">Comprueba tus ingresos</div>
              <div class="drop"><div class="di">⬆️</div><div class="dt">Sube tu PDF</div><div class="ds">Estados de cuenta (3 meses) o Pago Móvil · máx 4 MB</div></div>
              <div class="inp inp-file">📄 estado-cuenta.pdf · 2,1 MB ✓</div>
              <button class="scr-cta">Continuar →</button>
            </div>
            <div class="wz-screen e4">
              <div class="scr-top"><div class="brand"><span class="mk">C</span>Credit<b>VE</b></div><span class="pill">5/5</span></div>
              <div class="bars"><span class="on"></span><span class="on"></span><span class="on"></span><span class="on"></span><span class="on"></span></div>
              <div class="scr-h">Verifica tu identidad</div>
              <div class="bio"><div>🪪<span class="bt">Cédula (frente y atrás)</span></div><div>🤳<span class="bt">Selfie · Face Match</span></div></div>
              <div class="box"><div class="lab">🛡️ Powered by MetaMap</div><div class="meta-note">Al finalizar quedas en estado “Por verificar”.</div></div>
              <button class="scr-cta">Verificar y finalizar →</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- GALLERY -->
    <section class="gallery">
      <div class="gal-sticky">
        <div class="gal-head reveal"><span class="tag">Por qué CreditVE</span><h2 class="gal-h2">Pensado para Venezuela</h2></div>
        <div class="gal-track">
          <div class="gcard"><div class="ic">⚡</div><div><h3>5 minutos</h3><p>Del simulador a la pre-aprobación. Onboarding 100% digital desde tu teléfono.</p></div><div class="big-n">5'</div></div>
          <div class="gcard alt"><div class="glow"></div><div class="ic">📊</div><div><h3>Tasa BCV</h3><p>Calculado en dólares base, pagas en Bolívares a la tasa oficial del día. Transparente.</p></div><div class="big-n">BCV</div></div>
          <div class="gcard"><div class="ic">🛡️</div><div><h3>MetaMap</h3><p>Verificación biométrica facial y de cédula, estándar global anti-fraude.</p></div><div class="big-n">100%</div></div>
          <div class="gcard"><div class="ic">🤝</div><div><h3>Sin garante</h3><p>Proceso completamente individual. Tú y tu cédula, nada más.</p></div><div class="big-n">0</div></div>
          <div class="gcard alt"><div class="glow"></div><div class="ic">🏦</div><div><h3>Pago Móvil</h3><p>Desembolso y cobranza directo a tu cuenta, sin intermediarios.</p></div><div class="big-n">24h</div></div>
        </div>
      </div>
    </section>

    <!-- COUNTERS -->
    <section class="blk lh-wrap">
      <div class="head reveal"><span class="tag">Confianza</span><h2>Miles de venezolanos ya confían</h2></div>
      <div class="counts">
        <div class="count reveal"><div class="cn" data-to="15000" data-pre="+">+0</div><div class="cl">Créditos otorgados</div></div>
        <div class="count reveal"><div class="cn" data-to="98" data-suf="%">0%</div><div class="cl">Solicitudes aprobadas</div></div>
        <div class="count reveal"><div class="cn" data-to="4.9" data-suf="★">0★</div><div class="cl">Valoración promedio</div></div>
        <div class="count reveal"><div class="cn" data-to="48" data-suf="h">0h</div><div class="cl">Desembolso promedio</div></div>
      </div>
    </section>

    <!-- SECURITY -->
    <section class="blk lh-wrap" id="seguridad">
      <div class="sec-grid reveal">
        <div>
          <span class="tag">Seguridad fintech</span>
          <h2 class="sec-h2">Respaldo tecnológico de clase mundial</h2>
          <ul class="sec-list">
            <li><span class="si">🛡️</span><div><b>Verificación con MetaMap.</b> <span>Análisis biométrico para validar tu documentación oficial.</span></div></li>
            <li><span class="si">⚡</span><div><b>Alertas vía WhatsApp.</b> <span>Notificaciones automatizadas con montos a la tasa oficial del día.</span></div></li>
            <li><span class="si">🗄️</span><div><b>Estructura incorruptible.</b> <span>Tu historial se resguarda cifrado bajo estándares globales.</span></div></li>
          </ul>
        </div>
        <div class="shield"><div class="sg"></div><div class="shield-ic">🛡️</div><div class="lbl">METAMAP VERIFIED</div></div>
      </div>
    </section>

    <!-- CICLO DE PAGO -->
    <section class="blk lh-wrap">
      <div class="head reveal"><span class="tag">Transparencia total</span><h2>Tu ciclo de pago, claro</h2><p>Sin sorpresas ni letra pequeña. Así funciona cada quincena.</p></div>
      <div class="cycle">
        <div class="cyc reveal"><span class="dot"></span><div class="day">DÍA 13</div><h4>Recordatorio</h4><p>Te avisamos por WhatsApp, preventivo y amable.</p></div>
        <div class="cyc reveal"><span class="dot"></span><div class="day">DÍA 15</div><h4>Vence la cuota</h4><p>Pagas por Pago Móvil a la tasa BCV del día.</p></div>
        <div class="cyc warn reveal"><span class="dot"></span><div class="day">DÍA 18</div><h4>Recargo por mora</h4><p>Si aún no pagas, se aplica un recargo.</p></div>
        <div class="cyc bad reveal"><span class="dot"></span><div class="day">DÍA 26</div><h4>Exclusión</h4><p>Sin pago, el perfil entra en lista de exclusión.</p></div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="blk lh-wrap" id="faq">
      <div class="head reveal"><span class="tag">Soporte y transparencia</span><h2>Preguntas frecuentes</h2></div>
      <div class="faq">
        <div class="fq reveal"><h3><span class="q">·</span> ¿Cómo funciona la indexación BCV?</h3><p>Tu crédito se calcula en dólares base pero pagas en Bolívares a la tasa oficial del BCV del día de tu pago.</p></div>
        <div class="fq reveal"><h3><span class="q">·</span> ¿Qué requisitos necesito?</h3><p>Mayor de edad, cédula venezolana vigente, WhatsApp activo y un PDF con tu historial de Pago Móvil o movimientos.</p></div>
        <div class="fq reveal"><h3><span class="q">·</span> ¿Por qué MetaMap?</h3><p>Es el estándar global de verificación de identidad: confirma por reconocimiento facial que tú solicitas, anti-fraude.</p></div>
        <div class="fq reveal"><h3><span class="q">·</span> ¿Cómo son los ciclos de pago?</h3><p>Recordatorio el día 13, cuota vence el 15, mora desde el 18 y exclusión automática si no hay pago al 26.</p></div>
      </div>
    </section>

    <!-- FINAL -->
    <section class="blk lh-wrap final">
      <div class="final-card reveal">
        <div class="glow"></div>
        <h2>¿Listo para impulsar<br>tus proyectos?</h2>
        <p>Simula hoy tu microcrédito y obtén tu financiamiento de forma rápida, segura y transparente.</p>
        <button class="btn btn-pri btn-lg" @click="emit('startWizard', 1)">Iniciar Solicitud Express →</button>
      </div>
    </section>

    <!-- CTA fija móvil -->
    <div class="mcta"><button class="btn btn-pri btn-lg" @click="emit('startWizard', 1)">Solicitar mi Crédito →</button></div>
  </div>
</template>

<style scoped>
.landing-home{
  --bg:var(--bg-dark);--text:var(--text-primary);--text-2:var(--text-secondary);--text-3:var(--text-muted);
  --display:'Bricolage Grotesque',sans-serif;--body:'Inter',sans-serif;
  position:relative;
}
.lh-wrap{max-width:1120px;margin:0 auto;padding:0 24px;position:relative;z-index:2}
.g{background:linear-gradient(115deg,var(--primary),var(--accent));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.tag{display:inline-block;font-size:11px;font-weight:700;letter-spacing:1.6px;color:var(--primary);text-transform:uppercase;margin-bottom:14px}
.btn{display:inline-flex;align-items:center;gap:9px;border:none;cursor:pointer;font-family:var(--body);font-weight:700;border-radius:12px;transition:.28s}
.btn-pri{background:linear-gradient(135deg,var(--primary),var(--primary-dark));color:#001712;padding:12px 22px;font-size:14px;box-shadow:0 6px 22px var(--primary-glow)}
.btn-pri:hover{transform:translateY(-2px);box-shadow:0 10px 32px var(--primary-glow)}
.btn-ghost{background:rgba(255,255,255,.04);border:1px solid var(--border);color:var(--text);padding:12px 22px;font-size:14px}
.btn-ghost:hover{background:rgba(255,255,255,.08);border-color:var(--text-2)}
.btn-lg{padding:16px 30px;font-size:16px;border-radius:14px}

/* HERO */
.hero{max-width:1120px;margin:0 auto;padding:40px 24px 70px;display:grid;grid-template-columns:1.15fr .85fr;gap:40px;align-items:center;position:relative;z-index:2}
@media(max-width:900px){.hero{grid-template-columns:1fr;text-align:center}}
.chip{display:inline-flex;align-items:center;gap:9px;background:rgba(0,200,150,.08);border:1px solid rgba(0,200,150,.22);color:var(--primary);font-size:12.5px;font-weight:600;padding:7px 15px;border-radius:100px;margin-bottom:24px}
.chip .d{width:7px;height:7px;border-radius:50%;background:var(--primary);animation:lh-pulse 2s infinite}
.hero h1{font-family:var(--display);font-weight:800;font-size:clamp(2.4rem,5.2vw,4.2rem);line-height:1.02;letter-spacing:-2px;margin-bottom:22px;color:var(--text)}
.hero .lead{color:var(--text-2);font-size:clamp(15px,1.6vw,17.5px);line-height:1.65;max-width:520px;margin-bottom:34px}
@media(max-width:900px){.hero .lead{margin-inline:auto}}
.cta-row{display:flex;gap:14px;flex-wrap:wrap;margin-bottom:46px}
@media(max-width:900px){.cta-row{justify-content:center}}
.stats{display:flex;gap:30px;flex-wrap:wrap}
@media(max-width:900px){.stats{justify-content:center}}
.stat .n{font-family:var(--display);font-size:26px;font-weight:800;color:var(--primary);line-height:1}
.stat .l{font-size:12px;color:var(--text-2);margin-top:5px}
.stat-div{width:1px;background:var(--border)}
.hero-art{position:relative;display:flex;justify-content:center;perspective:1300px}
.sim-wrap{transform-style:preserve-3d;transition:transform .15s ease-out}
.sim{width:330px;max-width:100%;background:var(--bg-card);border:1px solid var(--border);border-radius:24px;padding:24px;box-shadow:0 40px 90px rgba(0,0,0,.6),0 0 0 1px rgba(255,255,255,.03);position:relative;overflow:hidden;animation:lh-float 5.5s ease-in-out infinite}
.sim::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--primary),var(--accent))}
.sim .bcv{position:absolute;top:18px;right:18px;font-size:10px;font-weight:700;color:#a5a0ff;background:rgba(108,99,255,.14);border:1px solid rgba(108,99,255,.3);padding:3px 9px;border-radius:100px}
.sim .sh{display:flex;align-items:center;gap:11px;margin-bottom:20px}
.sim .si{width:42px;height:42px;border-radius:12px;background:rgba(0,200,150,.12);border:1px solid rgba(0,200,150,.3);color:var(--primary);display:flex;align-items:center;justify-content:center;font-size:19px}
.sim .st{font-size:15px;font-weight:800;color:var(--text)}.sim .ss{font-size:11px;color:var(--text-2)}
.sim .lab{font-size:11px;color:var(--text-2);font-weight:600;margin-bottom:6px}
.sim .amt{font-family:var(--display);font-size:38px;font-weight:800;color:var(--primary);letter-spacing:-1.5px}
.sim .amt small{font-size:13px;color:var(--text-3);font-weight:600;font-family:var(--body)}
.sim .slider{height:6px;border-radius:4px;background:linear-gradient(to right,var(--primary) 32%,var(--border) 32%);margin:14px 0 6px;position:relative}
.sim .knob{position:absolute;left:32%;top:50%;transform:translate(-50%,-50%);width:20px;height:20px;border-radius:50%;background:var(--primary);box-shadow:0 0 12px var(--primary-glow)}
.sim .res{background:linear-gradient(135deg,rgba(0,200,150,.1),rgba(108,99,255,.08));border:1px solid rgba(0,200,150,.22);border-radius:14px;padding:15px;text-align:center;margin:18px 0}
.sim .res .rl{font-size:10px;text-transform:uppercase;letter-spacing:.6px;color:var(--text-2);font-weight:700}
.sim .res .ra{font-family:var(--display);font-size:30px;font-weight:800;color:var(--primary);letter-spacing:-1px;margin-top:3px}
.sim .cta-mini{width:100%;padding:13px;border:none;border-radius:12px;background:linear-gradient(135deg,var(--primary),var(--primary-dark));color:#001712;font-weight:800;font-family:var(--body);font-size:14px;box-shadow:0 6px 20px var(--primary-glow);cursor:pointer}

/* MARQUEE */
.marquee{border-block:1px solid var(--border);padding:18px 0;overflow:hidden;position:relative;z-index:2;-webkit-mask-image:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent);mask-image:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)}
.mq-track{display:flex;align-items:center;gap:40px;width:max-content;animation:lh-mq 34s linear infinite}
.mq-track span{color:var(--text-3);font-weight:700;font-size:15px;white-space:nowrap}
.mq-brand{font-family:var(--display);font-size:18px!important;color:var(--text)!important;letter-spacing:-.4px}
.mq-brand b{color:var(--primary)}
.marquee:hover .mq-track{animation-play-state:paused}

/* STATEMENT */
.statement{padding:120px 24px;max-width:980px;margin:0 auto;text-align:center;position:relative;z-index:2}
.statement p{font-family:var(--display);font-weight:800;font-size:clamp(2rem,6vw,4.2rem);line-height:1.08;letter-spacing:-1.5px;display:flex;flex-wrap:wrap;gap:.25em;justify-content:center}
.statement .w{color:var(--text-3);transition:color .2s}

/* ===== WIZARD (CSS scroll-driven) ===== */
.wizard{position:relative;padding:30px 0 70px;z-index:2}
.wz-grid{max-width:1120px;margin:0 auto;padding:0 24px;display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:start}
@media(max-width:880px){.wz-grid{grid-template-columns:1fr;gap:0}}
.wz-flow{position:relative}
.wz-intro{min-height:40vh;display:flex;flex-direction:column;justify-content:center}
.wz-intro h2{font-family:var(--display);font-size:clamp(1.9rem,3.8vw,2.7rem);font-weight:800;letter-spacing:-1px;margin-top:6px;color:var(--text)}
.wz-intro p{color:var(--text-2);font-size:15px;margin-top:10px;max-width:380px}
.wz-rail{position:absolute;left:19px;top:46vh;height:400vh;width:3px;background:var(--border);border-radius:3px;overflow:hidden}
@media(max-width:880px){.wz-rail{display:none}}
.wz-fill{position:absolute;left:0;top:0;width:100%;height:0;background:linear-gradient(180deg,var(--primary),var(--accent));border-radius:3px}
.wz-step{min-height:80vh;display:flex;flex-direction:column;justify-content:center;padding-left:62px;opacity:.32;transform:translateY(8px)}
@media(max-width:880px){.wz-step{min-height:auto;padding:36px 0 36px 62px;opacity:1;transform:none}}
.wz-num{position:absolute;left:0;width:40px;height:40px;border-radius:50%;background:var(--bg);border:1.5px solid var(--border);display:flex;align-items:center;justify-content:center;font-family:var(--display);font-weight:800;font-size:16px;color:var(--text-2);z-index:2}
.wz-step h3{font-family:var(--display);font-size:clamp(1.5rem,3vw,2.2rem);font-weight:800;letter-spacing:-.8px;line-height:1.1;margin-bottom:12px;color:var(--text)}
.wz-step p{font-size:15px;color:var(--text-2);line-height:1.6;max-width:430px}
.wz-step .feat{margin-top:14px;display:flex;flex-wrap:wrap;gap:8px}
.wz-step .feat span{font-size:12px;font-weight:600;color:var(--primary);background:rgba(0,200,150,.1);border:1px solid rgba(0,200,150,.25);padding:5px 11px;border-radius:100px}
.wz-visual{position:sticky;top:0;height:100vh;display:flex;align-items:center;justify-content:center}
@media(max-width:880px){.wz-visual{display:none}}
/* iPhone 15 Pro (Dynamic Island) */
.wz-phone{position:relative;width:300px;height:612px;background:#000;border:11px solid #1b1b1d;border-radius:56px;box-shadow:0 40px 90px rgba(0,0,0,.65),inset 0 0 0 2px rgba(255,255,255,.05),0 0 0 1px rgba(255,255,255,.04);overflow:hidden}
.wz-phone .island{position:absolute;top:14px;left:50%;transform:translateX(-50%);width:96px;height:28px;background:#000;border-radius:20px;z-index:40;box-shadow:inset 0 0 0 1px rgba(255,255,255,.04)}
.wz-screen{position:absolute;inset:0;padding:56px 16px 18px;display:flex;flex-direction:column;opacity:0}
.wz-screen.e0{opacity:1}
.scr-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
.scr-top .brand{display:flex;align-items:center;gap:7px;font-size:13px;font-weight:800;color:var(--text)}
.scr-top .brand b{color:var(--primary)}
.scr-top .brand .mk{width:24px;height:24px;border-radius:7px;background:linear-gradient(135deg,var(--primary),var(--primary-dark));display:flex;align-items:center;justify-content:center;color:#001712;font-weight:900;font-size:12px}
.pill{font-size:10px;font-weight:700;color:var(--text-2);background:var(--bg-card-2);border:1px solid var(--border);padding:4px 9px;border-radius:100px}
.bars{display:flex;gap:5px;margin-bottom:16px}.bars span{height:4px;flex:1;border-radius:3px;background:var(--border)}.bars span.on{background:linear-gradient(90deg,var(--primary),var(--primary-light))}
.scr-h{font-family:var(--display);font-size:20px;font-weight:800;letter-spacing:-.5px;margin-bottom:14px;color:var(--text)}
.box{background:var(--bg-card);border:1px solid var(--border);border-radius:16px;padding:15px;margin-bottom:11px}
.box-sm{padding:12px}
.box .lab{font-size:11px;color:var(--text-2);margin-bottom:6px}
.box .big{font-family:var(--display);font-size:30px;font-weight:800;color:var(--primary);letter-spacing:-1px}
.box .ves{font-size:11px;color:var(--text-3);margin-top:3px}
.miniSlider{height:6px;border-radius:4px;background:linear-gradient(to right,var(--primary) 34%,var(--border) 34%);margin-top:10px;position:relative}
.miniSlider b{position:absolute;left:34%;top:50%;transform:translate(-50%,-50%);width:18px;height:18px;border-radius:50%;background:var(--primary);box-shadow:0 0 10px var(--primary-glow)}
.ch-row{margin-bottom:11px}
.inp{background:var(--bg-card-2);border:1px solid var(--border);border-radius:10px;padding:11px;font-size:12px;color:var(--text);margin-bottom:9px;display:flex;gap:8px}
.inp.act{border-color:var(--primary);box-shadow:0 0 0 3px var(--primary-glow)}
.inp-file{margin-top:12px}
.chips{display:flex;flex-wrap:wrap;gap:7px}.chip2{font-size:11px;font-weight:600;padding:7px 10px;border-radius:9px;border:1px solid var(--border);background:var(--bg-card-2);color:var(--text-2)}.chip2.on{background:rgba(0,200,150,.12);border-color:var(--primary);color:var(--primary)}
.drop{border:1.5px dashed rgba(0,200,150,.4);border-radius:14px;background:rgba(0,200,150,.04);padding:24px;text-align:center}
.drop .di{font-size:26px;margin-bottom:8px}.drop .dt{font-size:12px;font-weight:700;color:var(--text)}.drop .ds{font-size:10.5px;color:var(--text-2);margin-top:3px;line-height:1.4}
.bio{display:flex;gap:10px;margin-bottom:11px}.bio div{flex:1;aspect-ratio:1;border-radius:14px;border:1px solid var(--border);background:var(--bg-card-2);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;font-size:24px}.bio .bt{font-size:9.5px;color:var(--text-2);text-align:center;padding:0 6px}
.meta-note{font-size:11px;color:var(--text-2);margin-top:4px}
.scr-cta{margin-top:auto;width:100%;padding:14px;border:none;border-radius:13px;background:linear-gradient(135deg,var(--primary),var(--primary-dark));color:#001712;font-weight:800;font-family:var(--body);font-size:13.5px;box-shadow:0 6px 20px var(--primary-glow)}

/* GALLERY */
.gallery{position:relative;height:300vh;z-index:2}
.gal-sticky{position:sticky;top:0;height:100vh;display:flex;flex-direction:column;justify-content:center;overflow:hidden}
.gal-head{max-width:1120px;margin:0 auto 30px;padding:0 24px}
.gal-h2{font-family:var(--display);font-size:clamp(1.8rem,3.6vw,2.6rem);font-weight:800;letter-spacing:-1px;color:var(--text)}
.gal-track{display:flex;gap:22px;padding-inline:max(24px,calc((100vw - 1120px)/2));will-change:transform}
.gcard{flex:0 0 340px;height:420px;border-radius:24px;border:1px solid var(--border);padding:30px;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden;background:var(--bg-card)}
.gcard .ic{font-size:34px}
.gcard h3{font-family:var(--display);font-size:22px;font-weight:800;letter-spacing:-.6px;margin-bottom:8px;color:var(--text)}
.gcard p{font-size:13.5px;color:var(--text-2);line-height:1.6}
.gcard .big-n{font-family:var(--display);font-size:60px;font-weight:800;color:var(--primary);letter-spacing:-2px;line-height:1}
.gcard.alt{background:linear-gradient(160deg,rgba(0,200,150,.12),rgba(108,99,255,.08));border-color:rgba(0,200,150,.25)}
.gcard .glow{position:absolute;width:160px;height:160px;border-radius:50%;background:var(--primary-glow);filter:blur(50px);bottom:-40px;right:-30px}

.blk{padding:90px 0;position:relative;z-index:2}
.head{text-align:center;max-width:620px;margin:0 auto 56px}
.head h2{font-family:var(--display);font-size:clamp(2rem,4vw,2.9rem);font-weight:800;letter-spacing:-1.2px;line-height:1.1;margin-bottom:14px;color:var(--text)}
.head p{color:var(--text-2);font-size:15.5px;line-height:1.6}

.counts{display:grid;grid-template-columns:repeat(4,1fr);gap:22px;max-width:960px;margin:0 auto}
@media(max-width:740px){.counts{grid-template-columns:repeat(2,1fr)}}
.count{background:var(--bg-card);border:1px solid var(--border);border-radius:20px;padding:30px 22px;text-align:center}
.count .cn{font-family:var(--display);font-size:clamp(2.2rem,4.4vw,3.2rem);font-weight:800;letter-spacing:-1.5px;line-height:1;background:linear-gradient(135deg,var(--primary),var(--accent));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.count .cl{font-size:12.5px;color:var(--text-2);margin-top:10px;font-weight:500}

.sec-grid{display:grid;grid-template-columns:1.2fr .8fr;gap:42px;align-items:center;background:linear-gradient(135deg,rgba(7,11,20,.5),rgba(108,99,255,.05));border:1px solid var(--border);border-radius:28px;padding:48px}
@media(max-width:820px){.sec-grid{grid-template-columns:1fr;padding:30px}}
.sec-h2{font-family:var(--display);font-size:clamp(1.7rem,3.4vw,2.4rem);font-weight:800;letter-spacing:-1px;line-height:1.15;color:var(--text)}
.sec-list{list-style:none;display:flex;flex-direction:column;gap:18px;margin-top:24px}
.sec-list li{display:flex;gap:14px;align-items:flex-start}
.sec-list .si{width:38px;height:38px;border-radius:11px;background:rgba(0,200,150,.12);border:1px solid rgba(0,200,150,.3);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
.sec-list b{color:var(--text);font-size:14px}.sec-list span{color:var(--text-2);font-size:13px;line-height:1.5}
.shield{position:relative;justify-self:center;width:230px;height:230px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.08);border-radius:38px;backdrop-filter:blur(12px);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;animation:lh-float 5s ease-in-out infinite}
.shield .sg{position:absolute;width:150px;height:150px;background:radial-gradient(circle,var(--primary-glow),transparent 70%)}
.shield-ic{font-size:46px;z-index:2}
.shield .lbl{font-size:10px;font-weight:800;letter-spacing:1px;color:var(--primary);background:rgba(0,200,150,.1);padding:5px 12px;border-radius:100px;z-index:2}

.cycle{max-width:960px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
@media(max-width:740px){.cycle{grid-template-columns:1fr}}
.cyc{background:var(--bg-card);border:1px solid var(--border);border-radius:18px;padding:24px;position:relative}
.cyc .day{font-family:var(--display);font-size:13px;font-weight:800;color:var(--primary);letter-spacing:.5px;margin-bottom:8px}
.cyc h4{font-size:15px;font-weight:800;margin-bottom:6px;color:var(--text)}
.cyc p{font-size:12.5px;color:var(--text-2);line-height:1.5}
.cyc .dot{position:absolute;top:-7px;left:24px;width:13px;height:13px;border-radius:50%;background:var(--primary);box-shadow:0 0 0 5px rgba(0,200,150,.14)}
.cyc.warn .day{color:var(--warning)}.cyc.warn .dot{background:var(--warning);box-shadow:0 0 0 5px rgba(255,184,0,.14)}
.cyc.bad .day{color:var(--danger)}.cyc.bad .dot{background:var(--danger);box-shadow:0 0 0 5px rgba(255,77,106,.14)}

.faq{display:grid;grid-template-columns:1fr 1fr;gap:18px;max-width:920px;margin:0 auto}
@media(max-width:680px){.faq{grid-template-columns:1fr}}
.fq{background:var(--bg-card);border:1px solid var(--border);border-radius:18px;padding:24px;transition:.25s}
.fq:hover{border-color:rgba(0,200,150,.3);transform:translateY(-3px)}
.fq h3{font-size:14.5px;font-weight:800;margin-bottom:10px;color:var(--text)}.fq h3 .q{color:var(--primary)}
.fq p{font-size:13px;color:var(--text-2);line-height:1.6}

.final{text-align:center}
.final-card{background:linear-gradient(135deg,rgba(0,200,150,.07),rgba(108,99,255,.06));border:1px solid rgba(0,200,150,.18);border-radius:30px;padding:70px 30px;max-width:820px;margin:0 auto;position:relative;overflow:hidden}
.final-card h2{font-family:var(--display);font-size:clamp(2rem,4.4vw,3rem);font-weight:800;letter-spacing:-1.2px;margin-bottom:14px;color:var(--text)}
.final-card p{color:var(--text-2);font-size:15px;max-width:480px;margin:0 auto 30px;line-height:1.6}
.final-card .glow{position:absolute;width:260px;height:260px;border-radius:50%;background:var(--primary-glow);filter:blur(70px);top:-60px;left:30%}

.mcta{position:fixed;left:0;right:0;bottom:0;z-index:70;display:none;padding:12px 16px;background:rgba(7,11,20,.9);backdrop-filter:blur(14px);border-top:1px solid var(--border)}
.mcta .btn{width:100%;justify-content:center}
@media(max-width:760px){.mcta{display:flex}}

.reveal{opacity:1}

@keyframes lh-pulse{0%,100%{opacity:1}50%{opacity:.35}}
@keyframes lh-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-13px)}}
@keyframes lh-mq{to{transform:translateX(-50%)}}

@supports (animation-timeline: view()){
  .reveal{animation:lh-revealIn linear both;animation-timeline:view();animation-range:entry 0% cover 32%}
  @keyframes lh-revealIn{from{opacity:0;transform:translateY(46px)}to{opacity:1;transform:none}}
  .sim-scroll{animation:lh-simSettle linear both;animation-timeline:view();animation-range:entry 0% exit 80%}
  @keyframes lh-simSettle{0%{transform:rotateY(-16deg) rotateX(9deg) scale(.92)}40%{transform:none}100%{transform:rotateY(8deg) rotateX(-4deg) scale(.97)}}
  .statement{view-timeline-name:--lhstmt}
  .statement .w{animation:lh-wordLit linear both;animation-timeline:--lhstmt}
  .statement .w:nth-child(1){animation-range:cover 8% cover 22%}
  .statement .w:nth-child(2){animation-range:cover 18% cover 32%}
  .statement .w:nth-child(3){animation-range:cover 28% cover 42%}
  .statement .w:nth-child(4){animation-range:cover 38% cover 52%}
  .statement .w:nth-child(5){animation-range:cover 48% cover 62%}
  .statement .w:nth-child(6){animation-range:cover 58% cover 72%}
  @keyframes lh-wordLit{to{color:var(--text)}}
  .gallery{view-timeline-name:--lhgal}
  .gal-track{animation:lh-galSlide linear both;animation-timeline:--lhgal;animation-range:cover 5% cover 95%}
  @keyframes lh-galSlide{to{transform:translateX(calc(-100% + 92vw))}}
  .gal-head{animation:lh-revealIn linear both;animation-timeline:--lhgal;animation-range:cover 0% cover 12%}

  /* wizard step-sync (the section's own view-timeline drives steps + phone) */
  .wizard{view-timeline-name:--lhwz}
  .wz-screen{animation:lh-wzScr linear both;animation-timeline:--lhwz}
  .wz-screen.e0{opacity:0;animation-range:cover 8% cover 37%}
  .wz-screen.e1{animation-range:cover 23% cover 52%}
  .wz-screen.e2{animation-range:cover 38% cover 67%}
  .wz-screen.e3{animation-range:cover 53% cover 82%}
  .wz-screen.e4{animation-range:cover 66% cover 97%}
  @keyframes lh-wzScr{from{opacity:0}50%{opacity:1}to{opacity:0}}
  .wz-step{animation:lh-wzStep linear both;animation-timeline:--lhwz}
  .wz-step.s0{animation-range:cover 8% cover 37%}
  .wz-step.s1{animation-range:cover 23% cover 52%}
  .wz-step.s2{animation-range:cover 38% cover 67%}
  .wz-step.s3{animation-range:cover 53% cover 82%}
  .wz-step.s4{animation-range:cover 66% cover 97%}
  @keyframes lh-wzStep{from{opacity:.3;transform:translateY(8px)}50%{opacity:1;transform:none}to{opacity:.3;transform:translateY(8px)}}
  .wz-num{animation:lh-wzNum linear both;animation-timeline:--lhwz}
  .wz-step.s0 .wz-num{animation-range:cover 8% cover 37%}
  .wz-step.s1 .wz-num{animation-range:cover 23% cover 52%}
  .wz-step.s2 .wz-num{animation-range:cover 38% cover 67%}
  .wz-step.s3 .wz-num{animation-range:cover 53% cover 82%}
  .wz-step.s4 .wz-num{animation-range:cover 66% cover 97%}
  @keyframes lh-wzNum{from{background:var(--bg);border-color:var(--border);color:var(--text-2)}50%{background:rgba(0,200,150,.16);border-color:var(--primary);color:var(--primary);box-shadow:0 0 0 7px rgba(0,200,150,.08)}to{background:var(--bg);border-color:var(--border);color:var(--text-2)}}
  .wz-fill{animation:lh-wzFill linear both;animation-timeline:--lhwz;animation-range:cover 20% cover 84%}
  @keyframes lh-wzFill{from{height:0}to{height:100%}}
}

@media (prefers-reduced-motion: reduce){
  .sim-wrap,.sim,.shield,.chip .d{animation:none!important;transition:none!important}
  .statement .w{color:var(--text)}
  .wz-step{opacity:1!important;transform:none!important}
  .wz-screen{opacity:0!important}.wz-screen.e0{opacity:1!important}
}
</style>
