import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Button } from '@/componentes/ui/button'
import { DollarSign, Lock, User } from 'lucide-react'
import { authService } from '@/lib/auth.service'
import { useAuth } from '@/context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
}).required()

type FormData = yup.InferType<typeof schema>

const fieldClass = "w-full border-b border-white/15 bg-transparent pb-3 pl-7 text-[14px] font-light tracking-wide text-white/90 outline-none transition-all focus:border-[#ff5a66] placeholder:text-white/15"
const labelClass = "mb-3 block text-[9px] font-semibold uppercase tracking-[0.35em] text-white/30 transition-colors group-focus-within:text-[#ff5a66]"

export default function CashierLogin() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: yupResolver(schema)
  })
  const { setUser } = useAuth()
  const navigate = useNavigate()
  const [apiError, setApiError] = useState<string | null>(null)

  const onSubmit = async (data: FormData) => {
    setApiError(null)
    const res = await authService.login(data)
    if (!res.ok) {
      setApiError(res.error.message)
      return
    }
    if (res.data.type !== 'cashier') {
      setApiError('Access restricted to cashier accounts only.')
      return
    }
    setUser(res.data)
    navigate('/cashier/pos')
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 selection:bg-[#ff5a66]/20">
      <div className="w-full max-w-md">
        <div className="bg-[#1a1a1a] border border-white/10 rounded-sm p-10">

          {/* Header */}
          <div className="text-center mb-10">
            <div className="mx-auto w-16 h-16 bg-[#ff5a66] rounded-full flex items-center justify-center mb-6">
              <DollarSign className="w-8 h-8 text-black" />
            </div>
            <h1
              className="text-[36px] font-light tracking-tight text-white/95 leading-tight mb-2"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              Cashier Access
            </h1>
            <p className="text-[12px] text-white/40 tracking-wide font-light">
              Point of Sale System
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="group relative">
              <label className={labelClass}>Email</label>
              <div className="relative">
                <User className="absolute left-0 bottom-3 h-4 w-4 text-white/30" />
                <input {...register('email')} type="email" autoComplete="email" className={fieldClass} placeholder="cashier@obsidian.com" />
              </div>
              {errors.email && <p className="absolute -bottom-5 text-[9px] uppercase tracking-wider text-[#ff5a66]/90">{errors.email.message}</p>}
            </div>

            <div className="group relative">
              <label className={labelClass}>Password</label>
              <div className="relative">
                <Lock className="absolute left-0 bottom-3 h-4 w-4 text-white/30" />
                <input {...register('password')} type="password" autoComplete="current-password" className={`${fieldClass} tracking-[0.3em]`} placeholder="••••••••" />
              </div>
              {errors.password && <p className="absolute -bottom-5 text-[9px] uppercase tracking-wider text-[#ff5a66]/90">{errors.password.message}</p>}
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
                {isSubmitting ? 'Accessing...' : 'Access POS System'}
              </Button>
            </div>
          </form>

          <div className="mt-10 pt-6 border-t border-white/8 flex items-center justify-center">
            <span className="text-[9px] uppercase tracking-[0.3em] text-white/15">
              POS Terminal v2.0
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
