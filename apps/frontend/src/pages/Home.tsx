/**
 * Home.tsx — Obsidian Archive · Landing Page
 * Sections: Nav · Hero · Services · Gallery · About · Contact · Footer
 */

import { useState, useEffect, useRef } from 'react'
import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'
import { useNavigate } from 'react-router-dom'
import { Icon } from '@iconify/react'
import hero    from '@/assets/TattooPoint.jpg'
import img1    from '@/assets/LoginImage1.jpg'
import img2    from '@/assets/LoginImage2.jpg'
import img3    from '@/assets/LoginImage3.jpg'
import img4    from '@/assets/LoginImage4.jpg'
import { emailService } from '@/lib/emailjs.service'
import logo    from '@/assets/LogoObsidianWhite.png'

// ── Smooth-scroll helper ──────────────────────────────────────────────────
function scrollTo(id: string) {
  const wrapper = document.querySelector('.simplebar-content-wrapper')
  const target  = document.getElementById(id)
  if (!wrapper || !target) return
  const offset = target.getBoundingClientRect().top - wrapper.getBoundingClientRect().top + wrapper.scrollTop
  wrapper.scrollTo({ top: offset, behavior: 'smooth' })
}

// ── Data ──────────────────────────────────────────────────────────────────
const SERVICES = [
  {
    num: '01',
    title: 'Custom Tattoos',
    desc: 'Unique, one-of-a-kind pieces designed exclusively for you. From concept sketch to finished ink, our artists bring your vision to life with precision and artistry.',
    detail: 'Starting from $150 · 1–6 hrs',
    img: img1,
  },
  {
    num: '02',
    title: 'Fine Line',
    desc: 'Delicate, intricate work executed with surgical precision. Botanical illustrations, portraiture and geometric patterns rendered in elegant, ultra-thin lines.',
    detail: 'Starting from $120 · 1–3 hrs',
    img: img2,
  },
  {
    num: '03',
    title: 'Cover-Ups',
    desc: 'Skilled reworking of existing tattoos into something you can be proud of. We assess, design, and execute seamless transformations.',
    detail: 'Starting from $200 · 2–8 hrs',
    img: img3,
  },
  {
    num: '04',
    title: 'Touch-Ups & Restoration',
    desc: 'Revive faded or damaged tattoos. We restore vibrancy, sharpen lines, and renew pieces that have aged over time.',
    detail: 'Starting from $80 · 1–3 hrs',
    img: img4,
  },
]

const STATS = [
  { num: '500+', label: 'Pieces Completed' },
  { num: '8',    label: 'Years in Business' },
  { num: '12',   label: 'Artists on Staff'  },
  { num: '98%',  label: 'Client Satisfaction' },
]

// ── Contact form state type ───────────────────────────────────────────────
type ContactForm = { name: string; email: string; subject: string; message: string }
type ContactStatus = 'idle' | 'sending' | 'success' | 'error'

// ── Component ─────────────────────────────────────────────────────────────
export default function Home() {
  const navigate = useNavigate()
  const [scrollY,    setScrollY]    = useState(0)
  const [activeNav,  setActiveNav]  = useState('')
  const [menuOpen,   setMenuOpen]   = useState(false)
  const [form,       setForm]       = useState<ContactForm>({ name: '', email: '', subject: '', message: '' })
  const [status,     setStatus]     = useState<ContactStatus>('idle')
  const [activeService, setActiveService] = useState(0)
  const sbRef = useRef<any>(null)

  // Track scroll for nav transparency + active section
  useEffect(() => {
    const wrapper = document.querySelector('.simplebar-content-wrapper')
    if (!wrapper) return
    const onScroll = () => {
      setScrollY(wrapper.scrollTop)
      const sections = ['services', 'gallery', 'about', 'contact']
      for (const id of sections) {
        const el = document.getElementById(id)
        if (!el) continue
        const rect = el.getBoundingClientRect()
        if (rect.top <= 120 && rect.bottom > 120) { setActiveNav(id); break }
      }
    }
    wrapper.addEventListener('scroll', onScroll, { passive: true })
    return () => wrapper.removeEventListener('scroll', onScroll)
  }, [])

  // Auto-cycle service cards on mobile
  useEffect(() => {
    const t = setInterval(() => setActiveService(p => (p + 1) % SERVICES.length), 4000)
    return () => clearInterval(t)
  }, [])

  const setField = (f: keyof ContactForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [f]: e.target.value }))

  // ── EmailJS send (plug in your IDs here) ─────────────────────────────────
  async function handleContactSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setStatus('sending')
    try {
      await emailService.sendContactForm({
        user_name:  form.name,
        user_email: form.email,
        subject:    form.subject || 'Contact from Obsidian Archive',
        message:    form.message,
      })
      setStatus('success')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  const navLinks = [
    { id: 'services', label: 'Services' },
    { id: 'gallery',  label: 'Gallery'  },
    { id: 'about',    label: 'About'    },
    { id: 'contact',  label: 'Contact'  },
    { id: 'catalog',  label: 'Catalog', href: '/catalog' },
  ]

  const inCls = 'w-full bg-transparent border-b border-white/15 pb-3 text-[13px] text-white/85 outline-none placeholder:text-white/20 focus:border-[#ff5a66] transition-colors'

  return (
    <SimpleBar ref={sbRef} style={{ height: '100svh', width: '100%' }} autoHide={false} forceVisible="y">

      {/* ══════════════════════════════════════════════════════════════
          NAV
      ══════════════════════════════════════════════════════════════ */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrollY > 60 ? 'bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/8' : ''
      }`}>
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">

          {/* Logo */}
          <button onClick={() => scrollTo('hero')} className="flex items-center gap-3">
            <img src={logo} alt="Obsidian Archive" className="h-14 w-auto" />
          </button>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map(({ id, label, href }) => (
              <li key={id}>
                <button
                  onClick={() => href ? navigate(href) : scrollTo(id)}
                  className={`text-[10px] uppercase tracking-[0.25em] transition-colors ${
                    activeNav === id ? 'text-[#ff5a66]' : 'text-white/40 hover:text-white/80'
                  }`}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>

          {/* CTA buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="h-9 px-5 border border-white/15 text-[10px] uppercase tracking-[0.2em] text-white/50 hover:text-white hover:border-white/30 transition-colors rounded-sm flex items-center gap-2"
            >
              <Icon icon="mdi:login-variant" className="w-3.5 h-3.5" />
              Staff Login
            </button>
            <button
              onClick={() => navigate('/book')}
              className="h-9 px-5 bg-[#ff5a66] hover:bg-[#ff7078] text-black text-[10px] font-bold uppercase tracking-[0.2em] transition-colors rounded-sm flex items-center gap-2"
            >
              <Icon icon="mdi:calendar-plus" className="w-3.5 h-3.5" />
              Book Now
            </button>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(p => !p)}
            className="md:hidden flex flex-col gap-1.5 p-2"
          >
            <span className={`block h-px w-6 bg-white/60 transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block h-px w-6 bg-white/60 transition-all ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-px w-6 bg-white/60 transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-[#0f0f0f] border-t border-white/8 px-6 py-6 space-y-4">
            {navLinks.map(({ id, label }) => (
              <button key={id} onClick={() => { scrollTo(id); setMenuOpen(false) }}
                className="block w-full text-left text-[11px] uppercase tracking-[0.25em] text-white/50 hover:text-white py-2">
                {label}
              </button>
            ))}
            <div className="flex gap-3 pt-4">
              <button onClick={() => navigate('/login')}
                className="flex-1 h-10 border border-white/15 text-[10px] uppercase tracking-[0.2em] text-white/50 rounded-sm">
                Login
              </button>
              <button onClick={() => navigate('/book')}
                className="flex-1 h-10 bg-[#ff5a66] text-black text-[10px] font-bold uppercase tracking-[0.2em] rounded-sm">
                Book Now
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ══════════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════════ */}
      <section id="hero" className="relative min-h-screen flex flex-col justify-end overflow-hidden">

        {/* Full-bleed image */}
        <div className="absolute inset-0">
          <img src={hero} alt="" className="w-full h-full object-cover" style={{ filter: 'brightness(0.38) saturate(0.7)' }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/60 to-transparent" />
        </div>

        {/* Grain overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")', backgroundRepeat: 'repeat', backgroundSize: '128px' }}
        />

        {/* Content */}
        <div className="relative z-10 px-6 md:px-16 pb-20 md:pb-28 max-w-5xl">
          <p className="text-[10px] uppercase tracking-[0.5em] text-[#ff5a66]/80 mb-6">
            Santo Domingo · Est. 2016
          </p>
          <h1 className="font-light text-white/95 leading-[0.88] mb-8"
            style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(60px, 10vw, 130px)' }}>
            Where Skin<br />
            <em className="text-[#ff5a66] not-italic">Becomes Art</em>
          </h1>
          <p className="text-[14px] md:text-[15px] text-white/45 leading-relaxed max-w-md mb-10" style={{ letterSpacing: '0.04em' }}>
            Obsidian Archive is a premier tattoo studio dedicated to creating timeless,
            extraordinary work on every client who walks through our doors.
          </p>
          <div className="flex flex-wrap gap-4">
            <button onClick={() => navigate('/book')}
              className="h-12 px-8 bg-[#ff5a66] hover:bg-[#ff7078] text-black text-[10px] font-bold uppercase tracking-[0.3em] rounded-sm transition-all flex items-center gap-2">
              <Icon icon="mdi:calendar-plus" className="w-4 h-4" />
              Book a Session
            </button>
            <button onClick={() => scrollTo('services')}
              className="h-12 px-8 border border-white/20 text-white/60 hover:text-white hover:border-white/40 text-[10px] uppercase tracking-[0.25em] rounded-sm transition-all flex items-center gap-2">
              <Icon icon="mdi:arrow-down" className="w-4 h-4" />
              Explore Services
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 right-8 md:right-16 z-10 flex flex-col items-center gap-2">
          <div className="w-px h-16 bg-gradient-to-b from-transparent to-white/20" />
          <span className="text-[9px] uppercase tracking-[0.3em] text-white/25 [writing-mode:vertical-rl]">Scroll</span>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          STATS BAR
      ══════════════════════════════════════════════════════════════ */}
      <div className="border-y border-white/8 bg-[#111]">
        <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-2 md:grid-cols-4">
          {STATS.map((s, i) => (
            <div key={i} className={`py-8 px-6 text-center ${
              i < STATS.length - 1 ? 'border-r border-white/8' : ''
            }`}>
              <p className="text-white/90 font-light mb-1"
                style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(32px, 4vw, 48px)' }}>
                {s.num}
              </p>
              <p className="text-[9px] uppercase tracking-[0.25em] text-white/30">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          SERVICES
      ══════════════════════════════════════════════════════════════ */}
      <section id="services" className="py-24 md:py-36">
        <div className="max-w-7xl mx-auto px-6 md:px-10">

          <div className="mb-16 md:mb-20">
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#ff5a66]/70 mb-4">What We Do</p>
            <h2 className="font-light text-white/90"
              style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(38px, 5vw, 64px)' }}>
              Our Services
            </h2>
          </div>

          {/* Service tabs — desktop */}
          <div className="hidden md:grid grid-cols-[280px_1fr] gap-0 border border-white/10 rounded-sm overflow-hidden">

            {/* Left: tab list */}
            <div className="bg-[#111] border-r border-white/10">
              {SERVICES.map((s, i) => (
                <button key={i}
                  onClick={() => setActiveService(i)}
                  className={`w-full text-left px-8 py-7 border-b border-white/8 last:border-0 transition-all group ${
                    activeService === i ? 'bg-[#ff5a66]/8' : 'hover:bg-white/[0.02]'
                  }`}>
                  <span className={`block text-[9px] uppercase tracking-[0.3em] mb-1.5 transition-colors ${
                    activeService === i ? 'text-[#ff5a66]' : 'text-white/25 group-hover:text-white/40'
                  }`}>{s.num}</span>
                  <span className={`block text-[13px] transition-colors ${
                    activeService === i ? 'text-white/90' : 'text-white/45 group-hover:text-white/65'
                  }`} style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '18px' }}>
                    {s.title}
                  </span>
                </button>
              ))}
            </div>

            {/* Right: active content */}
            <div className="relative overflow-hidden min-h-[400px]">
              <img
                src={SERVICES[activeService].img}
                alt={SERVICES[activeService].title}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                style={{ filter: 'brightness(0.3) saturate(0.6)' }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f0f]/80 to-transparent" />
              <div className="relative z-10 p-12 flex flex-col justify-end h-full">
                <span className="text-[9px] uppercase tracking-[0.4em] text-[#ff5a66]/70 mb-3">
                  {SERVICES[activeService].num}
                </span>
                <h3 className="text-white/95 font-light mb-5"
                  style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '42px' }}>
                  {SERVICES[activeService].title}
                </h3>
                <p className="text-[13px] text-white/50 leading-relaxed max-w-md mb-6">
                  {SERVICES[activeService].desc}
                </p>
                <div className="flex items-center gap-6">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-white/30">
                    {SERVICES[activeService].detail}
                  </span>
                  <button onClick={() => navigate('/book')}
                    className="h-9 px-5 bg-[#ff5a66] hover:bg-[#ff7078] text-black text-[9px] font-bold uppercase tracking-[0.25em] rounded-sm transition-colors">
                    Book This →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile: card stack */}
          <div className="md:hidden space-y-4">
            {SERVICES.map((s, i) => (
              <div key={i} className="relative rounded-sm overflow-hidden border border-white/10">
                <img src={s.img} alt={s.title} className="w-full h-48 object-cover"
                  style={{ filter: 'brightness(0.35) saturate(0.6)' }} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <span className="text-[9px] uppercase tracking-[0.3em] text-[#ff5a66]/70">{s.num}</span>
                  <h3 className="text-white/90 font-light mt-1 mb-2"
                    style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '24px' }}>
                    {s.title}
                  </h3>
                  <p className="text-[11px] text-white/40 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          GALLERY
      ══════════════════════════════════════════════════════════════ */}
      <section id="gallery" className="py-24 md:py-36 border-t border-white/8">
        <div className="max-w-7xl mx-auto px-6 md:px-10">

          <div className="flex items-end justify-between mb-14">
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-[#ff5a66]/70 mb-4">Our Work</p>
              <h2 className="font-light text-white/90"
                style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(38px, 5vw, 64px)' }}>
                The Gallery
              </h2>
            </div>
            <button onClick={() => navigate('/book')}
              className="hidden md:block h-10 px-6 border border-white/15 text-[9px] uppercase tracking-[0.25em] text-white/40 hover:text-white hover:border-white/30 rounded-sm transition-colors">
              Book a Session →
            </button>
          </div>

          {/* Asymmetric grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <div className="col-span-2 row-span-2 rounded-sm overflow-hidden group">
              <img src={img1} alt="" className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-75"
                style={{ filter: 'saturate(0.7) brightness(0.75)', minHeight: '280px' }} />
            </div>
            <div className="rounded-sm overflow-hidden group">
              <img src={img2} alt="" className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-75"
                style={{ filter: 'saturate(0.7) brightness(0.75)', minHeight: '140px' }} />
            </div>
            <div className="rounded-sm overflow-hidden group">
              <img src={img3} alt="" className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-75"
                style={{ filter: 'saturate(0.7) brightness(0.75)', minHeight: '140px' }} />
            </div>
            <div className="col-span-2 rounded-sm overflow-hidden group">
              <img src={img4} alt="" className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-75"
                style={{ filter: 'saturate(0.7) brightness(0.75)', minHeight: '140px' }} />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          ABOUT
      ══════════════════════════════════════════════════════════════ */}
      <section id="about" className="py-24 md:py-36 border-t border-white/8">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">

            {/* Image side */}
            <div className="relative">
              <div className="rounded-sm overflow-hidden">
                <img src={img2} alt="Studio" className="w-full object-cover"
                  style={{ filter: 'brightness(0.65) saturate(0.5)', aspectRatio: '4/5' }} />
              </div>
              {/* Floating accent card */}
              <div className="absolute -bottom-6 -right-4 md:-right-8 bg-[#ff5a66] text-black px-6 py-5 rounded-sm">
                <p className="text-[32px] font-light leading-none" style={{ fontFamily: 'Cormorant Garamond, serif' }}>8+</p>
                <p className="text-[9px] uppercase tracking-[0.2em] font-bold mt-1">Years of Art</p>
              </div>
              {/* Decorative border */}
              <div className="absolute -top-4 -left-4 w-32 h-32 border border-white/10 rounded-sm pointer-events-none" />
            </div>

            {/* Text side */}
            <div className="space-y-7">
              <div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-[#ff5a66]/70 mb-5">Our Story</p>
                <h2 className="font-light text-white/90 leading-tight mb-6"
                  style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(36px, 4vw, 54px)' }}>
                  Art That Outlasts<br />Trends
                </h2>
              </div>
              <p className="text-[14px] text-white/45 leading-relaxed">
                Founded in 2016 in Santo Domingo, Obsidian Archive was born from a belief
                that tattoo art deserves the same reverence as any fine art form.
                We've built a studio where craft, creativity, and client care coexist.
              </p>
              <p className="text-[14px] text-white/35 leading-relaxed">
                Our artists bring diverse backgrounds — from illustration and graphic design
                to classical painting — ensuring every piece is approached with a unique,
                informed perspective. We don't chase trends. We create permanence.
              </p>
              <div className="flex gap-8 pt-2">
                {[['Custom', 'All designs are original'], ['Sterile', '100% medical-grade'], ['Vetted', 'Artists only']].map(([t, s]) => (
                  <div key={t}>
                    <p className="text-white/80 text-[13px] font-medium mb-1" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '18px' }}>{t}</p>
                    <p className="text-[10px] text-white/30 uppercase tracking-[0.15em]">{s}</p>
                  </div>
                ))}
              </div>
              <button onClick={() => navigate('/book')}
                className="inline-flex items-center gap-3 h-12 px-8 bg-[#ff5a66] hover:bg-[#ff7078] text-black text-[10px] font-bold uppercase tracking-[0.3em] rounded-sm transition-colors">
                Start Your Journey →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          CONTACT
      ══════════════════════════════════════════════════════════════ */}
      <section id="contact" className="py-24 md:py-36 border-t border-white/8">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid md:grid-cols-2 gap-16 md:gap-24">

            {/* Left: info */}
            <div className="space-y-10">
              <div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-[#ff5a66]/70 mb-5">Get In Touch</p>
                <h2 className="font-light text-white/90 leading-tight"
                  style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(36px, 4vw, 54px)' }}>
                  Let's Design<br />Your Piece
                </h2>
              </div>
              <div className="space-y-4">
                <p className="text-[14px] text-white/50 leading-relaxed">
                  Have a custom design in mind? We'd love to hear it. Whether it's a concept
                  you've been sitting on for years or something you want to develop from scratch
                  with one of our artists — reach out and let's talk.
                </p>
                <p className="text-[13px] text-white/35 leading-relaxed">
                  Share your reference images, style preferences, placement ideas, and budget.
                  We'll match you with the right artist and guide you through the entire
                  design process before you ever sit in the chair.
                </p>
              </div>

              {/* How it works */}
              <div className="space-y-4">
                <p className="text-[9px] uppercase tracking-[0.35em] text-white/20 mb-3">How Custom Design Works</p>
                {[
                  { icon: 'mdi:message-text-outline',  step: '01', title: 'Send Us a Message',  desc: 'Describe your idea, attach references, and tell us where you want it.' },
                  { icon: 'mdi:palette-outline',       step: '02', title: 'Artist Consultation', desc: 'We match you with the right artist and schedule a free consultation.' },
                  { icon: 'mdi:pencil-ruler',          step: '03', title: 'Design & Approval',   desc: 'Your artist creates the design. You review, request changes, and approve.' },
                  { icon: 'mdi:needle',                step: '04', title: 'Book & Get Inked',    desc: 'Once approved, book your session and let the artist do their magic.' },
                ].map(({ icon, step, title, desc }) => (
                  <div key={step} className="flex gap-4 items-start">
                    <div className="w-9 h-9 rounded-sm bg-[#ff5a66]/10 border border-[#ff5a66]/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon icon={icon} className="w-4 h-4 text-[#ff5a66]" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[#ff5a66]/60 mb-0.5">{step}</p>
                      <p className="text-[13px] text-white/75 font-medium mb-1">{title}</p>
                      <p className="text-[12px] text-white/35 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Info */}
              <div className="space-y-4 pt-2 border-t border-white/8">
                {[
                  { icon: 'mdi:map-marker-outline', label: 'Location', value: 'Santo Domingo, Dominican Republic' },
                  { icon: 'mdi:clock-outline',      label: 'Hours',    value: 'Tue–Sat, 10:00 AM – 7:00 PM'     },
                  { icon: 'mdi:instagram',          label: 'Instagram', value: '@obsidianarchive'                },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <Icon icon={icon} className="w-4 h-4 text-[#ff5a66]/60 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.25em] text-white/25 mb-0.5">{label}</p>
                      <p className="text-[13px] text-white/55">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: form */}
            <div className="bg-[#111] border border-white/10 rounded-sm p-8 md:p-10">
              {status === 'success' ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#ff5a66]/10 border border-[#ff5a66]/20 flex items-center justify-center text-2xl">✓</div>
                  <h3 className="text-white/90 font-light" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px' }}>Message Sent</h3>
                  <p className="text-[12px] text-white/35">We'll get back to you within 24 hours.</p>
                  <button onClick={() => setStatus('idle')}
                    className="mt-4 text-[10px] uppercase tracking-[0.2em] text-white/30 hover:text-white/60 transition-colors">
                    Send another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-7">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.35em] text-white/20 mb-6">Send a Message</p>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[9px] uppercase tracking-[0.25em] text-white/30 mb-2">Name *</label>
                      <input value={form.name} onChange={setField('name')} required
                        className={inCls} placeholder="Your name" />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase tracking-[0.25em] text-white/30 mb-2">Email *</label>
                      <input type="email" value={form.email} onChange={setField('email')} required
                        className={inCls} placeholder="you@example.com" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase tracking-[0.25em] text-white/30 mb-2">Subject</label>
                    <input value={form.subject} onChange={setField('subject')}
                      className={inCls} placeholder="What's this about?" />
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase tracking-[0.25em] text-white/30 mb-2">Message *</label>
                    <textarea value={form.message} onChange={setField('message')} required rows={5}
                      className="w-full bg-transparent border border-white/10 rounded-sm p-3 text-[13px] text-white/85 outline-none placeholder:text-white/20 focus:border-[#ff5a66] transition-colors resize-none"
                      placeholder="Tell us about your idea, questions, or anything else..." />
                  </div>

                  {status === 'error' && (
                    <p className="text-[11px] text-red-400/80 bg-red-500/5 border border-red-500/15 rounded-sm px-4 py-3">
                      Something went wrong. Please try again or reach us on Instagram.
                    </p>
                  )}

                  <button type="submit" disabled={status === 'sending'}
                    className="w-full h-12 bg-[#ff5a66] hover:bg-[#ff7078] text-black text-[10px] font-bold uppercase tracking-[0.3em] rounded-sm disabled:opacity-50 transition-all flex items-center justify-center gap-2">
                    {status === 'sending' ? (
                      <><span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" /> Sending…</>
                    ) : <><Icon icon="mdi:send" className="w-4 h-4" /> Send Message</> }
                  </button>

                  <p className="text-center text-[10px] text-white/20">
                    We respond within 24 hours on business days.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════════════ */}
      <footer className="border-t border-white/8 bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">

          {/* Top row */}
          <div className="py-12 grid md:grid-cols-3 gap-10 md:gap-0 border-b border-white/8">
            {/* Brand */}
            <div className="space-y-4">
              <img src={logo} alt="Obsidian Archive" className="h-8 w-auto" />
              <p className="text-[12px] text-white/30 leading-relaxed max-w-xs">
                A premier tattoo studio in Santo Domingo dedicated to creating
                timeless, extraordinary work.
              </p>
            </div>

            {/* Navigation */}
            <div className="space-y-3">
              <p className="text-[9px] uppercase tracking-[0.3em] text-white/20 mb-5">Navigation</p>
              {[...navLinks, { id: 'book', label: 'Book a Session' }].map(({ id, label }) => (
                <button key={id}
                  onClick={() => id === 'book' ? navigate('/book') : scrollTo(id)}
                  className="block text-[11px] text-white/35 hover:text-white/70 uppercase tracking-[0.15em] transition-colors">
                  {label}
                </button>
              ))}
            </div>

            {/* Social / CTA */}
            <div className="space-y-4">
              <p className="text-[9px] uppercase tracking-[0.3em] text-white/20 mb-5">Follow Us</p>
              {[
                { icon: 'mdi:instagram', platform: 'Instagram', handle: '@obsidianarchive' },
                { icon: 'mdi:facebook',  platform: 'Facebook',  handle: 'Obsidian Archive' },
                { icon: 'mdi:music-note', platform: 'TikTok',  handle: '@obsidianarchive' },
              ].map(({ icon, platform, handle }) => (
                <div key={platform} className="flex items-center gap-3">
                  <Icon icon={icon} className="w-4 h-4 text-[#ff5a66]/60" />
                  <span className="text-[9px] uppercase tracking-[0.2em] text-white/20 w-20">{platform}</span>
                  <span className="text-[11px] text-white/40">{handle}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom row */}
          <div className="py-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[10px] text-white/20 uppercase tracking-[0.15em]">
              © 2024 Obsidian Archive — All rights reserved
            </p>
            <button onClick={() => navigate('/login')}
              className="text-[9px] uppercase tracking-[0.2em] text-white/20 hover:text-white/40 transition-colors">
              Staff Access
            </button>
          </div>
        </div>
      </footer>

    </SimpleBar>
  )
}
