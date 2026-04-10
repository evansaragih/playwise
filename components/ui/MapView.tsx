'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiStar } from 'react-icons/hi'
import { BiCurrentLocation } from 'react-icons/bi'
import { LuPlus, LuMinus } from 'react-icons/lu'

interface Venue {
  id: string; name: string; location: string; distance: string
  rating: number; price: string; lat: number; lng: number; image: string
}
interface Props {
  venues: Venue[]
  selected: string | null
  onSelect: (id: string | null) => void
  containerHeight: number
}

const TILE = 256
const JAKARTA = { lat: -6.2088, lng: 106.8456 }

function ll2t(lat: number, lng: number, z: number) {
  const n = 2 ** z
  const x = ((lng + 180) / 360) * n
  const lr = (lat * Math.PI) / 180
  const y = ((1 - Math.log(Math.tan(lr) + 1 / Math.cos(lr)) / Math.PI) / 2) * n
  return { x, y }
}

export default function MapView({ venues, selected, onSelect, containerHeight }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [w, setW] = useState(393)
  const [zoom, setZoom]     = useState(13)
  const [centre, setCentre] = useState(() => ll2t(JAKARTA.lat, JAKARTA.lng, 13))
  const [tiles, setTiles]   = useState<{ key:string; url:string; sx:number; sy:number }[]>([])
  const tileCache = useRef(new Map<string, string>())
  const drag = useRef<{ sx:number; sy:number; cx:number; cy:number } | null>(null)

  /* ── measure container width ── */
  useEffect(() => {
    const el = wrapRef.current; if (!el) return
    const ro = new ResizeObserver(e => setW(e[0].contentRect.width))
    ro.observe(el); return () => ro.disconnect()
  }, [])

  const h = containerHeight || 500

  /* ── tile list ── */
  useEffect(() => {
    const cols = Math.ceil(w / TILE) + 2
    const rows = Math.ceil(h / TILE) + 2
    const tx0 = Math.floor(centre.x - cols / 2)
    const ty0 = Math.floor(centre.y - rows / 2)
    const out: typeof tiles = []
    const n = 2 ** zoom
    for (let dx = 0; dx < cols; dx++) {
      for (let dy = 0; dy < rows; dy++) {
        const tx = tx0 + dx, ty = ty0 + dy
        const wx = ((tx % n) + n) % n, wy = ((ty % n) + n) % n
        const key = `${zoom}/${wx}/${wy}`
        const url = `https://tile.openstreetmap.org/${zoom}/${wx}/${wy}.png`
        out.push({ key, url, sx: (tx - centre.x) * TILE + w / 2, sy: (ty - centre.y) * TILE + h / 2 })
      }
    }
    setTiles(out)
  }, [centre, zoom, w, h])

  /* ── lat/lng → pixel on canvas (relative to map container) ── */
  const ll2px = useCallback((lat: number, lng: number) => {
    const t = ll2t(lat, lng, zoom)
    return {
      x: (t.x - centre.x) * TILE + w / 2,
      y: (t.y - centre.y) * TILE + h / 2,
    }
  }, [centre, zoom, w, h])

  /* ── pan ── */
  const onPD = (e: React.PointerEvent) => {
    drag.current = { sx: e.clientX, sy: e.clientY, cx: centre.x, cy: centre.y }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }
  const onPM = (e: React.PointerEvent) => {
    if (!drag.current) return
    setCentre({ x: drag.current.cx - (e.clientX - drag.current.sx) / TILE, y: drag.current.cy - (e.clientY - drag.current.sy) / TILE })
  }
  const onPU = () => { drag.current = null }

  /* ── zoom ── */
  const zoomIn  = () => { if (zoom >= 18) return; setCentre(c => ({ x: c.x * 2, y: c.y * 2 })); setZoom(z => z + 1) }
  const zoomOut = () => { if (zoom <= 10) return; setCentre(c => ({ x: c.x / 2, y: c.y / 2 })); setZoom(z => z - 1) }
  const reset   = () => { setZoom(13); setCentre(ll2t(JAKARTA.lat, JAKARTA.lng, 13)) }
  const onWheel = (e: React.WheelEvent) => { e.preventDefault(); e.deltaY < 0 ? zoomIn() : zoomOut() }

  /* ── tooltip placement ──
     The tooltip is rendered relative to the MAP container (position:absolute
     inside the map div). We know the pin's pixel position on the map, so we
     place the tooltip directly above the pin.
     Rules:
       1. Prefer directly above pin (y - 80)
       2. If that would overlap the bottom sheet (bottom 180px) → push up further
       3. Never go above 8px from top of map
       4. Clamp left/right to stay inside map bounds
  */
  const TOOLTIP_W  = 172
  const TOOLTIP_H  = 74
  const SHEET_SAFE = h - 196   // above the selected-venue card area

  const tooltipStyle = (px: number, py: number): React.CSSProperties => {
    let top  = py - TOOLTIP_H - 16   // above pin
    if (top + TOOLTIP_H > SHEET_SAFE) top = SHEET_SAFE - TOOLTIP_H - 8
    if (top < 8) top = py + 40       // fallback: below pin if no room above
    const left = Math.max(8, Math.min(px - TOOLTIP_W / 2, w - TOOLTIP_W - 8))
    return { position:'absolute', top, left, width:TOOLTIP_W, zIndex:40, pointerEvents:'none' }
  }

  return (
    <div
      ref={wrapRef}
      className="relative overflow-hidden select-none"
      style={{ width:'100%', height:h, background:'#1A1A1A', cursor:'grab', touchAction:'none' }}
      onPointerDown={onPD} onPointerMove={onPM} onPointerUp={onPU} onPointerLeave={onPU}
      onWheel={onWheel}
    >
      {/* ── Tile layer ── */}
      {tiles.map(t => <Tile key={t.key} url={t.url} sx={t.sx} sy={t.sy} cache={tileCache.current} />)}

      {/* OSM attribution */}
      <div style={{ position:'absolute', bottom:4, left:4, fontSize:8, color:'rgba(0,0,0,0.5)',
        background:'rgba(255,255,255,0.55)', borderRadius:3, padding:'1px 4px', zIndex:5, pointerEvents:'none' }}>
        © OpenStreetMap
      </div>

      {/* ── Venue pins + tooltips ──
          Both rendered inside the map container with position:absolute
          so tooltip coordinates are relative to the same origin as pin coords. */}
      {venues.map(v => {
        const px = ll2px(v.lat, v.lng)
        const isSel = selected === v.id
        return (
          <div key={v.id} style={{ position:'absolute', left:0, top:0, width:'100%', height:'100%',
            pointerEvents:'none', zIndex: isSel ? 30 : 10 }}>

            {/* Tooltip — always above pin, clamped to safe area */}
            <AnimatePresence>
              {isSel && (
                <motion.div
                  initial={{ opacity:0, y:6, scale:0.92 }}
                  animate={{ opacity:1, y:0, scale:1 }}
                  exit={{ opacity:0, y:6, scale:0.92 }}
                  transition={{ type:'spring', stiffness:420, damping:28 }}
                  style={tooltipStyle(px.x, px.y)}>
                  <div style={{ background:'rgba(38,38,38,0.97)', borderRadius:16, padding:'12px 12px',
                    boxShadow:'0 4px 20px rgba(0,0,0,0.5)' }}>
                    <p className="font-heading font-bold text-white" style={{ fontSize:16, lineHeight:1.25 }}>
                      {v.name}
                    </p>
                    <div className="flex items-center justify-between" style={{ marginTop:6 }}>
                      <span className="font-ui font-bold" style={{ fontSize:14, color:'#9CFF93' }}>
                        {v.price}
                      </span>
                      <div className="flex items-center gap-1">
                        <HiStar size={12} color="#9CFF93" />
                        <span className="font-ui font-semibold text-white" style={{ fontSize:12 }}>
                          {v.rating}
                        </span>
                      </div>
                    </div>
                    {/* Caret pointing down toward pin */}
                    <div style={{ position:'absolute', bottom:-6, left:'50%',
                      transform:'translateX(-50%) rotate(45deg)',
                      width:12, height:12, background:'rgba(38,38,38,0.97)' }} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pin — positioned exactly at lat/lng pixel */}
            <div style={{ position:'absolute', left:px.x, top:px.y,
              transform:'translate(-50%,-50%)', pointerEvents:'auto', zIndex:2 }}>

              {/* Outer pulse ring */}
              {isSel && (
                <motion.div
                  initial={{ scale:0.5, opacity:0.8 }}
                  animate={{ scale:2.8, opacity:0 }}
                  transition={{ repeat:Infinity, duration:1.5, ease:'easeOut' }}
                  style={{ position:'absolute', inset:0, borderRadius:9999,
                    background:'rgba(156,255,147,0.35)', pointerEvents:'none' }} />
              )}
              {/* Inner breathing glow */}
              {isSel && (
                <motion.div
                  initial={{ scale:1.0, opacity:0.5 }}
                  animate={{ scale:1.8, opacity:0.15 }}
                  transition={{ repeat:Infinity, duration:1.0, ease:'easeInOut', repeatType:'reverse' }}
                  style={{ position:'absolute', inset:0, borderRadius:9999,
                    background:'rgba(156,255,147,0.4)', pointerEvents:'none' }} />
              )}
              {/* Pin circle */}
              <motion.div
                whileTap={{ scale:0.82 }}
                onClick={() => onSelect(isSel ? null : v.id)}
                style={{ cursor:'pointer',
                  width:32, height:32, borderRadius:9999, position:'relative', zIndex:3,
                  background: isSel ? '#9CFF93' : '#1E1E1E',
                  border:`2px solid #9CFF93`,
                  boxShadow: isSel ? '0 0 18px rgba(156,255,147,0.7)' : '0 2px 8px rgba(0,0,0,0.6)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  transition:'background 0.2s, box-shadow 0.2s' }}>
                <div style={{ width:10, height:10, borderRadius:9999,
                  background: isSel ? '#006413' : '#9CFF93',
                  transition:'background 0.2s' }} />
              </motion.div>
            </div>
          </div>
        )
      })}

      {/* ── Zoom + location controls — top-right, clear of map content ── */}
      <div style={{ position:'absolute', top:16, right:12,
        display:'flex', flexDirection:'column', gap:8, zIndex:100 }}>
        <motion.button whileTap={{ scale:0.88 }} onClick={zoomIn}
          style={{ width:40, height:40, borderRadius:9999,
            background:'rgba(26,26,26,0.92)', backdropFilter:'blur(8px)',
            display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow:'0 2px 10px rgba(0,0,0,0.5)' }}>
          <LuPlus size={16} color="#F5F5F5" />
        </motion.button>
        <motion.button whileTap={{ scale:0.88 }} onClick={zoomOut}
          style={{ width:40, height:40, borderRadius:9999,
            background:'rgba(26,26,26,0.92)', backdropFilter:'blur(8px)',
            display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow:'0 2px 10px rgba(0,0,0,0.5)' }}>
          <LuMinus size={16} color="#F5F5F5" />
        </motion.button>
        <motion.button whileTap={{ scale:0.88 }} onClick={reset}
          style={{ width:40, height:40, borderRadius:9999,
            background:'rgba(255,255,255,0.12)', backdropFilter:'blur(8px)',
            display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow:'0 2px 10px rgba(0,0,0,0.4)' }}>
          <BiCurrentLocation size={18} color="#F5F5F5" />
        </motion.button>
      </div>
    </div>
  )
}

/* ── Single map tile ── */
function Tile({ url, sx, sy, cache }: { url:string; sx:number; sy:number; cache:Map<string,string> }) {
  const [src, setSrc] = useState(() => cache.get(url) || '')
  useEffect(() => {
    if (cache.has(url)) { setSrc(url); return }
    const img = new Image(); img.crossOrigin = 'anonymous'
    img.onload = () => { cache.set(url, url); setSrc(url) }
    img.src = url
  }, [url])
  return (
    <div style={{ position:'absolute', left:sx, top:sy, width:TILE, height:TILE,
      background:'#242424', overflow:'hidden' }}>
      {src && <img src={src} width={TILE} height={TILE} alt=""
                   style={{ display:'block', pointerEvents:'none', userSelect:'none' }} draggable={false} />}
    </div>
  )
}
