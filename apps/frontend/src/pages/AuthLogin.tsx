import Icon from '@/componentes/Icon'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import LoginImage1 from '@/assets/LoginImage1.jpg'
import LoginImage2 from '@/assets/LoginImage2.jpg'
import LoginImage3 from '@/assets/LoginImage3.jpg'
import LoginImage4 from '@/assets/LoginImage4.jpg'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '@/lib/auth.service'
import { useAuth } from '@/context/AuthContext'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const schema = yup.object({
  email:    yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().required('Password is required'),
}).required()

type FormData = yup.InferType<typeof schema>

const SLIDES = [
  { img: LoginImage1, caption: 'Permanence' },
  { img: LoginImage2, caption: 'Precision'  },
  { img: LoginImage3, caption: 'Artistry'   },
  { img: LoginImage4, caption: 'Legacy'     },
]

export default function Login() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: yupResolver(schema),
  })
  const { setUser } = useAuth()
  const navigate    = useNavigate()
  const [apiError,      setApiError]      = useState<string | null>(null)
  const [showPassword,  setShowPassword]  = useState(false)
  const [currentSlide,  setCurrentSlide]  = useState(0)

  useEffect(() => {
    const t = setInterval(() => setCurrentSlide(p => (p + 1) % SLIDES.length), 5000)
    return () => clearInterval(t)
  }, [])

  const onSubmit = async (data: FormData) => {
    setApiError(null)
    const res = await authService.login(data)
    if (!res.ok) { setApiError(res.error.message); return }
    setUser(res.data)
    if (res.data.type === 'cashier') navigate('/cashier/pos')
    else if (res.data.type === 'worker') navigate('/admin')
    else navigate('/')
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex overflow-hidden selection:bg-[#ff5a66]/20">

      {/* ── LEFT: rotating gallery ── */}
      <div className="relative hidden lg:flex lg:w-[58%] bg-black overflow-hidden flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <img
              src={SLIDES[currentSlide].img}
              alt="Obsidian Studio"
              className="h-full w-full object-cover"
            />
            {/* gradient layers */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/50" />
          </motion.div>
        </AnimatePresence>

        {/* bottom content */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-12">
          {/* slide word */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <h1
                className="text-[88px] font-light uppercase italic leading-none tracking-tight"
                style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}
              >
                <span className="block text-[#ff5a66] drop-shadow-[0_0_60px_rgba(255,90,102,0.4)]">
                  {SLIDES[currentSlide].caption}
                </span>
              </h1>
            </motion.div>
          </AnimatePresence>

          {/* divider + tagline */}
          <div className="mt-8 h-px w-24 bg-white/15" />
          <p className="mt-6 text-[10px] uppercase tracking-[0.4em] leading-relaxed text-white/35 max-w-[320px]">
            The digital sanctuary for<br />high-end somatic art.
          </p>

          {/* slide indicators */}
          <div className="mt-10 flex items-center gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className="relative h-0.5 overflow-hidden rounded-full transition-all duration-500"
                style={{ width: i === currentSlide ? '32px' : '16px' }}
              >
                <span className="absolute inset-0 bg-white/20 rounded-full" />
                {i === currentSlide && (
                  <motion.span
                    className="absolute inset-y-0 left-0 bg-[#ff5a66] rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 5, ease: 'linear' }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT: form panel ── */}
      <div className="relative w-full lg:w-[42%] bg-[#111111] flex flex-col">
        {/* top corner */}
        <div className="absolute top-6 right-6 text-[9px] font-mono tracking-[0.2em] uppercase text-white/10 select-none">
          v2026
        </div>

        <div className="flex-1 flex flex-col justify-center px-10 lg:px-16 py-16 max-w-[480px] mx-auto w-full">

          {/* back to home */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.25em] text-white/30 hover:text-[#ff5a66] mb-10 transition-colors w-fit"
          >
            <Icon name="lucide:arrow-left" size={11} />
            Back to home
          </Link>

          {/* header */}
          <div className="mb-12">
            
            <h2
              className="text-[44px] font-light tracking-tight text-white/95 leading-tight"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              Welcome back.
            </h2>
            <p className="mt-2 text-[12px] text-white/35 tracking-wide font-light leading-relaxed">
              Enter your credentials to access the studio.
            </p>
          </div>

          {/* form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

            {/* email */}
            <div className="group relative">
              <label className="mb-2.5 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.35em] text-white/30 group-focus-within:text-[#ff5a66] transition-colors">
                <Icon name="lucide:mail" size={10} />
                Email address
              </label>
              <input
                {...register('email')}
                type="email"
                autoComplete="email"
                className="w-full bg-white/[0.03] border border-white/10 rounded-sm px-4 py-3.5 text-[13px] font-light tracking-wide text-white/90 outline-none transition-all focus:border-[#ff5a66] focus:bg-white/[0.05] placeholder:text-white/15"
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-1.5 text-[9px] uppercase tracking-wider text-[#ff5a66]/80">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* password */}
            <div className="group relative">
              <div className="mb-2.5 flex items-center justify-between">
                <label className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.35em] text-white/30 group-focus-within:text-[#ff5a66] transition-colors">
                  <Icon name="lucide:key-round" size={10} />
                  Secret key
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[9px] uppercase tracking-[0.25em] text-[#ff5a66]/50 hover:text-[#ff5a66] transition-colors"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-sm px-4 py-3.5 pr-12 text-[13px] tracking-[0.25em] text-white/90 outline-none transition-all focus:border-[#ff5a66] focus:bg-white/[0.05] placeholder:text-white/15 placeholder:tracking-normal"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors"
                >
                  <Icon name={showPassword ? 'lucide:eye-off' : 'lucide:eye'} size={15} />
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-[9px] uppercase tracking-wider text-[#ff5a66]/80">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* API error */}
            {apiError && (
              <div className="flex items-center gap-3 px-4 py-3 border border-[#ff5a66]/20 bg-[#ff5a66]/5 rounded-sm">
                <Icon name="lucide:alert-circle" size={14} className="text-[#ff5a66] shrink-0" />
                <p className="text-[10px] uppercase tracking-wider text-[#ff5a66]">{apiError}</p>
              </div>
            )}

            {/* actions */}
            <div className="pt-2 space-y-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative flex h-[52px] w-full items-center justify-center bg-[#ff5a66] text-[10px] font-bold uppercase tracking-[0.35em] text-black transition-all hover:bg-[#ff6b76] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed rounded-sm overflow-hidden"
              >
                {/* hover shimmer */}
                <span className="absolute inset-0 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
                {isSubmitting ? (
                  <span className="flex items-center gap-2.5">
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                    Authenticating…
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Access vault
                    <Icon name="lucide:arrow-right" size={13} />
                  </span>
                )}
              </button>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-white/8" />
                <span className="text-[9px] uppercase tracking-[0.3em] text-white/20">or</span>
                <div className="flex-1 h-px bg-white/8" />
              </div>

              <Link
                to="/register"
                className="group flex h-[52px] w-full items-center justify-center border border-white/10 bg-transparent text-[9px] font-bold uppercase tracking-[0.35em] text-white/35 transition-all hover:border-[#ff5a66]/30 hover:text-[#ff5a66]/70 hover:bg-[#ff5a66]/5 rounded-sm"
              >
                <Icon name="lucide:user-plus" size={12} className="mr-2 opacity-60 group-hover:opacity-100 transition-opacity" />
                Apply for membership
              </Link>
            </div>
          </form>
        </div>

        {/* bottom bar */}
        <div className="shrink-0 px-10 lg:px-16 py-6 border-t border-white/6 flex items-center justify-between">
          <span className="text-[9px] uppercase tracking-[0.3em] text-white/12">© 2026 Obsidian Archive</span>
          <div className="flex gap-1.5">
            {[0,1,2].map(i => (
              <div key={i} className={`h-0.5 rounded-full transition-all ${i === 1 ? 'w-6 bg-[#ff5a66]/60' : 'w-3 bg-white/12'}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
