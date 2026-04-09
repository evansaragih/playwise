export function StatusChip({ status }: { status: string }) {
  const map: Record<string, { bg: string; text: string }> = {
    PENDING:   { bg: '#FFB800', text: '#715200' },
    CONFIRMED: { bg: '#006413', text: '#00FF41' },
    PAID:      { bg: '#006413', text: '#9CFF93' },
    COMPLETED: { bg: '#2A2A2A', text: '#9E9E9E' },
    UPCOMING:  { bg: '#1E3A2A', text: '#00FF41' },
  }
  const style = map[status] ?? { bg: '#2A2A2A', text: '#9E9E9E' }
  return (
    <span className="text-[10px] font-bold px-2 py-1 rounded-[4px] tracking-wider"
          style={{ background: style.bg, color: style.text }}>
      {status}
    </span>
  )
}
