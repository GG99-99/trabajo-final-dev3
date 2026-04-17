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
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().required('Password is required'),
}).required()

type FormData = yup.InferType<typeof schema>

export default function Login() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: yupResolver(schema)
  })
  const { setUser } = useAuth()
  const navigate = useNavigate()
  const [apiError, setApiError] = useState<string | null>(null)
  const images = [LoginImage1, LoginImage2, LoginImage3, LoginImage4];
  const [currentImage, setCurrentImage] = useState(0);

  const onSubmit = async (data: FormData) => {
    setApiError(null)
    const res = await authService.login(data)
    if (!res.ok) {
      setApiError(res.error.message)
      return
    }
    setUser(res.data)
    // redirect based on role
    if (res.data.type === 'cashier') navigate('/cashier/pos')
    else if (res.data.type === 'worker') navigate('/admin')
    else navigate('/') // client → home
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-0 selection:bg-[#ff5a66]/20">
      <div className="relative flex w-full h-screen overflow-hidden">

        {/* LEFT PANEL */}
        <div className="relative hidden lg:block lg:w-[60%] bg-black overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImage}
              src={images[currentImage]}
              alt="Obsidian Studio"
              className="absolute inset-0 h-full w-full object-cover"
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            />
          </AnimatePresence>

          <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/30 to-black/90" />
          <div className="absolute inset-0 bg-linear-to-r from-black/20 via-transparent to-black/60" />

          <div className="absolute bottom-12 left-12 z-10">
            <h1
              className="text-[90px] font-light uppercase italic leading-[0.88] tracking-tight"
              style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
            >
              <span className="block text-[#ff5a66] drop-shadow-[0_0_40px_rgba(255,90,102,0.5)]">
                Obsidian
              </span>
            </h1>

            <div className="mt-8 h-px w-20 bg-white/20" />

            <p className="mt-6 text-[10px] uppercase tracking-[0.4em] leading-relaxed text-white/40 max-w-[340px]">
              Permanence. Precision. The digital
              <br />
              sanctuary for high-end somatic art.
            </p>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="relative w-full lg:w-[40%] bg-[#1a1a1a] flex flex-col justify-between px-8 py-12 lg:px-16">
          <div className="absolute top-6 right-6 text-[9px] font-mono tracking-[0.2em] uppercase text-white/10">
            © 2026 Obsidian
          </div>

          <div className="flex-1 flex flex-col justify-center max-w-md">
            <div className="mb-12">
              <h2
                className="text-[42px] font-light tracking-tight text-white/95 leading-tight"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Welcome back.
              </h2>
              <p className="mt-2 text-[13px] text-white/40 tracking-wide font-light">
                Enter your credentials to access the studio.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
              <div className="group relative">
                <label className="mb-3 block text-[9px] font-semibold uppercase tracking-[0.35em] text-white/30 transition-colors group-focus-within:text-[#ff5a66]">
                  Email Address
                </label>
                <input
                  {...register('email')}
                  type="email"
                  autoComplete="email"
                  className="w-full border-b border-white/15 bg-transparent pb-3 text-[14px] font-light tracking-wide text-white/90 outline-none transition-all focus:border-[#ff5a66] placeholder:text-white/15"
                  placeholder=""
                />
                {errors.email && (
                  <p className="absolute -bottom-5 text-[9px] uppercase tracking-wider text-[#ff5a66]/90">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="group relative">
                <div className="mb-3 flex items-center justify-between">
                  <label className="block text-[9px] font-semibold uppercase tracking-[0.35em] text-white/30 transition-colors group-focus-within:text-[#ff5a66]">
                    Secret Key
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-[9px] uppercase tracking-[0.25em] text-[#ff5a66]/60 hover:text-[#ff5a66] transition-colors"
                  >
                    Forgot?
                  </Link>
                </div>
                <input
                  {...register('password')}
                  type="password"
                  autoComplete="current-password"
                  className="w-full border-b border-white/15 bg-transparent pb-3 text-[14px] tracking-[0.3em] text-white/90 outline-none transition-all focus:border-[#ff5a66] placeholder:text-white/15"
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="absolute -bottom-5 text-[9px] uppercase tracking-wider text-[#ff5a66]/90">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* API error */}
              {apiError && (
                <p className="text-[10px] uppercase tracking-wider text-[#ff5a66] border border-[#ff5a66]/20 bg-[#ff5a66]/5 px-4 py-3">
                  {apiError}
                </p>
              )}

              <div className="pt-6 space-y-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="relative flex h-[56px] w-full items-center justify-center bg-[#ff5a66] text-[10px] font-bold uppercase tracking-[0.35em] text-black transition-all hover:bg-[#ff7078] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed rounded-sm"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="h-3 w-3 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                      Authenticating...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Access Vault <Icon name="lucide:arrow-right" size={14} />
                    </span>
                  )}
                </button>

                <p className="text-center text-[9px] uppercase tracking-[0.3em] text-white/25 py-2">
                  Unregistered?
                </p>

                <Link
                  to="/register"
                  className="flex h-[56px] w-full items-center justify-center border border-white/10 bg-transparent text-[9px] font-bold uppercase tracking-[0.35em] text-white/40 transition-all hover:border-white/25 hover:text-white/70 hover:bg-white/3 rounded-sm"
                >
                  Apply for Membership
                </Link>
              </div>
            </form>
          </div>

          <div className="flex items-center justify-between pt-8 border-t border-white/8">
            <span className="text-[9px] uppercase tracking-[0.3em] text-white/15">© 2026 Obsidian</span>
            <div className="flex gap-2">
              <div className="h-1 w-6 rounded-full bg-white/10" />
              <div className="h-1 w-6 rounded-full bg-[#ff5a66]" />
              <div className="h-1 w-6 rounded-full bg-white/10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
