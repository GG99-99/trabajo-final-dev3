import { useState, useEffect } from 'react'
import Scrollable from '@/componentes/Scrollable'
import { Button } from '@/componentes/ui/button'
import {
  Users, Calendar, DollarSign, TrendingUp,
  Settings, LogOut, Menu, Home, UserCircle, ClipboardList, Activity, Clock
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { appointmentService, type AppointmentPublic } from '@/lib/appointment.service'
import { workerService, clientService } from '@/lib/people.service'
import type { WorkerPublic, ClientPublic } from '@final/shared'
import AppointmentsPage from './Appointments'
import PaymentsPage from './Payments'
import SettingsPage from './Settings'
import ClientsPage from './Clients'
import WorkerSchedulePage from './WorkerSchedule'
import AttendanceHistory from './AttendanceHistory'
import OnlineUsers from '@/componentes/OnlineUsers'
import { useOnlineUsers } from '@/hooks/useOnlineUsers'
import logo from '@/assets/LogoObsidianWhite.png'

type NavItem = { icon: React.ElementType; label: string; id: string; adminOnly?: boolean }

const NAV: NavItem[] = [
  { icon: Home,          label: 'Dashboard',    id: 'dashboard' },
  { icon: Calendar,      label: 'Appointments', id: 'appointments' },
  { icon: Users,         label: 'Clients',      id: 'clients' },
  { icon: UserCircle,    label: 'Staff',        id: 'staff' },
  { icon: Clock,         label: 'Attendance',   id: 'attendance' },
  { icon: DollarSign,    label: 'Payments',     id: 'payments' },
  { icon: Activity,      label: 'Activity',     id: 'activity', adminOnly: true },
  { icon: Settings,      label: 'Settings',     id: 'settings' },
]

const statusStyle: Record<string, string> = {
  pending:   'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  completed: 'bg-[#ff5a66]/10 text-[#ff5a66] border-[#ff5a66]/20',
  expired:   'bg-white/5 text-white/30 border-white/10',
  cancelled: 'bg-red-900/20 text-red-400 border-red-500/20',
}

/** Parse a YYYY-MM-DD date string safely — avoids UTC offset producing "Invalid Date" */
const parseDateStr = (dateVal: string | Date): Date => {
  const s = typeof dateVal === 'string' ? dateVal : dateVal.toISOString()
  return new Date(s.slice(0, 10) + 'T12:00:00') // local noon, no TZ shift
}

/** Compute effective status in real-time */
function effectiveDashStatus(apt: AppointmentPublic): string {
  if (apt.status === 'completed' || apt.status === 'cancelled') return apt.status
  const apptEnd = parseDateStr(apt.date)
  const [endH, endM] = (apt.end ?? '').split(':').map(Number)
  apptEnd.setHours(endH ?? 0, endM ?? 0, 0, 0)
  return new Date() > apptEnd ? 'expired' : 'pending'
}

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab]     = useState('dashboard')
  const { user, setUser }             = useAuth()
  const navigate                      = useNavigate()

  const [appointments, setAppointments] = useState<AppointmentPublic[]>([])
  const [workers, setWorkers]           = useState<WorkerPublic[]>([])
  const [clients, setClients]           = useState<ClientPublic[]>([])
  const [loading, setLoading]           = useState(true)

  // ─── Real-time online users ───────────────────────────────────────────────
  const { onlineUsers, connected } = useOnlineUsers(user)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const [apptRes, workRes, cliRes] = await Promise.all([
        appointmentService.getMany(),
        workerService.getAll(),
        clientService.getAll(),
      ])
      if (apptRes.ok) setAppointments(apptRes.data)
      if (workRes.ok) setWorkers(workRes.data)
      if (cliRes.ok)  setClients(cliRes.data)
      setLoading(false)
    }
    load()
  }, [])

  const handleLogout = () => {
    setUser(null)
    navigate('/login')
  }

  const workerName = (id: number) => {
    const w = workers.find(w => w.worker_id === id)
    return w ? `${w.first_name} ${w.last_name}` : `#${id}`
  }

  const stats = [
    { title: 'Appointments',   value: appointments.length,                                     icon: Calendar },
    { title: 'Active Clients', value: clients.length,                                          icon: Users },
    { title: 'Staff Members',  value: workers.length,                                          icon: UserCircle },
    { title: 'Pending',        value: appointments.filter(a => a.status === 'pending').length, icon: TrendingUp },
  ]

  return (
    <div className="h-screen bg-[#0a0a0a] flex overflow-hidden">

      {/* ── SIDEBAR ── */}
      <aside
        className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-[#1a1a1a] border-r border-white/10 transition-all duration-300 flex flex-col shrink-0 h-full`}
      >
        <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between shrink-0 min-h-[60px]">
          {sidebarOpen && (
            <img
              src={logo}
              alt="Obsidian Archive"
              className="h-60 w-auto object-contain -m-18 -ml-4"
            />
          )}
          <Button
            variant="ghost" size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white/40 hover:text-white hover:bg-white/5 shrink-0 ml-2"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>

        <Scrollable className="flex-1 min-h-0" style={{ height: '100%' }}>
          <nav className="p-4 space-y-1">
            {NAV.filter(item => !item.adminOnly || user?.tag === 'admin').map(item => (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => setActiveTab(item.id)}
                className={`w-full justify-start ${
                  activeTab === item.id
                    ? 'bg-[#ff5a66]/10 text-[#ff5a66] border border-[#ff5a66]/20'
                    : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className="w-5 h-5 shrink-0 -ml-1" />
                {sidebarOpen && (
                  <span className="ml-3 text-[11px] uppercase tracking-[0.15em]">
                    {item.label}
                  </span>
                )}
              </Button>
            ))}
          </nav>
        </Scrollable>

        <div className="p-4 border-t border-white/10 shrink-0">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start text-[#ff5a66]/60 hover:text-[#ff5a66] hover:bg-white/5"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {sidebarOpen && (
              <span className="ml-3 text-[11px] uppercase tracking-[0.15em]">Logout</span>
            )}
          </Button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      {activeTab === 'payments' ? (
        // Payments needs full height control for its split panel — no Scrollable wrapper
        <div className="flex-1 min-w-0 h-full overflow-hidden">
          <PaymentsPage />
        </div>
      ) : (
      <Scrollable className="flex-1 min-w-0 h-full">
        {activeTab === 'appointments' ? (
          <AppointmentsPage />
        ) : activeTab === 'clients' ? (
          <ClientsPage />
        ) : activeTab === 'staff' ? (
          <WorkerSchedulePage />
        ) : activeTab === 'attendance' ? (
          <AttendanceHistory />
        ) : activeTab === 'activity' ? (
          user?.tag === 'admin' ? <AttendanceHistory /> : null
        ) : activeTab === 'settings' ? (
          <SettingsPage />
        ) : (
        <div className="p-8 max-w-7xl mx-auto space-y-8">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1
                className="text-[48px] font-light text-white/95 leading-none"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Dashboard
              </h1>
              <p className="text-[11px] uppercase tracking-[0.25em] text-white/40 mt-2">
                Welcome back, {user?.email}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-white/90 font-medium capitalize">{user?.type}</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">{user?.email}</p>
              </div>
              <div className="w-12 h-12 bg-[#ff5a66] rounded-full flex items-center justify-center">
                <UserCircle className="w-7 h-7 text-black" />
              </div>
              {/* Logout button in header too */}
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="text-white/40 hover:text-[#ff5a66] hover:bg-white/5 text-[10px] uppercase tracking-[0.2em]"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-[#1a1a1a] border border-white/10 rounded-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-white/40">{stat.title}</span>
                  <stat.icon className="w-5 h-5 text-[#ff5a66]" />
                </div>
                <div
                  className="text-[40px] font-light text-white/95 leading-none"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  {loading ? '—' : stat.value}
                </div>
              </div>
            ))}
          </div>

          {/* ── ONLINE USERS WIDGET ── */}
          <OnlineUsers users={onlineUsers} connected={connected} />

          {/* Appointments */}
          <div className="bg-[#1a1a1a] border border-white/10 rounded-sm p-6">
            <div className="mb-6">
              <h2
                className="text-[28px] font-light text-white/95 leading-none"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Appointments
              </h2>
              <p className="text-[11px] uppercase tracking-[0.2em] text-white/40 mt-1">
                All scheduled appointments
              </p>
            </div>

            {loading ? (
              <div className="py-16 text-center text-white/30 text-sm">Loading...</div>
            ) : appointments.length === 0 ? (
              <div className="py-16 text-center text-white/30 text-sm">No appointments found</div>
            ) : (
              <div className="space-y-3">
                {appointments.map(apt => (
                  <div
                    key={apt.appointment_id}
                    className="flex items-center justify-between p-4 bg-black/40 border border-white/10 rounded-sm hover:border-[#ff5a66]/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center">
                        <UserCircle className="w-6 h-6 text-white/40" />
                      </div>
                      <div>
                        <p className="text-white/90 font-medium text-sm">Client #{apt.client_id}</p>
                        <p className="text-[10px] uppercase tracking-[0.15em] text-white/40">
                          {workerName(apt.worker_id)} · {apt.start} – {apt.end}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-white/60 text-sm">
                        {parseDateStr(apt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                      <span className={`text-[9px] uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${statusStyle[effectiveDashStatus(apt)]}`}>
                        {effectiveDashStatus(apt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Staff */}
          <div className="bg-[#1a1a1a] border border-white/10 rounded-sm p-6">
            <div className="mb-6">
              <h2
                className="text-[28px] font-light text-white/95 leading-none"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Staff
              </h2>
              <p className="text-[11px] uppercase tracking-[0.2em] text-white/40 mt-1">
                Active workers
              </p>
            </div>

            {loading ? (
              <div className="py-8 text-center text-white/30 text-sm">Loading...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {workers.map(w => (
                  <div
                    key={w.worker_id}
                    className="bg-black/40 border border-white/10 rounded-sm p-4 hover:border-[#ff5a66]/30 transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-[#ff5a66]/10 rounded-full flex items-center justify-center">
                        <UserCircle className="w-6 h-6 text-[#ff5a66]" />
                      </div>
                      <div>
                        <p className="text-white/90 font-medium text-sm">{w.first_name} {w.last_name}</p>
                        <p className="text-[10px] uppercase tracking-[0.15em] text-white/40">{w.email}</p>
                      </div>
                    </div>
                    <span className="text-[9px] uppercase tracking-[0.2em] px-2 py-1 bg-[#ff5a66]/10 text-[#ff5a66] border border-[#ff5a66]/20 rounded-full">
                      {w.specialty}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
        )}
      </Scrollable>
      )}
    </div>
  )
}
