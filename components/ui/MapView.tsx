'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiStar } from 'react-icons/hi'
import { BiCurrentLocation } from 'react-icons/bi'
import { LuPlus, LuMinus } from 'react-icons/lu'

interface Venue {
  id: string
  name: string
  location: string
  distance: string
  rating: number
  price: string
  lat: number
  lng: number
  image: string
}

interface Props {
  venues: Venue[]
  selected: string | null
  onSelect: (id: string | null) => void
}

/* ── Jakarta centre ── */
const JAKARTA = { lat: -6.2088, lng: 106.8456 }
const TILE_SIZE = 256

/* ── Mercator helpers ── */
function latLngToTile(lat: number, lng: number, zoom: number) {
  const n = 2 ** zoom
  const x = ((lng + 180) / 360) * n
  const latRad = (lat * Math.PI) / 180
  const y = ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n
  return { x, y }
}
function tileToLatLng(x: number, y: number, zoom: number) {
  const n = 2 ** zoom
  const lng = (x / n) * 360 - 180
  const latRad = Math.atan(Math.sinh(Math.PI * (1 - (2 * y) / n)))
  return { lat: (latRad * 180) / Math.PI, lng }
}

export default function MapView({ venues, selected, onSelect }: Props) {
  const canvasRef   = useRef<HTMLDivElement>(null)
  const [zoom, setZoom]   = useState(13)
  /* centre in tile coords */
  const [centre, setCentre] = useState(() => latLngToTile(JAKARTA.lat, JAKARTA.lng, 13))
  const [size, setSize]     = useState({ w: 393, h: 500 })
  const drag = useRef<{ startX: number; startY: number; cx: number; cy: number } | null>(null)
  const [tiles, setTiles]   = useState<{ key: string; url: string; sx: number; sy: number }[]>([])
  const tileCache = useRef<Map<string, HTMLImageElement>>(new Map())
  const renderRef = useRef<HTMLCanvasElement>(null)

  /* Measure container */
  useEffect(() => {
    const el = canvasRef.current
    if (!el) return
    const ro = new ResizeObserver(entries => {
      for (const e of entries) {
        setSize({ w: e.contentRect.width, h: e.contentRect.height })
      }
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  /* Compute which tiles to load */
  useEffect(() => {
    const { w, h } = size
    const cols = Math.ceil(w / TILE_SIZE) + 2
    const rows = Math.ceil(h / TILE_SIZE) + 2
    const startTileX = Math.floor(centre.x - cols / 2)
    const startTileY = Math.floor(centre.y - rows / 2)
    const newTiles: typeof tiles = []
    for (let dx = 0; dx < cols; dx++) {
      for (let dy = 0; dy < rows; dy++) {
        const tx = startTileX + dx
        const ty = startTileY + dy
        const n = 2 ** zoom
        const wtx = ((tx % n) + n) % n
        const wty = ((ty % n) + n) % n
        const key = `${zoom}/${wtx}/${wty}`
        // Offset in pixels from canvas origin
        const sx = (tx - centre.x) * TILE_SIZE + w / 2
        const sy = (ty - centre.y) * TILE_SIZE + h / 2
        // Dark-style tile from CartoDB Dark Matter
        const url = `https://a.basemaps.cartocdn.com/dark_all/${zoom}/${wtx}/${wty}.png`
        newTiles.push({ key, url, sx, sy })
      }
    }
    setTiles(newTiles)
  }, [centre, zoom, size])

  /* Convert lat/lng to pixel position on canvas */
  const latLngToPixel = (lat: number, lng: number) => {
    const t = latLngToTile(lat, lng, zoom)
    return {
      x: (t.x - centre.x) * TILE_SIZE + size.w / 2,
      y: (t.y - centre.y) * TILE_SIZE + size.h / 2,
    }
  }

  /* Pan handlers */
  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { startX: e.clientX, startY: e.clientY, cx: centre.x, cy: centre.y }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return
    const dx = (e.clientX - drag.current.startX) / TILE_SIZE
    const dy = (e.clientY - drag.current.startY) / TILE_SIZE
    setCentre({ x: drag.current.cx - dx, y: drag.current.cy - dy })
  }
  const onPointerUp = () => { drag.current = null }

  /* Zoom helpers */
  const zoomIn = () => {
    if (zoom >= 18) return
    const nz = zoom + 1
    const scale = 2
    setCentre(c => ({ x: c.x * scale, y: c.y * scale }))
    setZoom(nz)
  }
  const zoomOut = () => {
    if (zoom <= 10) return
    const nz = zoom - 1
    setCentre(c => ({ x: c.x / 2, y: c.y / 2 }))
    setZoom(nz)
  }
  const resetToJakarta = () => {
    const nz = 13
    setZoom(nz)
    setCentre(latLngToTile(JAKARTA.lat, JAKARTA.lng, nz))
  }

  /* Wheel zoom */
  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    if (e.deltaY < 0) zoomIn(); else zoomOut()
  }

  return (
    <div ref={canvasRef} className="relative w-full h-full overflow-hidden select-none"
         style={{ background:'#1A1A1A', cursor:'grab' }}
         onPointerDown={onPointerDown} onPointerMove={onPointerMove}
         onPointerUp={onPointerUp} onPointerLeave={onPointerUp}
         onWheel={onWheel}>

      {/* ── Tile layer ── */}
      {tiles.map(t => (
        <TileImage key={t.key} url={t.url} sx={t.sx} sy={t.sy} cache={tileCache.current} />
      ))}

      {/* ── Venue pins ── */}
      {venues.map(v => {
        const pos = latLngToPixel(v.lat, v.lng)
        const isSelected = selected === v.id
        // Clamp tooltip to stay on screen
        const tooltipLeft = Math.min(Math.max(pos.x - 80, 8), size.w - 168)
        return (
          <div key={v.id} style={{ position:'absolute', left: pos.x, top: pos.y, transform:'translate(-50%,-50%)', zIndex: isSelected ? 20 : 10, pointerEvents:'auto' }}>
            {/* Pulsing ring on selected */}
            {isSelected && (
              <motion.div
                initial={{ scale:0.5, opacity:0.8 }}
                animate={{ scale:2.2, opacity:0 }}
                transition={{ repeat:Infinity, duration:1.4, ease:'easeOut' }}
                style={{ position:'absolute', width:32, height:32, borderRadius:9999,
                  background:'rgba(156,255,147,0.35)', top:0, left:0, transform:'translate(-50%,-50%) scale(0)', transformOrigin:'center' }} />
            )}
            {/* Outer glow ring */}
            {isSelected && (
              <motion.div
                initial={{ scale:1, opacity:1 }} animate={{ scale:1.5, opacity:0.4 }}
                transition={{ repeat:Infinity, duration:1.0, ease:'easeInOut', repeatType:'reverse' }}
                style={{ position:'absolute', width:48, height:48, borderRadius:9999,
                  background:'rgba(156,255,147,0.20)', top:-8, left:-8 }} />
            )}
            {/* Pin */}
            <motion.div
              whileTap={{ scale:0.85 }}
              onClick={() => onSelect(isSelected ? null : v.id)}
              style={{ cursor:'pointer',
                width:32, height:32, borderRadius:9999,
                background: isSelected ? '#9CFF93' : '#262626',
                boxShadow: isSelected ? '0 0 16px rgba(156,255,147,0.6)' : '0 2px 8px rgba(0,0,0,0.5)',
                display:'flex', alignItems:'center', justifyContent:'center',
                transition:'background 0.2s, box-shadow 0.2s', position:'relative', zIndex:2 }}>
              <div style={{ width:10, height:10, borderRadius:9999,
                background: isSelected ? '#006413' : '#9CFF93' }} />
            </motion.div>

            {/* Tooltip — stays inside screen bounds */}
            <AnimatePresence>
              {isSelected && (
                <motion.div
                  initial={{ opacity:0, y:6, scale:0.92 }}
                  animate={{ opacity:1, y:0, scale:1 }}
                  exit={{ opacity:0, y:6, scale:0.92 }}
                  transition={{ type:'spring', stiffness:400, damping:28 }}
                  style={{
                    position:'fixed',
                    left: tooltipLeft,
                    top: pos.y - 90,
                    width:160,
                    background:'rgba(38,38,38,0.97)',
                    borderRadius:16,
                    padding:'12px 12px',
                    zIndex:30,
                    pointerEvents:'none',
                  }}>
                  <p className="font-heading font-bold text-white" style={{ fontSize:18, lineHeight:1.2 }}>{v.name}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-ui font-bold text-[14px]" style={{ color:'#9CFF93' }}>{v.price}</span>
                    <div className="flex items-center gap-1">
                      <HiStar size={12} color="#9CFF93" />
                      <span className="font-ui font-semibold text-[12px] text-white">{v.rating}</span>
                    </div>
                  </div>
                  {/* Caret */}
                  <div style={{ position:'absolute', bottom:-6, left:'50%', transform:'translateX(-50%) rotate(45deg)',
                    width:12, height:12, background:'rgba(38,38,38,0.97)' }} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}

      {/* ── Controls: zoom + current location ── */}
      <div style={{ position:'absolute', right:12, bottom:96, display:'flex', flexDirection:'column', gap:8, zIndex:100 }}>
        {/* Zoom in */}
        <motion.button whileTap={{ scale:0.9 }}
          onClick={zoomIn}
          style={{ width:40, height:40, borderRadius:9999, background:'rgba(38,38,38,0.92)', display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(8px)' }}>
          <LuPlus size={16} color="#F5F5F5" />
        </motion.button>
        {/* Zoom out */}
        <motion.button whileTap={{ scale:0.9 }}
          onClick={zoomOut}
          style={{ width:40, height:40, borderRadius:9999, background:'rgba(38,38,38,0.92)', display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(8px)' }}>
          <LuMinus size={16} color="#F5F5F5" />
        </motion.button>
        {/* Current location / reset — bg rgba(255,255,255,0.10) r:309 */}
        <motion.button whileTap={{ scale:0.9 }}
          onClick={resetToJakarta}
          style={{ width:40, height:40, borderRadius:309, background:'rgba(255,255,255,0.10)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <BiCurrentLocation size={17} color="#F5F5F5" />
        </motion.button>
      </div>
    </div>
  )
}

/* ── Single tile image ── */
function TileImage({ url, sx, sy, cache }: { url: string; sx: number; sy: number; cache: Map<string, HTMLImageElement> }) {
  const [loaded, setLoaded] = useState(false)
  const [src, setSrc] = useState('')
  useEffect(() => {
    if (cache.has(url)) { setSrc(url); setLoaded(true); return }
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => { cache.set(url, img); setSrc(url); setLoaded(true) }
    img.src = url
  }, [url])
  return (
    <div style={{
      position:'absolute', left:sx, top:sy,
      width:TILE_SIZE, height:TILE_SIZE,
      background:'#1A1A1A', overflow:'hidden',
      transition:'opacity 0.15s',
      opacity: loaded ? 1 : 0,
    }}>
      {loaded && <img src={src} width={TILE_SIZE} height={TILE_SIZE} alt="" draggable={false} />}
    </div>
  )
}
