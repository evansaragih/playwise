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
  venues: Venue[]; selected: string | null; onSelect: (id: string | null) => void
  containerHeight: number   // passed from parent so we know exact px height
}

const TILE = 256
const JAKARTA = { lat: -6.2088, lng: 106.8456 }

/* ── Mercator maths ── */
function ll2t(lat: number, lng: number, z: number) {
  const n = 2 ** z
  const x = ((lng + 180) / 360) * n
  const lr = (lat * Math.PI) / 180
  const y = ((1 - Math.log(Math.tan(lr) + 1 / Math.cos(lr)) / Math.PI) / 2) * n
  return { x, y }
}

export default function MapView({ venues, selected, onSelect, containerHeight }: Props) {
  const wrapRef   = useRef<HTMLDivElement>(null)
  const [w, setW] = useState(393)
  const [zoom, setZoom]     = useState(13)
  const [centre, setCentre] = useState(() => ll2t(JAKARTA.lat, JAKARTA.lng, 13))
  const [tiles, setTiles]   = useState<{ key:string; url:string; sx:number; sy:number }[]>([])
  const tileCache = useRef(new Map<string, HTMLImageElement>())
  const drag = useRef<{ sx:number; sy:number; cx:number; cy:number } | null>(null)

  /* measure width */
  useEffect(() => {
    const el = wrapRef.current; if (!el) return
    const ro = new ResizeObserver(e => setW(e[0].contentRect.width))
    ro.observe(el); return () => ro.disconnect()
  }, [])

  /* build tile list */
  useEffect(() => {
    const h = containerHeight || 400
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
        // OpenStreetMap tiles (free, no API key needed, familiar Google-like style)
        const url = `https://tile.openstreetmap.org/${zoom}/${wx}/${wy}.png`
        out.push({ key, url, sx: (tx - centre.x) * TILE + w / 2, sy: (ty - centre.y) * TILE + (h / 2) })
      }
    }
    setTiles(out)
  }, [centre, zoom, w, containerHeight])

  /* lat/lng → pixel on canvas */
  const ll2px = useCallback((lat: number, lng: number) => {
    const t = ll2t(lat, lng, zoom)
    return { x: (t.x - centre.x) * TILE + w / 2, y: (t.y - centre.y) * TILE + (containerHeight || 400) / 2 }
  }, [centre, zoom, w, containerHeight])

  /* pan */
  const onPD = (e: React.PointerEvent) => {
    drag.current = { sx: e.clientX, sy: e.clientY, cx: centre.x, cy: centre.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId)
  }
  const onPM = (e: React.PointerEvent) => {
    if (!drag.current) return
    setCentre({ x: drag.current.cx - (e.clientX - drag.current.sx) / TILE, y: drag.current.cy - (e.clientY - drag.current.sy) / TILE })
  }
  const onPU = () => { drag.current = null }

  /* zoom */
  const zoomIn  = () => { if (zoom >= 18) return; setZoom(z => z+1); setCentre(c => ({ x: c.x*2, y: c.y*2 })) }
  const zoomOut = () => { if (zoom <= 10) return; setZoom(z => z-1); setCentre(c => ({ x: c.x/2, y: c.y/2 })) }
  const reset   = () => { setZoom(13); setCentre(ll2t(JAKARTA.lat, JAKARTA.lng, 13)) }
  const onWheel = (e: React.WheelEvent) => { e.preventDefault(); e.deltaY < 0 ? zoomIn() : zoomOut() }

  /* smart tooltip placement:
     if pin is in lower 40% of map → show tooltip ABOVE the bottom card safe area
     if pin is in upper 60% → show tooltip just below pin
     always clamp horizontally */
  const h = containerHeight || 400
  const BOTTOM_SHEET_H = selected ? 180 : 0   // approx h of bottom card + cta
  const getTooltipStyle = (px: number, py: number): React.CSSProperties => {
    const TOOLTIP_H = 74
    const TOOLTIP_W = 172
    // safe zone above bottom sheet
    const safeBottom = h - BOTTOM_SHEET_H - 16
    // prefer above pin
    let top = py - 90
    // if tooltip would overlap bottom sheet, push it up
    if (top + TOOLTIP_H > safeBottom) top = safeBottom - TOOLTIP_H - 8
    // don't go above 8px
    if (top < 8) top = py + 36
    // clamp horizontal
    const left = Math.min(Math.max(px - TOOLTIP_W / 2, 8), w - TOOLTIP_W - 8)
    return { position:'absolute', top, left, width: TOOLTIP_W, zIndex: 50 }
  }

  return (
    <div ref={wrapRef} className="relative overflow-hidden select-none"
      style={{ width:'100%', height: containerHeight, background:'#1A1A1A', cursor:'grab' }}
      onPointerDown={onPD} onPointerMove={onPM} onPointerUp={onPU} onPointerLeave={onPU}
      onWheel={onWheel}>

      {/* ── Tiles ── */}
      {tiles.map(t => <Tile key={t.key} url={t.url} sx={t.sx} sy={t.sy} cache={tileCache.current} />)}

      {/* ── OSM attribution (required by OSM license) ── */}
      <div style={{ position:'absolute', bottom:4, left:4, fontSize:8, color:'rgba(0,0,0,0.5)', background:'rgba(255,255,255,0.6)', borderRadius:4, padding:'1px 4px', zIndex:5, pointerEvents:'none' }}>
        © OpenStreetMap
      </div>

      {/* ── Pins ── */}
      {venues.map(v => {
        const px = ll2px(v.lat, v.lng)
        const isSel = selected === v.id
        return (
          <div key={v.id} style={{ position:'absolute', left:px.x, top:px.y, transform:'translate(-50%,-50%)', zIndex: isSel ? 30 : 10, pointerEvents:'auto' }}>
            {/* Pulse ring */}
            {isSel && (
              <motion.div initial={{ scale:0.6, opacity:0.7 }} animate={{ scale:2.6, opacity:0 }}
                transition={{ repeat:Infinity, duration:1.5, ease:'easeOut' }}
                style={{ position:'absolute', width:32, height:32, borderRadius:9999, background:'rgba(156,255,147,0.35)',
                  top:0, left:0, pointerEvents:'none' }} />
            )}
            {/* Breathing glow */}
            {isSel && (
              <motion.div initial={{ scale:1, opacity:0.5 }} animate={{ scale:1.8, opacity:0.15 }}
                transition={{ repeat:Infinity, duration:1.0, ease:'easeInOut', repeatType:'reverse' }}
                style={{ position:'absolute', width:32, height:32, borderRadius:9999,
                  background:'rgba(156,255,147,0.4)', top:0, left:0, pointerEvents:'none' }} />
            )}
            {/* Pin circle */}
            <motion.div whileTap={{ scale:0.82 }}
              onClick={() => onSelect(isSel ? null : v.id)}
              style={{ position:'relative', zIndex:2, cursor:'pointer',
                width:32, height:32, borderRadius:9999,
                background: isSel ? '#9CFF93' : '#1E1E1E',
                border: `2px solid ${isSel ? '#9CFF93' : '#9CFF93'}`,
                boxShadow: isSel ? '0 0 18px rgba(156,255,147,0.7)' : '0 2px 8px rgba(0,0,0,0.6)',
                display:'flex', alignItems:'center', justifyContent:'center',
                transition:'background 0.2s, box-shadow 0.2s' }}>
              <div style={{ width:10, height:10, borderRadius:9999,
                background: isSel ? '#006413' : '#9CFF93',
                transition:'background 0.2s' }} />
            </motion.div>

            {/* Tooltip — smart placement */}
            <AnimatePresence>
              {isSel && (
                <motion.div
                  initial={{ opacity:0, y:6, scale:0.92 }}
                  animate={{ opacity:1, y:0, scale:1 }}
                  exit={{ opacity:0, y:6, scale:0.92 }}
                  transition={{ type:'spring', stiffness:420, damping:28 }}
                  style={getTooltipStyle(px.x, px.y)}>
                  <div style={{ background:'rgba(38,38,38,0.97)', borderRadius:16, padding:'12px 12px' }}>
                    <p className="font-heading font-bold text-white" style={{ fontSize:16, lineHeight:1.25 }}>{v.name}</p>
                    <div className="flex items-center justify-between" style={{ marginTop:6 }}>
                      <span className="font-ui font-bold" style={{ fontSize:14, color:'#9CFF93' }}>{v.price}</span>
                      <div className="flex items-center gap-1">
                        <HiStar size={12} color="#9CFF93" />
                        <span className="font-ui font-semibold text-white" style={{ fontSize:12 }}>{v.rating}</span>
                      </div>
                    </div>
                    {/* Caret */}
                    <div style={{ position:'absolute', bottom:-6, left:'50%', transform:'translateX(-50%) rotate(45deg)',
                      width:12, height:12, background:'rgba(38,38,38,0.97)' }} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}

      {/* ── Controls: top-right with padding ── */}
      <div style={{ position:'absolute', top:16, right:12, display:'flex', flexDirection:'column', gap:8, zIndex:100 }}>
        <motion.button whileTap={{ scale:0.88 }} onClick={zoomIn}
          style={{ width:40, height:40, borderRadius:9999, background:'rgba(26,26,26,0.90)',
            backdropFilter:'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow:'0 2px 8px rgba(0,0,0,0.4)' }}>
          <LuPlus size={16} color="#F5F5F5" />
        </motion.button>
        <motion.button whileTap={{ scale:0.88 }} onClick={zoomOut}
          style={{ width:40, height:40, borderRadius:9999, background:'rgba(26,26,26,0.90)',
            backdropFilter:'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow:'0 2px 8px rgba(0,0,0,0.4)' }}>
          <LuMinus size={16} color="#F5F5F5" />
        </motion.button>
        {/* Reset/current location */}
        <motion.button whileTap={{ scale:0.88 }} onClick={reset}
          style={{ width:40, height:40, borderRadius:9999, background:'rgba(255,255,255,0.12)',
            backdropFilter:'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow:'0 2px 8px rgba(0,0,0,0.4)' }}>
          <BiCurrentLocation size={18} color="#F5F5F5" />
        </motion.button>
      </div>
    </div>
  )
}

function Tile({ url, sx, sy, cache }: { url:string; sx:number; sy:number; cache:Map<string,HTMLImageElement> }) {
  const [src, setSrc] = useState('')
  useEffect(() => {
    if (cache.has(url)) { setSrc(url); return }
    const img = new Image(); img.crossOrigin = 'anonymous'
    img.onload = () => { cache.set(url, img); setSrc(url) }
    img.src = url
  }, [url])
  if (!src) return <div style={{ position:'absolute', left:sx, top:sy, width:TILE, height:TILE, background:'#1a1a1a' }} />
  return <img src={src} style={{ position:'absolute', left:sx, top:sy, width:TILE, height:TILE, userSelect:'none', pointerEvents:'none' }} alt="" draggable={false} />
}
