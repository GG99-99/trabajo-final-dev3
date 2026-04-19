import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Clock, DollarSign, ImageIcon, Search, Calendar } from 'lucide-react'
import { tattooService, type Tattoo } from '@/lib/tattoo.service'
import heroImg from '@/assets/CatalogTattoo.jpg'
import Scrollable from '@/componentes/Scrollable'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3030/api'

function TattooCard({ tattoo }: { tattoo: Tattoo }) {
  const [imgError, setImgError] = useState(false)
  return (
    <div className="group bg-[#111] border border-white/8 rounded-sm overflow-hidden hover:border-[#ff5a66]/40 transition-all duration-300">
      {/* Image */}
      <div className="aspect-square bg-black overflow-hidden">
        {!imgError ? (
          <img
            src={tattooService.imageUrl(tattoo)}
            alt={tattoo.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 grayscale-20"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="w-12 h-12 text-white/10" />
          </div>
        )}
      </div>
      {/* Info */}
      <div className="p-5 space-y-3">
        <p
          className="text-white/90 text-[18px] font-light leading-tight"
          style={{ fontFamily: 'Cormorant Garamond, serif' }}
        >
          {tattoo.name}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-white/40">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-[11px] uppercase tracking-[0.15em]">{tattoo.time}h</span>
          </div>
          <div className="flex items-center gap-1 text-[#ff5a66]">
            <DollarSign className="w-3.5 h-3.5" />
            <span className="text-[14px] font-medium">{tattoo.cost}</span>
          </div>
        </div>
        <Link
          to="/book"
          className="flex items-center justify-center gap-2 w-full h-9 bg-[#ff5a66]/10 hover:bg-[#ff5a66] border border-[#ff5a66]/30 hover:border-[#ff5a66] text-[#ff5a66] hover:text-black text-[9px] font-bold uppercase tracking-[0.25em] rounded-sm transition-all duration-200"
        >
          <Calendar className="w-3.5 h-3.5" />
          Book this design
        </Link>
      </div>
    </div>
  )
}

export default function Catalog() {
  const [tattoos, setTattoos] = useState<Tattoo[]>([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')

  useEffect(() => {
    tattooService.getMany().then(r => {
      if (r.ok) setTattoos(r.data)
      setLoading(false)
    })
  }, [])

  const filtered = tattoos.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Scrollable style={{ height: '100svh' }}>
    <div className="min-h-screen bg-[#0a0a0a] selection:bg-[#ff5a66]/20">
      <div className="relative h-[40vh] min-h-[260px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImg})`, filter: 'grayscale(40%) brightness(0.45)' }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/20 to-[#0a0a0a]" />

        <Link
          to="/"
          className="absolute top-6 left-6 flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-white/40 hover:text-white transition-colors z-10"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </Link>

        <div className="absolute bottom-10 left-8 md:left-16 z-10">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#ff5a66]/70 mb-3">
            Obsidian Archive
          </p>
          <h1
            className="text-[52px] md:text-[72px] font-light uppercase italic leading-[0.88] text-white/95"
            style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}
          >
            Our<br />
            <span className="text-[#ff5a66] drop-shadow-[0_0_30px_rgba(255,90,102,0.4)]">
              Catalog
            </span>
          </h1>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
          <input
            type="text"
            placeholder="Search designs..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-white/10 text-white/80 text-[13px] pl-10 pr-4 py-2.5 rounded-sm outline-none focus:border-[#ff5a66] placeholder:text-white/25 transition-colors"
          />
        </div>

        {/* Count */}
        <p className="text-[11px] uppercase tracking-[0.25em] text-white/30">
          {loading ? 'Loading...' : `${filtered.length} design${filtered.length !== 1 ? 's' : ''}`}
        </p>

        {/* Grid */}
        {loading ? (
          <div className="py-24 text-center text-white/30 text-sm">Loading catalog...</div>
        ) : filtered.length === 0 ? (
          <div className="py-24 text-center">
            <ImageIcon className="w-12 h-12 text-white/10 mx-auto mb-4" />
            <p className="text-white/30 text-sm">No designs found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map(t => <TattooCard key={t.tattoo_id} tattoo={t} />)}
          </div>
        )}

        {/* CTA */}
        {!loading && filtered.length > 0 && (
          <div className="text-center pt-8 border-t border-white/10">
            <p className="text-[12px] text-white/30 mb-4">
              Don't see what you're looking for? We do custom designs.
            </p>
            <Link
              to="/book"
              className="inline-flex items-center gap-2 h-12 px-8 bg-[#ff5a66] hover:bg-[#ff7078] text-black text-[10px] font-bold uppercase tracking-[0.3em] rounded-sm transition-colors"
            >
              <Calendar className="w-4 h-4" />
              Book a Custom Session
            </Link>
          </div>
        )}
      </div>
    </div>
    </Scrollable>
  )
}
