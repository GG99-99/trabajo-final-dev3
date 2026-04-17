import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Button } from '@/componentes/ui/button'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import heroImg from '@/assets/hero.png'
import { authService } from '@/lib/auth.service'
import { useState } from 'react'

const schema = yup.object({
  first_name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
}).required()

type FormData = yup.InferType<typeof schema>

export default function Register() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: yupResolver(schema)
  })
  const navigate = useNavigate()
  const [apiError, setApiError] = useState<string | null>(null)

  const onSubmit = async ({ confirmPassword: _, ...data }: FormData) => {
    setApiError(null)
    const res = await authService.register({ ...data, type: 'client' })
    if (!res.ok) {
      setApiError(res.error.message)
      return
    }
    navigate('/login')
  }

  const fieldClass = "w-full border-b border-white/15 bg-transparent pb-3 text-[14px] font-light tracking-wide text-white/90 outline-none transition-all focus:border-[#ff5a66] placeholder:text-white/15"
  const labelClass = "mb-3 block text-[9px] font-semibold uppercase tracking-[0.35em] text-white/30 transition-colors group-focus-within:text-[#ff5a66]"

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-0 selection:bg-[#ff5a66]/20">
      <div className="relative flex w-full h-screen overflow-hidden">

        {/* LEFT PANEL */}
        <div className="relative hidden lg:block lg:w-[55%] bg-black overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImg})`, filter: 'grayscale(30%) brightness(0.7)' }}
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/30 to-black/90" />
          <div className="absolute inset-0 bg-linear-to-r from-black/20 via-transparent to-black/60" />
          <div className="absolute bottom-12 left-12 z-10">
            <h1
              className="text-[90px] font-light uppercase italic leading-[0.88] tracking-tight"
              style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}
            >
              <span className="block text-[#ff5a66] drop-shadow-[0_0_40px_rgba(255,90,102,0.5)]">Obsidian</span>
              <span className="block text-[#ff5a66] drop-shadow-[0_0_40px_rgba(255,90,102,0.5)]">Archive</span>
            </h1>
            <div className="mt-8 h-px w-20 bg-white/20" />
            <p className="mt-6 text-[10px] uppercase tracking-[0.4em] leading-relaxed text-white/40 max-w-[340px]">
              Join our exclusive community of<br />somatic art enthusiasts.
            </p>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="relative w-full lg:w-[45%] bg-[#1a1a1a] flex flex-col justify-between px-8 py-12 lg:px-16 overflow-y-auto">
          <div className="absolute top-6 right-6 text-[9px] font-mono tracking-[0.2em] uppercase text-white/10">
            © 2026 Obsidian
          </div>

          <div className="flex-1 flex flex-col justify-center max-w-md">
            <Link to="/login" className="inline-flex items-center text-[10px] uppercase tracking-[0.25em] text-white/40 hover:text-[#ff5a66] mb-8 transition-colors">
              <ArrowLeft className="w-3 h-3 mr-2" />
              Back to login
            </Link>

            <div className="mb-10">
              <h2
                className="text-[42px] font-light tracking-tight text-white/95 leading-tight"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Join the Archive.
              </h2>
              <p className="mt-2 text-[13px] text-white/40 tracking-wide font-light">
                Create your account to access exclusive services.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="group relative">
                  <label className={labelClass}>First Name</label>
                  <input {...register('first_name')} className={fieldClass} placeholder="John" />
                  {errors.first_name && <p className="absolute -bottom-5 text-[9px] uppercase tracking-wider text-[#ff5a66]/90">{errors.first_name.message}</p>}
                </div>
                <div className="group relative">
                  <label className={labelClass}>Last Name</label>
                  <input {...register('last_name')} className={fieldClass} placeholder="Doe" />
                  {errors.last_name && <p className="absolute -bottom-5 text-[9px] uppercase tracking-wider text-[#ff5a66]/90">{errors.last_name.message}</p>}
                </div>
              </div>

              <div className="group relative">
                <label className={labelClass}>Email Address</label>
                <input {...register('email')} type="email" autoComplete="email" className={fieldClass} placeholder="name@example.com" />
                {errors.email && <p className="absolute -bottom-5 text-[9px] uppercase tracking-wider text-[#ff5a66]/90">{errors.email.message}</p>}
              </div>

              <div className="group relative">
                <label className={labelClass}>Secret Key</label>
                <input {...register('password')} type="password" className={`${fieldClass} tracking-[0.3em]`} placeholder="••••••••" />
                {errors.password && <p className="absolute -bottom-5 text-[9px] uppercase tracking-wider text-[#ff5a66]/90">{errors.password.message}</p>}
              </div>

              <div className="group relative">
                <label className={labelClass}>Confirm Key</label>
                <input {...register('confirmPassword')} type="password" className={`${fieldClass} tracking-[0.3em]`} placeholder="••••••••" />
                {errors.confirmPassword && <p className="absolute -bottom-5 text-[9px] uppercase tracking-wider text-[#ff5a66]/90">{errors.confirmPassword.message}</p>}
              </div>

              {apiError && (
                <p className="text-[10px] uppercase tracking-wider text-[#ff5a66] border border-[#ff5a66]/20 bg-[#ff5a66]/5 px-4 py-3">
                  {apiError}
                </p>
              )}

              <div className="pt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-[56px] bg-[#ff5a66] hover:bg-[#ff7078] text-[10px] font-bold uppercase tracking-[0.35em] text-black rounded-sm"
                >
                  {isSubmitting ? 'Creating Account...' : 'Create Account'}
                </Button>
              </div>
            </form>
          </div>

          <div className="flex items-center justify-between pt-8 border-t border-white/8 mt-8">
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
