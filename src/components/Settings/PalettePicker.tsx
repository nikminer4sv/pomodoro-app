import { PALETTES, type PaletteId } from '../../utils/palettes'

const PALETTE_ORDER: PaletteId[] = ['cosmic', 'ember', 'aurora', 'rose', 'acid', 'sakura']

interface Props {
  value: PaletteId
  onChange: (id: PaletteId) => void
}

export function PalettePicker({ value, onChange }: Props) {
  return (
    <div className="flex items-center justify-between w-full py-1">
      {PALETTE_ORDER.map((id) => {
        const p = PALETTES[id]
        const active = value === id
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            aria-label={`Palette ${p.name}`}
            aria-pressed={active}
            className="cursor-pointer flex flex-col items-center gap-1.5 group"
            style={{ background: 'none', border: 'none', padding: 0, outline: 'none' }}
          >
            {/* Swatch circle */}
            <div
              className="relative rounded-full transition-all duration-200"
              style={{
                width: 34,
                height: 34,
                background: p.accent,
                boxShadow: active
                  ? `0 0 0 2px ${p.bgBase}, 0 0 0 4px ${p.accent}, 0 0 14px ${p.glow}`
                  : 'none',
                transform: active ? 'scale(1.18)' : 'scale(1)',
                opacity: active ? 1 : 0.45,
              }}
              // hover handled via group
            />
            {/* Name label */}
            <span
              className="text-[10px] font-medium tracking-wide transition-opacity duration-200"
              style={{
                fontFamily: 'var(--font-sans)',
                color: active ? p.accent : 'var(--color-text-muted)',
                opacity: active ? 1 : 0.6,
                letterSpacing: '0.04em',
              }}
            >
              {p.name}
            </span>
          </button>
        )
      })}
      <style>{`
        button:hover > div { opacity: 1 !important; transform: scale(1.08) !important; }
      `}</style>
    </div>
  )
}
