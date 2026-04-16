import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Button } from '@/componentes/ui/button'
import { Input } from '@/componentes/ui/input'
import { Label } from '@/componentes/ui/label'
import { Link } from 'react-router-dom'
import { ArrowLeft, Mail } from 'lucide-react'
import heroImg from '@/assets/hero.png'

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
}).required()

type FormData = yup.InferType<typeof schema>

export default function ForgotPassword() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: yupResolver(schema)
  })

  const onSubmit = async (data: FormData) => {
    await new Promise(resolve => setTimeout(resolve, 1500))
    console.log('Reset password for:', data)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-0 selection:bg-[#ff5a66]/20">
      
      <div className="relative flex w-full h-screen overflow-hidden">

        {/* LEFT PANEL: Image + Branding */}
        <div className="relative hidden lg:block lg:w-[55%] bg-black overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${heroImg})`,
              filter: 'grayscale(30%) brightness(0.7)'
            }}
          />
          
          <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/30 to-black/90" />
          <div className="absolute inset-0 bg-linear-to-r from-black/20 via-transparent to-black/60" />

          <div className="absolute bottom-12 left-12 z-10">
            <h1 
              className="text-[90px] font-light uppercase italic leading-[0.88] tracking-tight"
              style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}
            >
              <span className="block text-[#ff5a66] drop-shadow-[0_0_40px_rgba(255,90,102,0.5)]">
                Obsidian
              </span>
              <span className="block text-[#ff5a66] drop-shadow-[0_0_40px_rgba(255,90,102,0.5)]">
                Archive
              </span>
            </h1>
            
            <div className="mt-8 h-px w-20 bg-white/20" />
            
            <p className="mt-6 text-[10px] uppercase tracking-[0.4em] leading-relaxed text-white/40 max-w-[340px]">
              Secure access recovery for<br />
              registered members.
            </p>
          </div>
        </div>

        {/* RIGHT PANEL: Form */}
        <div className="relative w-full lg:w-[45%] bg-[#1a1a1a] flex flex-col justify-between px-8 py-12 lg:px-16">
          
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
                Reset Access.
              </h2>
              <p className="mt-2 text-[13px] text-white/40 tracking-wide font-light">
                Enter your email to receive a secure reset link.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
              
              <div className="group relative">
                <Label htmlFor="email" className="mb-3 block text-[9px] font-semibold uppercase tracking-[0.35em] text-white/30 transition-colors group-focus-within:text-[#ff5a66]">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-0 bottom-3 h-4 w-4 text-white/30" />
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    className="w-full border-b border-t-0 border-x-0 border-white/15 bg-transparent rounded-none pb-3 pl-7 text-[14px] font-light tracking-wide text-white/90 outline-none transition-all focus-visible:ring-0 focus-visible:border-[#ff5a66] placeholder:text-white/15"
                    placeholder="name@example.com"
                  />
                </div>
                {errors.email && <p className="absolute -bottom-5 text-[9px] uppercase tracking-wider text-[#ff5a66]/90">{errors.email.message}</p>}
              </div>

              <div className="pt-6 space-y-4">
                <Button type="submit" className="w-full h-[56px] bg-[#ff5a66] hover:bg-[#ff7078] text-[10px] font-bold uppercase tracking-[0.35em] text-black rounded-sm" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending Link...' : 'Send Reset Link'}
                </Button>

                <p className="text-center text-[10px] text-white/30 tracking-wide">
                  Remember your credentials?{' '}
                  <Link to="/login" className="text-[#ff5a66] hover:text-[#ff7078] transition-colors">
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </div>

          <div className="flex items-center justify-between pt-8 border-t border-white/8">
            <span className="text-[9px] uppercase tracking-[0.3em] text-white/15">
              © 2026 Obsidian
            </span>
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
