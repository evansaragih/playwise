/**
 * TopBar — shared top bar component for all pages.
 *
 * Renders:
 *   1. A .status-bar-spacer div that fills env(safe-area-inset-top) with #0E0E0E
 *      so the iOS status bar text is always on the correct dark background.
 *   2. The actual top bar content (title, search, icons etc.)
 *      with pt-4 (16px) below the spacer — no guesswork about notch height.
 *
 * Usage:
 *   <TopBar>
 *     <div>...your top bar content...</div>
 *   </TopBar>
 */
export default function TopBar({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div style={{ background: '#0E0E0E' }}>
      {/* Fills the iOS status bar area exactly */}
      <div className="status-bar-spacer" />
      {/* Actual content below status bar */}
      <div className={`px-4 pb-4 pt-4 ${className}`}>
        {children}
      </div>
    </div>
  )
}
