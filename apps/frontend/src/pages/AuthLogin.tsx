import Icon from '@/componentes/Icon'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

const schema = yup.object({
  email: yup.string().email('Invalid vault format').required('Email is required'),
  password: yup.string().min(8, 'Key too short').required('Secret key is required'),
}).required()

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) })

  const onSubmit = async (data) => {
    await new Promise(resolve => setTimeout(resolve, 2000))
    console.log('Vault Access:', data)
  }

  return (
    <div className="min-h-screen bg-[#08090b] flex items-center justify-center p-4 text-white selection:bg-[#ff5a66]/30">
      {/* 1. Fondo Global con Ruido/Grid sutil */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 40V39L0 39V40zm40-40V0L39 0V40H40V0z'/%3E%3C/g%3E%3C/svg%3E")` }} 
      />

      <div className="relative mx-auto flex min-h-[750px] w-full max-w-6xl overflow-hidden rounded-sm border border-white/5 bg-[#0c0d10] shadow-[0_0_100px_rgba(0,0,0,0.8)]">
        
        {/* SECCIÓN IZQUIERDA: HERO ART */}
        <div className="relative hidden w-[60%] overflow-hidden md:block border-r border-white/5">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
            style={{
              backgroundImage: `linear-gradient(to bottom, rgba(8,9,11,0.1), rgba(8,9,11,0.9)), url('/login-art.jpg')`,
            }}
          />
          
          {/* Overlay de Scanline/Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px]" />

          <div className="absolute inset-0 flex flex-col justify-end p-12">
            <h1
              className="max-w-[500px] text-[72px] font-light uppercase italic leading-[0.85] tracking-tighter lg:text-[90px]"
              style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}
            >
              <span className="block text-white/90">Obsidian</span>
              <span className="bg-gradient-to-r from-[#ff5a66] to-[#ff8e97] bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(255,90,102,0.3)]">
                Archive
              </span>
            </h1>
            <div className="mt-8 h-px w-24 bg-[#ff5a66]/50" />
            <p className="mt-8 max-w-[400px] text-[11px] uppercase tracking-[0.4em] leading-relaxed text-white/40">
              Permanence. Precision. <br />
              <span className="text-white/60">The digital sanctuary for high-end somatic art.</span>
            </p>
          </div>
        </div>

        {/* SECCIÓN DERECHA: FORMULARIO */}
        <div className="relative flex w-full flex-col justify-between bg-[#0e0f12] p-8 md:w-[40%] lg:p-16">
          
          {/* Detalles decorativos */}
          <div className="absolute top-0 right-0 p-4 opacity-20 text-[10px] font-mono tracking-widest uppercase">
            v.2.0.26 // secure_access
          </div>

          <div className="mt-12">
            <h2 className="text-[32px] font-light tracking-tight text-white/90" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Welcome back.
            </h2>
            <p className="mt-2 text-[13px] text-white/30 tracking-wide font-light">
              Enter your credentials to access the studio.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-16 space-y-10">
              {/* Campo Email */}
              <div className="group relative">
                <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.3em] text-white/20 transition-colors group-focus-within:text-[#ff5a66]">
                  Registry Email
                </label>
                <input
                  {...register('email')}
                  type="email"
                  className="w-full border-b border-white/10 bg-transparent py-2 text-sm font-light tracking-wider text-white outline-none transition-all focus:border-[#ff5a66] placeholder:text-white/5"
                  placeholder="name@archive.art"
                />
                {errors.email && (
                  <p className="absolute -bottom-5 text-[9px] uppercase tracking-widest text-[#ff5a66]/80 animate-in fade-in slide-in-from-top-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Campo Password */}
              <div className="group relative">
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-[9px] font-bold uppercase tracking-[0.3em] text-white/20 transition-colors group-focus-within:text-[#ff5a66]">
                    Secret Key
                  </label>
                  <button type="button" className="text-[9px] uppercase tracking-widest text-[#ff5a66]/40 hover:text-[#ff5a66] transition-colors">
                    Lost Key?
                  </button>
                </div>
                <input
                  {...register('password')}
                  type="password"
                  className="w-full border-b border-white/10 bg-transparent py-2 text-sm tracking-[0.5em] text-white outline-none transition-all focus:border-[#ff5a66] placeholder:text-white/5"
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="absolute -bottom-5 text-[9px] uppercase tracking-widest text-[#ff5a66]/80">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="pt-4 space-y-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="relative flex h-14 w-full items-center justify-center overflow-hidden bg-[#ff5a66] text-[10px] font-bold uppercase tracking-[0.3em] text-black transition-all hover:bg-[#ff7a84] active:scale-[0.98] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="h-3 w-3 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                      Decrypting...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Access Vault <Icon name="lucide:arrow-right" size={14} />
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  className="h-14 w-full border border-white/5 bg-white/[0.02] text-[9px] font-bold uppercase tracking-[0.3em] text-white/40 transition-all hover:border-white/20 hover:text-white/80 hover:bg-white/[0.04]"
                >
                  Apply for membership
                </button>
              </div>
            </form>
          </div>

          {/* Footer del Formulario */}
          <div className="flex items-center justify-between border-t border-white/5 pt-8">
            <div className="text-[9px] uppercase tracking-[0.3em] text-white/10">
              © 2026 Obsidian Archive
            </div>
            <div className="flex gap-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`h-1 w-4 rounded-full ${i === 2 ? 'bg-[#ff5a66]' : 'bg-white/5'}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}