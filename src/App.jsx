import { useEffect, useRef, useState } from 'react'

function useInView(t = 0.1) {
  const ref = useRef(null)
  const [v, setV] = useState(false)
  useEffect(() => {
    const ob = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setV(true); ob.disconnect() } },
      { threshold: t }
    )
    if (ref.current) ob.observe(ref.current)
    return () => ob.disconnect()
  }, [t])
  return [ref, v]
}

function Reveal({ children, delay = 0, direction = 'up', className = '' }) {
  const [ref, v] = useInView()
  const a = {
    up: 'animate-fade-in-up', left: 'animate-slide-left',
    right: 'animate-slide-right', scale: 'animate-scale-in', fade: 'animate-fade-in',
  }[direction]
  return (
    <div ref={ref} className={`${v ? a : 'opacity-0-init'} ${className}`}
      style={{ animationDelay: v ? `${delay}ms` : '0ms', animationFillMode: 'both' }}>
      {children}
    </div>
  )
}

function SectionHeader({ eyebrow, headline, sub, light = false }) {
  const t = light
    ? { eye: 'text-neutral-400', h: 'text-neutral-900', s: 'text-neutral-500' }
    : { eye: 'text-neutral-500', h: 'text-white', s: 'text-neutral-400' }
  return (
    <div className="text-center mb-16 lg:mb-24">
      <Reveal>
        <p className={`${t.eye} text-[10px] sm:text-[11px] font-semibold tracking-[0.55em] uppercase mb-4 sm:mb-5`}>{eyebrow}</p>
        <h2 className={`${t.h} text-[clamp(2.2rem,4vw,4rem)] font-black tracking-[-0.035em] leading-[1.02]`}>{headline}</h2>
        {sub && <p className={`${t.s} text-base sm:text-lg font-light leading-relaxed max-w-2xl mx-auto mt-5 sm:mt-6`}>{sub}</p>}
      </Reveal>
    </div>
  )
}

const TShirt = ({ className = '' }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <svg viewBox="0 0 400 480" className="w-full h-full drop-shadow-2xl" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#1c1c1c" />
          <stop offset="50%"  stopColor="#0e0e0e" />
          <stop offset="100%" stopColor="#141414" />
        </linearGradient>
        <linearGradient id="se" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#3a3a3a" />
          <stop offset="50%"  stopColor="#1e1e1e" />
          <stop offset="100%" stopColor="#3a3a3a" />
        </linearGradient>
        <filter id="ss" x="-15%" y="-10%" width="130%" height="140%">
          <feDropShadow dx="0" dy="28" stdDeviation="36" floodColor="#000" floodOpacity="0.95" />
        </filter>
      </defs>
      <g filter="url(#ss)">
        <path d="M80 80 L10 160 L80 185 L80 424 Q80 444 100 444 L300 444 Q320 444 320 424 L320 185 L390 160 L320 80 Q280 58 260 53 Q240 100 200 106 Q160 100 140 53 Q120 58 80 80Z"
          fill="url(#sg)" stroke="url(#se)" strokeWidth="1.5" />
        <path d="M200 106 Q240 100 260 53 Q240 50 220 49 Q210 76 200 82 Q190 76 180 49 Q160 50 140 53 Q160 100 200 106Z"
          fill="#171717" stroke="#2c2c2c" strokeWidth="1" />
        <path d="M80 185 L320 185" stroke="#262626" strokeWidth="0.6" />
        <path d="M80 80 L10 160 L80 185"  fill="#181818" stroke="#2c2c2c" strokeWidth="1" />
        <path d="M320 80 L390 160 L320 185" fill="#181818" stroke="#2c2c2c" strokeWidth="1" />
        <path d="M100 202 Q200 222 300 202" stroke="#232323" strokeWidth="0.8" fill="none" opacity="0.4" />
      </g>
    </svg>
    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
  </div>
)

function BenefitCard({ icon, title, delay = 0 }) {
  const [ref, v] = useInView()
  return (
    <div ref={ref}
      className={`bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8 lg:p-10
        group cursor-default transition-all duration-500 hover:bg-neutral-800/60 hover:border-neutral-700
        ${v ? 'animate-fade-in-up' : 'opacity-0-init'}`}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}>
      <span className="inline-block text-[22px] sm:text-[26px] mb-6 group-hover:scale-110 transition-transform duration-300">{icon}</span>
      <p className="text-neutral-300 text-sm sm:text-base font-medium leading-relaxed">{title}</p>
    </div>
  )
}

export default function App() {
  const [scrolled, setScrolled] = useState(false)
  const [vis, setVis] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVis(true), 80)
    const fn = () => setScrolled(window.scrollY > 48)
    window.addEventListener('scroll', fn, { passive: true })
    return () => { clearTimeout(t); window.removeEventListener('scroll', fn) }
  }, [])

  const goTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  const fade = (delay = 0) => `transition-all duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`
  const fadeStyle = (delay = 0) => ({ transitionDelay: `${delay}ms` })

  /* Single centered container — used on every section */
  const C = 'max-w-7xl mx-auto px-6 lg:px-8 xl:px-10'

  const MARQUEE = ['ROYAL HEAVY COTTON', '11 AL 1', 'LIMA, PERÚ', 'HECHO PARA DURAR', 'SIN VARIEDAD', 'PERFECCIONADO']

  return (
    <div className="bg-[#080808] text-white min-h-screen overflow-x-hidden">

      {/* ═══ NAV ═══ */}
      <nav className={`fixed inset-x-0 top-0 z-50 transition-all duration-500
        ${scrolled ? 'bg-[#080808]/93 backdrop-blur-2xl border-b border-neutral-900' : ''}`}>
        <div className={`${C} h-16 sm:h-20 flex items-center justify-between`}>
          <span className="font-black text-sm sm:text-base tracking-[0.38em] uppercase select-none">OVERSIZE</span>
          <button onClick={() => goTo('comprar')}
            className="text-[11px] font-bold tracking-[0.22em] uppercase text-[#080808] bg-white
              px-5 sm:px-7 py-2.5 rounded-full hover:bg-neutral-100
              transition-all duration-300 hover:scale-105 active:scale-95">
            Comprar
          </button>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="relative bg-[#080808] min-h-svh flex items-center overflow-hidden">

        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-white/[0.013] rounded-full blur-[180px]" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-white/[0.006] rounded-full blur-[130px]" />
        </div>

        <div className={`relative z-10 ${C} w-full`}>
          <div className="min-h-svh flex items-center py-24 sm:py-28">
            {/*
              Desktop: equal 2-col grid — text LEFT, image RIGHT
              Mobile:  single col — image top, text below, centered
            */}
            <div className="w-full grid lg:grid-cols-2 lg:gap-20 xl:gap-24 items-center">

              {/* ── IMAGE: top on mobile, right column on desktop ── */}
              <div className={`${fade(60)} lg:order-2 flex justify-center mb-12 sm:mb-16 lg:mb-0`}
                style={fadeStyle(60)}>
                <div className="relative w-[200px] sm:w-[260px] md:w-[300px] lg:w-full lg:max-w-none">
                  <div aria-hidden="true" className="absolute -inset-20 bg-white/[0.03] rounded-full blur-[90px]" />
                  <TShirt className="relative w-full h-auto" />
                  <span className="absolute -top-3 -right-2 sm:-top-4 sm:-right-3
                    bg-white text-[#080808] text-[9px] sm:text-[10px] font-black
                    tracking-[0.3em] uppercase px-3 py-1.5 rounded-full shadow-lg">
                    Nuevo
                  </span>
                </div>
              </div>

              {/* ── COPY: below image on mobile, left column on desktop ── */}
              <div className="lg:order-1 flex flex-col items-center lg:items-start text-center lg:text-left">

                <div className={fade(0)} style={fadeStyle(0)}>
                  <p className="text-neutral-500 text-[10px] sm:text-xs font-semibold
                    tracking-[0.55em] uppercase mb-6 sm:mb-8">
                    Royal Heavy Cotton — 11 al 1
                  </p>
                </div>

                <div className={fade(180)} style={fadeStyle(180)}>
                  <h1 className="text-[clamp(3rem,5.2vw,5.5rem)] font-black
                    leading-[0.88] tracking-[-0.04em] text-white mb-7 sm:mb-8 lg:mb-9">
                    NO TODOS<br />
                    <span className="shimmer-text">LOS OVERSIZED</span><br />
                    SON IGUALES.
                  </h1>
                </div>

                <div className={fade(340)} style={fadeStyle(340)}>
                  <p className="text-neutral-400 text-base sm:text-lg font-light
                    leading-relaxed mb-9 sm:mb-10 max-w-sm lg:max-w-md">
                    Uno solo. Sin variedad. Sin compromisos.
                    Perfeccionado hasta el último hilo.
                  </p>
                </div>

                <div className={`${fade(490)} w-full sm:w-auto`} style={fadeStyle(490)}>
                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <button onClick={() => goTo('comprar')}
                      className="group relative bg-white text-[#080808] text-[11px] font-black
                        tracking-[0.22em] uppercase px-8 py-[18px] rounded-full overflow-hidden
                        transition-all duration-300 hover:scale-105 active:scale-95 w-full sm:w-auto">
                      <span className="relative z-10">Conseguir el mío</span>
                      <span aria-hidden="true" className="absolute inset-0 bg-neutral-100
                        -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                    </button>
                    <button onClick={() => goTo('concepto')}
                      className="text-neutral-500 text-[11px] font-medium tracking-[0.22em] uppercase
                        px-8 py-[18px] rounded-full border border-neutral-800
                        hover:border-neutral-700 hover:text-neutral-300
                        transition-all duration-300 w-full sm:w-auto">
                      Ver más
                    </button>
                  </div>
                </div>

                {/* Spec bar — centered on mobile, left-anchored on desktop */}
                <div className={`${fade(660)} mt-12 sm:mt-14 w-full max-w-xs sm:max-w-sm lg:max-w-md`}
                  style={fadeStyle(660)}>
                  <div className="flex items-center">
                    <div className="h-px flex-1 bg-neutral-800" />
                    <div className="flex items-center px-5 sm:px-7">
                      {[
                        { val: '11:1', sub: 'Yarn Count' },
                        { val: 'Heavy', sub: 'Gramaje' },
                        { val: '1', sub: 'Producto' },
                      ].map(({ val, sub }, i) => (
                        <div key={sub} className="flex items-center">
                          {i > 0 && <div className="w-px h-6 bg-neutral-800 mx-5 sm:mx-6" />}
                          <div className="text-center">
                            <p className="text-white text-sm font-black leading-none mb-1.5">{val}</p>
                            <p className="text-neutral-600 text-[9px] tracking-[0.32em] uppercase">{sub}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="h-px flex-1 bg-neutral-800" />
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        <div aria-hidden="true"
          className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-20">
          <div className="w-px h-10 bg-neutral-400" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
          <p className="text-neutral-500 text-[9px] tracking-[0.42em] uppercase">Scroll</p>
        </div>
      </section>

      {/* ═══ MARQUEE ═══ */}
      <div className="bg-[#0a0a0a] border-y border-neutral-900 py-[13px] overflow-hidden select-none">
        <div className="marquee-track">
          {[0, 1].map((ri) => (
            <span key={ri} className="flex items-center shrink-0" aria-hidden={ri > 0}>
              {MARQUEE.map((item, i) => (
                <span key={i} className="flex items-center shrink-0">
                  <span className="text-neutral-700 text-[10px] sm:text-[11px] font-semibold
                    tracking-[0.45em] uppercase px-8 sm:px-12 lg:px-16">{item}</span>
                  <span className="text-neutral-800">·</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ═══ CONCEPT — light, fully centered editorial ═══ */}
      <section id="concepto" className="bg-[#f5f4f0] py-24 sm:py-32 lg:py-40">
        <div className={C}>

          {/* Centered text block */}
          <div className="max-w-4xl mx-auto text-center">
            <Reveal>
              <p className="text-neutral-400 text-[10px] sm:text-[11px] font-semibold
                tracking-[0.55em] uppercase mb-5 sm:mb-7">
                El concepto
              </p>
            </Reveal>
            <Reveal delay={120}>
              <h2 className="text-neutral-900 text-[clamp(2rem,4.2vw,4.5rem)] font-black
                leading-[1.02] tracking-[-0.035em] mb-7 sm:mb-9">
                "NO VENDEMOS VARIEDAD.<br />
                <span className="text-neutral-400">PERFECCIONAMOS UNO."</span>
              </h2>
            </Reveal>
            <Reveal delay={230}>
              <p className="text-neutral-500 text-base sm:text-lg font-light leading-relaxed
                max-w-2xl mx-auto mb-10 sm:mb-12">
                Mientras el mercado llena catálogos con básicos sin carácter, nosotros pasamos
                un año perfeccionando una sola pieza. Cada detalle. Cada hilo. Cada gramo de peso.
              </p>
            </Reveal>
            <Reveal delay={330}>
              <div className="inline-flex items-center gap-4 border border-neutral-300 rounded-full
                px-7 sm:px-9 py-3.5 sm:py-4">
                <span className="text-neutral-400 text-[11px] tracking-[0.45em] uppercase">Una prenda</span>
                <span className="w-1 h-1 rounded-full bg-neutral-300" />
                <span className="text-neutral-900 text-[11px] font-semibold tracking-[0.45em] uppercase">Sin igual</span>
              </div>
            </Reveal>
          </div>

          {/* Centered 3-stat row */}
          <Reveal delay={460} className="mt-16 sm:mt-20 lg:mt-24">
            <div className="grid grid-cols-3 max-w-2xl mx-auto gap-4 sm:gap-8
              border-t border-neutral-300 pt-10 sm:pt-12">
              {[
                { num: '11:1',  label: 'Hilado'   },
                { num: 'Heavy', label: 'Gramaje'  },
                { num: '01',    label: 'Producto' },
              ].map(({ num, label }) => (
                <div key={num} className="text-center px-2">
                  <p className="text-neutral-900 text-3xl sm:text-4xl lg:text-5xl
                    font-black leading-none mb-2 sm:mb-3">{num}</p>
                  <p className="text-neutral-400 text-[10px] sm:text-xs
                    font-medium tracking-[0.35em] uppercase">{label}</p>
                </div>
              ))}
            </div>
          </Reveal>

        </div>
      </section>

      {/* ═══ BENEFITS ═══ */}
      <section className="bg-[#0d0d0d] py-24 sm:py-32 lg:py-40">
        <div className={C}>
          <SectionHeader eyebrow="Por qué importa" headline="Construido diferente." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {[
              { icon: '⬛', title: 'No se deforma. Mantiene su estructura lavado tras lavado.',   delay: 0   },
              { icon: '✦',  title: 'Cero peeling. La superficie permanece intacta para siempre.', delay: 70  },
              { icon: '◎',  title: 'Hiperabsorción del sudor. Seco cuando más lo necesitás.',     delay: 140 },
              { icon: '◈',  title: 'Fresco en verano. Pesado en mano, ligero en el cuerpo.',      delay: 210 },
              { icon: '▣',  title: 'Sensación premium. El peso que define la calidad.',           delay: 280 },
              { icon: '◆',  title: 'Construcción duradera. Inversión, no gasto.',                 delay: 350 },
            ].map((b) => <BenefitCard key={b.title} {...b} />)}
          </div>
        </div>
      </section>

      {/* ═══ DIFFERENTIATION ═══ */}
      <section className="bg-[#111111] py-24 sm:py-32 lg:py-40">
        <div className={C}>
          <SectionHeader eyebrow="La diferencia" headline="No es lo mismo." />
          <div className="grid md:grid-cols-2 gap-5 lg:gap-6 items-stretch">

            {/* Market — dimmed */}
            <Reveal direction="left" className="h-full">
              <div className="h-full rounded-3xl bg-[#0a0a0a] border border-neutral-800/60
                p-8 sm:p-10 lg:p-12 xl:p-14">
                <p className="text-neutral-600 text-[10px] font-semibold tracking-[0.52em]
                  uppercase mb-9 sm:mb-10">
                  El resto del mercado
                </p>
                <ul className="space-y-5 sm:space-y-6">
                  {[
                    'Básicos sin carácter',
                    'Tela liviana, sin estructura',
                    'Se deforma al mes',
                    'Peeling desde el primer lavado',
                    'Hecho para volumen, no para calidad',
                    'Desechable. Reemplazable.',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-4">
                      <span className="text-neutral-700 shrink-0 select-none">—</span>
                      <span className="text-neutral-600 text-sm sm:text-base font-light
                        line-through decoration-neutral-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            {/* Us — elevated */}
            <Reveal direction="right" delay={100} className="h-full">
              <div className="h-full rounded-3xl bg-[#1a1a1a] border border-neutral-700/70
                p-8 sm:p-10 lg:p-12 xl:p-14">
                <p className="text-neutral-200 text-[10px] font-semibold tracking-[0.52em]
                  uppercase mb-9 sm:mb-10">
                  Royal Heavy Cotton
                </p>
                <ul className="space-y-5 sm:space-y-6">
                  {[
                    'Presencia inmediata. Sin esfuerzo.',
                    'Tela pesada. Peso que comunica.',
                    'Mantiene su forma indefinidamente.',
                    'Superficie impecable. Siempre.',
                    'Un producto. Perfeccionado al máximo.',
                    'Para durar. Para destacar.',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-4">
                      <span className="text-neutral-400 shrink-0 text-[10px] select-none">✦</span>
                      <span className="text-white text-sm sm:text-base font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-10 sm:mt-12 pt-8 border-t border-neutral-800 grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-white text-2xl sm:text-3xl font-black leading-none mb-2">11:1</p>
                    <p className="text-neutral-500 text-[10px] tracking-[0.38em] uppercase">Hilado especial</p>
                  </div>
                  <div>
                    <p className="text-white text-2xl sm:text-3xl font-black leading-none mb-2">Heavy</p>
                    <p className="text-neutral-500 text-[10px] tracking-[0.38em] uppercase">Gramaje premium</p>
                  </div>
                </div>
              </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* ═══ EXPERIENCE ═══ */}
      <section className="bg-[#080808] py-24 sm:py-32 lg:py-40 relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
            w-[560px] h-[560px] bg-white/[0.011] rounded-full blur-[120px]" />
        </div>
        <div className={`relative z-10 ${C}`}>

          <SectionHeader
            eyebrow="La experiencia"
            headline="Ponértelo cambia algo."
            sub="El primer contacto con la tela te lo dice todo. El peso cae diferente. El fit encuadra tu cuerpo sin esfuerzo."
          />

          {/*
            Mobile  → single col: attributes (top) → image (bottom)
            Desktop → 2-col equal grid: image LEFT | attributes RIGHT
          */}
          <div className="grid md:grid-cols-2 md:gap-12 lg:gap-16 xl:gap-20 items-center">

            {/* IMAGE — order: 2 on mobile (below), 1 on desktop (left) */}
            <Reveal direction="scale" delay={150} className="order-2 md:order-1">
              <div className="relative max-w-sm mx-auto md:max-w-none mt-10 md:mt-0">
                <div className="aspect-[3/4] rounded-3xl bg-[#0f0f0f] border border-neutral-800
                  overflow-hidden flex items-center justify-center">
                  <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent" />
                  <TShirt className="w-[55%] h-[55%]" />
                  <div className="absolute bottom-0 inset-x-0 p-7 sm:p-8 lg:p-10
                    bg-gradient-to-t from-black/85 to-transparent">
                    <p className="text-neutral-600 text-[10px] tracking-[0.38em] uppercase mb-1.5">Material</p>
                    <p className="text-neutral-100 font-bold text-base sm:text-lg tracking-wide">Royal Heavy Cotton</p>
                  </div>
                </div>
                <div className="absolute top-5 right-5 bg-[#0d0d0d] border border-neutral-700
                  rounded-2xl px-4 py-3 shadow-xl">
                  <p className="text-neutral-600 text-[9px] tracking-widest uppercase mb-1">Hilado</p>
                  <p className="text-white font-black text-xl sm:text-2xl leading-none">11:1</p>
                </div>
              </div>
            </Reveal>

            {/* ATTRIBUTES — order: 1 on mobile (top), 2 on desktop (right) */}
            <Reveal direction="right" delay={80} className="order-1 md:order-2">
              <div className="divide-y divide-neutral-800/60">
                {[
                  { label: 'Fit',       desc: 'Oversized estructurado. Cae sin perder forma.'  },
                  { label: 'Peso',      desc: 'Notás la calidad antes de ponértelo.'            },
                  { label: 'Presencia', desc: 'Sin logos. Sin ruido. Puro carácter.'            },
                  { label: 'Confianza', desc: 'Te sentís diferente porque lo sos.'              },
                ].map(({ label, desc }) => (
                  <div key={label} className="flex items-start gap-6 sm:gap-8 lg:gap-10 py-6 sm:py-7 group">
                    <span className="text-neutral-600 text-[10px] font-black tracking-[0.4em]
                      uppercase w-24 sm:w-28 shrink-0 pt-0.5
                      group-hover:text-neutral-400 transition-colors duration-300">
                      {label}
                    </span>
                    <p className="text-neutral-300 text-sm sm:text-base leading-relaxed
                      group-hover:text-white transition-colors duration-300">
                      {desc}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* ═══ SOCIAL PROOF — light ═══ */}
      <section className="bg-[#f5f4f0] py-24 sm:py-32 lg:py-40">
        <div className={C}>
          <SectionHeader eyebrow="Lo que dicen" headline="No hace falta convencerlos." light />
          <div className="grid md:grid-cols-3 gap-5 lg:gap-6">
            {[
              {
                quote: "Literalmente no vuelvo a usar otro polo. El peso que tiene es diferente a todo lo que probé antes.",
                name: "Rodrigo M.", city: "Lima, Miraflores", delay: 0,
              },
              {
                quote: "Pensé que era marketing. Pero cuando lo agarré y sentí el gramaje entendí todo. Vale cada sol.",
                name: "Diego V.", city: "Lima, San Isidro", delay: 80,
              },
              {
                quote: "Ya lo lavé como 20 veces. Sigue igual que el día uno. Eso no pasa con ninguna otra marca.",
                name: "Mateo A.", city: "Lima, Barranco", delay: 160,
              },
            ].map(({ quote, name, city, delay }) => (
              <Reveal key={name} direction="up" delay={delay} className="h-full">
                <div className="h-full bg-white border border-neutral-200 rounded-3xl
                  p-8 sm:p-10 hover:border-neutral-300 hover:shadow-md
                  transition-all duration-500 flex flex-col">
                  <div className="flex gap-1.5 mb-6 sm:mb-7">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-neutral-800 text-[10px]">✦</span>
                    ))}
                  </div>
                  <p className="text-neutral-600 text-sm sm:text-base font-light
                    leading-relaxed mb-7 sm:mb-8 italic flex-1">"{quote}"</p>
                  <div className="border-t border-neutral-100 pt-5 sm:pt-6">
                    <p className="text-neutral-900 font-semibold text-sm">{name}</p>
                    <p className="text-neutral-400 text-xs tracking-wide mt-1">{city}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section id="comprar" className="bg-[#080808] py-28 sm:py-40 lg:py-52 relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
            w-[1000px] h-[400px] bg-white/[0.016] rounded-full blur-[120px]" />
        </div>
        <div className={`relative z-10 ${C}`}>
          <div className="max-w-3xl mx-auto text-center">

            <Reveal>
              <p className="text-neutral-500 text-[10px] sm:text-[11px] font-semibold
                tracking-[0.55em] uppercase mb-5 sm:mb-7">
                Solo uno. Solo el mejor.
              </p>
            </Reveal>

            <Reveal delay={130}>
              <h2 className="text-[clamp(3rem,6vw,6.5rem)] font-black
                leading-[0.91] tracking-[-0.04em] text-white mb-7 sm:mb-9">
                CONSIGUE<br />
                <span className="shimmer-text">EL TUYO HOY.</span>
              </h2>
            </Reveal>

            <Reveal delay={260}>
              <p className="text-neutral-400 text-base sm:text-lg font-light leading-relaxed
                mb-12 sm:mb-14 max-w-xs mx-auto">
                Stock limitado. No producimos en masa.<br />
                Cuando se agota, se agota.
              </p>
            </Reveal>

            <Reveal delay={400}>
              <div className="flex flex-col items-center gap-8">

                <button className="group relative bg-white text-[#080808] text-[11px] sm:text-xs
                  font-black tracking-[0.26em] uppercase
                  px-10 sm:px-16 lg:px-20 py-5 sm:py-[22px] rounded-full overflow-hidden
                  transition-all duration-300 hover:scale-105 active:scale-95
                  w-full sm:w-auto shadow-[0_0_100px_rgba(255,255,255,0.07)]">
                  <span className="relative z-10">Comprar ahora →</span>
                  <span aria-hidden="true" className="absolute inset-0 bg-neutral-100
                    -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                </button>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-0">
                  {['Pago contra entrega', 'Delivery gratis +2 prendas', 'Entrega rápida Lima'].map((badge, i) => (
                    <span key={badge} className="flex items-center justify-center">
                      {i > 0 && <span className="hidden sm:block w-px h-3.5 bg-neutral-800 mx-7" />}
                      <span className="flex items-center gap-2 text-neutral-600
                        text-[10px] sm:text-[11px] font-medium tracking-[0.32em] uppercase">
                        <span className="text-neutral-700 text-[8px]">◆</span>
                        {badge}
                      </span>
                    </span>
                  ))}
                </div>

              </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="bg-[#060606] border-t border-neutral-900 py-10 sm:py-14">
        <div className={`${C} flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-0`}>
          <span className="text-white font-black text-sm tracking-[0.38em] uppercase">OVERSIZE</span>
          <p className="text-neutral-700 text-[10px] sm:text-xs tracking-widest uppercase text-center">
            Lima, Perú · Royal Heavy Cotton · 11 al 1
          </p>
          <p className="text-neutral-800 text-[10px] sm:text-xs">© 2026</p>
        </div>
      </footer>

    </div>
  )
}
