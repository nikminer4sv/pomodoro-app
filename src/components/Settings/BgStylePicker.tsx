import { BG_STYLES, PALETTES, type BgStyle, type PaletteId } from '../../utils/palettes'

interface Props {
  value: BgStyle
  paletteId: PaletteId
  onChange: (style: BgStyle) => void
}

export function BgStylePicker({ value, paletteId, onChange }: Props) {
  const palette = PALETTES[paletteId] ?? PALETTES.cosmic
  const accent = palette.accent
  const blobs = palette.auroraBlobs

  return (
    // minmax(0,1fr) forces equal columns even when text content is wider
    <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(5, minmax(0, 1fr))' }}>
      {BG_STYLES.map(({ id, name }) => {
        const active = value === id
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            aria-label={`Background ${name}`}
            aria-pressed={active}
            className="cursor-pointer min-w-0 flex flex-col items-center gap-1.5 transition-all duration-200"
            style={{ background: 'none', border: 'none', padding: 0, outline: 'none' }}
          >
            {/* Preview card — pure gradient content, no filter:blur children */}
            <div
              className="w-full rounded-xl relative transition-all duration-200 overflow-hidden"
              style={{
                height: 52,
                border: active
                  ? `1.5px solid ${accent}`
                  : '1.5px solid var(--color-border)',
                boxShadow: active ? `0 0 10px ${palette.glow}` : 'none',
                background: palette.bgBase,
              }}
            >
              <MiniPreview id={id} accent={accent} blobs={blobs} />
            </div>

            {/* Name only, truncated so it never overflows its column */}
            <div
              className="w-full text-center text-[11px] font-medium leading-tight truncate transition-colors duration-200"
              style={{
                color: active ? accent : 'var(--color-text-secondary)',
                fontFamily: 'var(--font-sans)',
              }}
            >
              {name}
            </div>
          </button>
        )
      })}
    </div>
  )
}

function MiniPreview({
  id, accent, blobs,
}: {
  id: BgStyle
  accent: string
  blobs: [string, string, string]
}) {
  // All previews use pure CSS gradients — no filter:blur so nothing escapes overflow:hidden

  if (id === 'aurora') {
    return (
      <div className="absolute inset-0" style={{
        background: [
          `radial-gradient(ellipse 95% 95% at 15% 20%, ${blobs[0]} 0%, transparent 60%)`,
          `radial-gradient(ellipse 80% 80% at 85% 15%, ${blobs[1]} 0%, transparent 55%)`,
          `radial-gradient(ellipse 60% 60% at 55% 90%, ${accent}99 0%, transparent 55%)`,
        ].join(', '),
      }} />
    )
  }

  if (id === 'grain') {
    const svgNoise = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='150' height='150' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`
    return (
      <div className="absolute inset-0">
        <div className="absolute inset-0" style={{
          background: `radial-gradient(ellipse at 50% 0%, ${accent}66 0%, transparent 70%)`,
        }} />
        <div className="absolute inset-0" style={{
          backgroundImage: svgNoise, backgroundSize: '80px 80px',
          opacity: 0.07, mixBlendMode: 'overlay',
        }} />
      </div>
    )
  }

  if (id === 'dots') {
    return (
      <div className="absolute inset-0" style={{
        backgroundImage: `radial-gradient(circle, ${accent}88 1px, transparent 1px)`,
        backgroundSize: '8px 8px',
      }} />
    )
  }

  if (id === 'mesh') {
    return (
      <div className="absolute inset-0" style={{
        background: [
          `radial-gradient(ellipse 90% 90% at 20% 25%, ${blobs[0]} 0%, transparent 55%)`,
          `radial-gradient(ellipse 75% 75% at 85% 20%, ${blobs[1]} 0%, transparent 50%)`,
          `radial-gradient(ellipse 55% 55% at 55% 90%, ${accent}88 0%, transparent 55%)`,
        ].join(', '),
      }} />
    )
  }

  // void
  return (
    <div className="absolute inset-0" style={{
      background: `radial-gradient(circle at center, ${accent}22 0%, transparent 60%)`,
    }} />
  )
}
