import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '@/lib/auth.service'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Icon from '@/componentes/Icon'
import heroImg from '@/assets/RegisterImage.jpg'
import Scrollable from '@/componentes/Scrollable'

// ── validation ────────────────────────────────────────────────────────────
const schema = yup.object({
  first_name:      yup.string().required('Required'),
  last_name:       yup.string().required('Required'),
  email:           yup.string().email('Invalid email').required('Required'),
  password:        yup.string().min(8, 'Min 8 characters').required('Required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords do not match')
    .required('Required'),
  type:            yup.mixed<'worker' | 'cashier'>().oneOf(['worker', 'cashier']).required('Select a role'),
  token:           yup.string().required('Registration token is required'),
  specialty:       yup.mixed<'realism' | 'cartoon' | 'other'>()
    .when('type', {
      is: 'worker',
      then: s => s.oneOf(['realism', 'cartoon', 'other']).required('Select a specialty'),
      otherwise: s => s.optional(),
    }),
}).required()

type FormData = yup.InferType<typeof schema>

// ── shared input styles ───────────────────────────────────────────────────
const inputCls = (hasErr?: boolean) =>
  `w-full bg-white/[0.03] border ${hasErr ? 'border-[#ff5a66]/50' : 'border-white/10'} rounded-sm px-4 py-3.5 text-[13px] font-light tracking-wide text-white/90 outline-none transition-all focus:border-[#ff5a66] focus:bg-white/[0.05] placeholder:text-white/15`

const labelCls = 'mb-2 block text-[9px] font-semibold uppercase tracking-[0.35em] text-white/30'

function FieldError({ msg }: { msg?: string }) {
  return msg ? (
    <p className="mt-1 text-[9px] uppercase tracking-wider text-[#ff5a66]/80">{msg}</p>
  ) : null
}

// ── Role card ─────────────────────────────────────────────────────────────
function RoleCard({
  value, label, description, icon, selected, onClick,
}: {
  value: string; label: string; description: string
  icon: string;  selected: boolean; onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex flex-col gap-1.5 p-4 rounded-sm border text-left transition-all ${
        selected
          ? 'bg-[#ff5a66]/8 border-[#ff5a66]/40 text-white/95'
          : 'bg-white/[0.02] border-white/10 text-white/40 hover:border-white/20 hover:text-white/60'
      }`}
    >
      {selected && (
        <span className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-[#ff5a66] flex items-center justify-center">
          <Icon name="lucide:check" size={9} className="text-black" />
        </span>
      )}
      <Icon name={icon} size={18} className={selected ? 'text-[#ff5a66]' : 'text-white/30'} />
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em]">{label}</p>
      <p className="text-[10px] text-white/30 leading-relaxed">{description}</p>
    </button>
  )
}

// ── Steps ─────────────────────────────────────────────────────────────────
const STEP_LABELS = ['Identity', 'Role', 'Access']

function StepIndicator({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-2 mb-10">
      {STEP_LABELS.map((label, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className={`flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold transition-all ${
            i < step  ? 'bg-[#ff5a66] text-black' :
            i === step ? 'bg-[#ff5a66]/15 border border-[#ff5a66]/40 text-[#ff5a66]' :
                          'bg-white/5 border border-white/10 text-white/20'
          }`}>
            {i < step ? <Icon name="lucide:check" size={10} /> : i + 1}
          </div>
          <span className={`text-[9px] uppercase tracking-[0.2em] transition-colors ${
            i === step ? 'text-white/60' : 'text-white/20'
          }`}>{label}</span>
          {i < STEP_LABELS.length - 1 && (
            <div className={`w-8 h-px transition-colors ${i < step ? 'bg-[#ff5a66]/40' : 'bg-white/10'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────
export default function Register() {
  const navigate = useNavigate()
  const [step, setStep]            = useState(0)
  const [apiError, setApiError]     = useState<string | null>(null)
  const [showPass,  setShowPass]    = useState(false)
  const [showConf,  setShowConf]    = useState(false)
  const [showToken, setShowToken]   = useState(false)
  const [registered, setRegistered] = useState(false)
  const [checkingEmail, setCheckingEmail] = useState(false)

  const {
    register, handleSubmit, control, watch, trigger,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: { type: 'worker', specialty: 'other' },
  })

  const watchedType = watch('type')

  // Step validation before advancing
  const goNext = async () => {
    const fields: (keyof FormData)[][] = [
      ['first_name', 'last_name', 'email', 'password', 'confirmPassword'],
      ['type', 'specialty'],
    ]
    const valid = await trigger(fields[step])
    if (!valid) return

    // Step 0: check email not already registered before proceeding
    if (step === 0) {
      setCheckingEmail(true)
      setApiError(null)
      try {
        const email = watch('email')
        const res = await authService.checkEmailAvailable(email)
        if (!res.ok) {
          setApiError(res.error?.message ?? 'Este correo ya está registrado.')
          setCheckingEmail(false)
          return
        }
      } catch {
        // if endpoint doesn't exist, proceed (fallback)
      } finally {
        setCheckingEmail(false)
      }
    }

    setApiError(null)
    setStep(s => s + 1)
  }

  const onSubmit = async (data: FormData) => {
    setApiError(null)
    const { confirmPassword: _, ...payload } = data
    const res = await authService.register({
      ...payload,
      type: data.type as 'worker' | 'cashier',
    })
    if (!res.ok) {
      setApiError(res.error?.message ?? 'Registration failed')
      return
    }
    setRegistered(true)
  }

  const stepContent = [
    // ── Step 0: Identity ──────────────────────────────────────────────────
    <div key="step0" className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>First name</label>
          <input {...register('first_name')} className={inputCls(!!errors.first_name)} placeholder="John" />
          <FieldError msg={errors.first_name?.message} />
        </div>
        <div>
          <label className={labelCls}>Last name</label>
          <input {...register('last_name')} className={inputCls(!!errors.last_name)} placeholder="Doe" />
          <FieldError msg={errors.last_name?.message} />
        </div>
      </div>

      <div>
        <label className={labelCls}>Email address</label>
        <input {...register('email')} type="email" className={inputCls(!!errors.email)} placeholder="you@example.com" />
        <FieldError msg={errors.email?.message} />
      </div>

      <div>
        <label className={labelCls}>Password</label>
        <div className="relative">
          <input
            {...register('password')}
            type={showPass ? 'text' : 'password'}
            className={inputCls(!!errors.password) + ' pr-11'}
            placeholder="Min 8 characters"
          />
          <button type="button" onClick={() => setShowPass(p => !p)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors">
            <Icon name={showPass ? 'lucide:eye-off' : 'lucide:eye'} size={15} />
          </button>
        </div>
        <FieldError msg={errors.password?.message} />
      </div>

      <div>
        <label className={labelCls}>Confirm password</label>
        <div className="relative">
          <input
            {...register('confirmPassword')}
            type={showConf ? 'text' : 'password'}
            className={inputCls(!!errors.confirmPassword) + ' pr-11'}
            placeholder="Repeat password"
          />
          <button type="button" onClick={() => setShowConf(p => !p)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors">
            <Icon name={showConf ? 'lucide:eye-off' : 'lucide:eye'} size={15} />
          </button>
        </div>
        <FieldError msg={errors.confirmPassword?.message} />
      </div>
    </div>,

    // ── Step 1: Role ──────────────────────────────────────────────────────
    <div key="step1" className="space-y-6">
      <div>
        <label className={labelCls}>Select your role</label>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-2 gap-3">
              <RoleCard
                value="worker" label="Artist" icon="lucide:palette"
                description="Tattoo artist with specialty assignment."
                selected={field.value === 'worker'}
                onClick={() => field.onChange('worker')}
              />
              <RoleCard
                value="cashier" label="Cashier" icon="lucide:receipt"
                description="Point of sale and payment processing."
                selected={field.value === 'cashier'}
                onClick={() => field.onChange('cashier')}
              />
            </div>
          )}
        />
        <FieldError msg={errors.type?.message} />
      </div>

      <AnimatePresence>
        {watchedType === 'worker' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
          >
            <label className={labelCls}>Specialty</label>
            <Controller
              name="specialty"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { value: 'realism', label: 'Realism',  icon: 'lucide:scan-face'  },
                    { value: 'cartoon', label: 'Cartoon',  icon: 'lucide:sparkles'   },
                    { value: 'other',   label: 'Other',    icon: 'lucide:brush'      },
                  ] as const).map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => field.onChange(opt.value)}
                      className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-sm border text-center transition-all ${
                        field.value === opt.value
                          ? 'bg-[#ff5a66]/8 border-[#ff5a66]/40 text-[#ff5a66]'
                          : 'bg-white/[0.02] border-white/10 text-white/35 hover:border-white/20'
                      }`}
                    >
                      <Icon name={opt.icon} size={16} />
                      <span className="text-[9px] uppercase tracking-[0.2em]">{opt.label}</span>
                    </button>
                  ))}
                </div>
              )}
            />
            <FieldError msg={errors.specialty?.message} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>,

    // ── Step 2: Token ─────────────────────────────────────────────────────
    <div key="step2" className="space-y-6">
      <div className="flex items-start gap-3 p-4 bg-yellow-400/5 border border-yellow-400/15 rounded-sm">
        <Icon name="lucide:key" size={14} className="text-yellow-400 mt-0.5 shrink-0" />
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-yellow-400/80 mb-1">Registration token required</p>
          <p className="text-[11px] text-white/35 leading-relaxed">
            Ask an admin to generate a token from the Settings panel and share it with you.
            Tokens expire after 10 minutes.
          </p>
        </div>
      </div>

      <div>
        <label className={labelCls}>Registration token</label>
        <div className="relative">
          <input
            {...register('token')}
            type={showToken ? 'text' : 'password'}
            className={inputCls(!!errors.token) + ' pr-11 font-mono tracking-wider'}
            placeholder="Paste token here"
          />
          <button type="button" onClick={() => setShowToken(p => !p)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors">
            <Icon name={showToken ? 'lucide:eye-off' : 'lucide:eye'} size={15} />
          </button>
        </div>
        <FieldError msg={errors.token?.message} />
      </div>

      {/* summary */}
      <div className="p-4 bg-white/[0.03] border border-white/8 rounded-sm space-y-2">
        <p className="text-[9px] uppercase tracking-[0.3em] text-white/25 mb-3">Registration summary</p>
        {([
          { label: 'Role',  value: watch('type') === 'worker' ? 'Artist' : 'Cashier' },
          { label: 'Email', value: watch('email') || '—' },
          { label: 'Name',  value: `${watch('first_name') || ''} ${watch('last_name') || ''}`.trim() || '—' },
          ...(watchedType === 'worker' ? [{ label: 'Specialty', value: watch('specialty') || '—' }] : []),
        ]).map(row => (
          <div key={row.label} className="flex justify-between items-center py-1 border-b border-white/5 last:border-0">
            <span className="text-[10px] text-white/30 uppercase tracking-[0.15em]">{row.label}</span>
            <span className="text-[11px] text-white/70 capitalize font-medium">{row.value}</span>
          </div>
        ))}
      </div>

      {apiError && (
        <div className="flex items-center gap-3 px-4 py-3 border border-[#ff5a66]/20 bg-[#ff5a66]/5 rounded-sm">
          <Icon name="lucide:alert-circle" size={13} className="text-[#ff5a66] shrink-0" />
          <p className="text-[10px] uppercase tracking-wider text-[#ff5a66]">{apiError}</p>
        </div>
      )}
    </div>,
  ]

  return (
    <div className="min-h-screen h-screen bg-[#0a0a0a] flex overflow-hidden selection:bg-[#ff5a66]/20">

      {/* ── LEFT panel ── */}
      <div className="relative hidden lg:block lg:w-[45%] bg-black overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImg})`, filter: 'grayscale(20%) brightness(0.55)' }}
        />
        {/* layered gradients */}
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-black/50" />
        <div className="absolute inset-0 bg-linear-to-r from-transparent to-black/55" />

        {/* top badge */}
        <div className="absolute top-10 left-10 z-10">
          <span className="text-[9px] uppercase tracking-[0.4em] text-white/30 border border-white/10 px-3 py-1.5 rounded-full">
            Obsidian Archive
          </span>
        </div>

        {/* center decorative line */}
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="w-px h-[40%] bg-linear-to-b from-transparent via-[#ff5a66]/20 to-transparent" />
        </div>

        {/* bottom content */}
        <div className="absolute bottom-12 left-10 right-10 z-10">
          <h1
            className="text-[72px] font-light uppercase italic leading-none tracking-tight"
            style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}
          >
            <span className="block text-white/90">Join the</span>
            <span className="block text-[#ff5a66] drop-shadow-[0_0_50px_rgba(255,90,102,0.45)]">Archive.</span>
          </h1>

          <div className="mt-8 h-px w-16 bg-[#ff5a66]/40" />

          <p className="mt-6 text-[10px] uppercase tracking-[0.4em] leading-relaxed text-white/35 max-w-[280px]">
            Join our exclusive community<br />of somatic art professionals.
          </p>

          {/* feature list */}
          <div className="mt-8 space-y-3">
            {[
              'Access the studio management system',
              'Manage appointments & schedules',
              'Process payments & billing',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-1 h-1 rounded-full bg-[#ff5a66]/60 shrink-0" />
                <span className="text-[10px] text-white/30 tracking-wide">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT panel ── */}
      <div className="relative w-full lg:w-[55%] bg-[#111111] flex flex-col lg:h-screen">
        <div className="absolute top-6 right-6 text-[9px] font-mono tracking-[0.2em] uppercase text-white/10 select-none z-10">
          v2026
        </div>

        <Scrollable className="flex-1" style={{ height: '100%' }}>
          <div className="flex flex-col justify-center px-10 lg:px-16 py-16 max-w-[520px] mx-auto w-full min-h-full">

          {/* back link */}
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.25em] text-white/30 hover:text-[#ff5a66] mb-10 transition-colors w-fit"
          >
            <Icon name="lucide:arrow-left" size={11} />
            Back to login
          </Link>

          {/* header */}
          <div className="mb-10">
            <h2
              className="text-[40px] font-light tracking-tight text-white/95 leading-tight"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              {step === 0 ? 'Join the Archive.' : step === 1 ? 'Your role.' : 'Final step.'}
            </h2>
            <p className="mt-2 text-[12px] text-white/35 tracking-wide font-light">
              {step === 0 && 'Create your identity in the studio.'}
              {step === 1 && 'Select how you operate in the studio.'}
              {step === 2 && 'Enter your admin-issued registration token.'}
            </p>
          </div>

          {/* ── Success screen ── */}
          {registered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-6 py-8 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                <Icon name="lucide:check" size={28} className="text-emerald-400" />
              </div>
              <div>
                <h3
                  className="text-[28px] font-light text-white/90 leading-tight"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  Registration complete.
                </h3>
                <p className="mt-2 text-[12px] text-white/35 tracking-wide font-light">
                  Your account has been created successfully.
                </p>
              </div>
              <Link
                to="/login"
                className="mt-2 inline-flex items-center gap-2 h-[52px] px-10 bg-[#ff5a66] hover:bg-[#ff6b76] text-[10px] font-bold uppercase tracking-[0.35em] text-black rounded-sm transition-all"
              >
                <Icon name="lucide:log-in" size={13} />
                Go to login
              </Link>
            </motion.div>
          )}

          {/* steps */}
          {!registered && <StepIndicator step={step} />}

          {/* animated step content */}
          {!registered && (
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  {stepContent[step]}
                </motion.div>
              </AnimatePresence>

              {/* navigation */}
              <div className="mt-8 flex items-center gap-3">
                {step > 0 && (
                  <button
                    type="button"
                    onClick={() => { setApiError(null); setStep(s => s - 1) }}
                    className="h-[52px] px-6 border border-white/10 text-[9px] font-bold uppercase tracking-[0.3em] text-white/35 hover:border-white/20 hover:text-white/60 rounded-sm transition-all"
                  >
                    Back
                  </button>
                )}

                {step < 2 ? (
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={checkingEmail}
                    className="flex-1 h-[52px] bg-[#ff5a66] hover:bg-[#ff6b76] text-[10px] font-bold uppercase tracking-[0.35em] text-black rounded-sm transition-all flex items-center justify-center gap-2 group overflow-hidden relative disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <span className="absolute inset-0 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
                    {checkingEmail ? (
                      <><span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-black/30 border-t-black" /> Checking…</>
                    ) : (
                      <>Continue <Icon name="lucide:arrow-right" size={13} /></>
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                    className="flex-1 h-[52px] bg-[#ff5a66] hover:bg-[#ff6b76] text-[10px] font-bold uppercase tracking-[0.35em] text-black rounded-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                        Creating account…
                      </>
                    ) : (
                      <>
                        <Icon name="lucide:user-check" size={14} />
                        Create account
                      </>
                    )}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
        </Scrollable>

        {/* bottom */}
        <div className="shrink-0 px-10 lg:px-16 py-6 border-t border-white/6 flex items-center justify-between">
          <span className="text-[9px] uppercase tracking-[0.3em] text-white/12">© 2026 Obsidian Archive</span>
          <div className="flex gap-1.5">
            {[0,1,2].map(i => (
              <div key={i} className={`h-0.5 rounded-full ${i === 1 ? 'w-6 bg-[#ff5a66]/60' : 'w-3 bg-white/12'}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
