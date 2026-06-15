import { useTimerStore } from '../../store/useTimerStore'
import { PALETTES } from '../../utils/palettes'
import type { BgStyle } from '../../utils/palettes'

export function Background() {
  const bgStyle = useTimerStore((s) => s.settings.bgStyle)
  const paletteId = useTimerStore((s) => s.settings.paletteId)
  const mode = useTimerStore((s) => s.mode)
  const palette = PALETTES[paletteId] ?? PALETTES.cosmic

  const blobs = palette.auroraBlobs
  const accent = palette.modes[mode]

  return (
    <div
      aria-hidden
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0, background: palette.bgBase }}
    >
      {bgStyle === 'aurora'  && <AuroraBackground blobs={blobs} accent={accent} />}
      {bgStyle === 'grain'   && <GrainBackground accent={accent} palette={palette} />}
      {bgStyle === 'dots'    && <DotsBackground accent={accent} />}
      {bgStyle === 'mesh'    && <MeshBackground blobs={blobs} accent={accent} />}
      {bgStyle === 'void'    && null}
    </div>
  )
}

// ── Aurora ───────────────────────────────────────────────────────────────────

function AuroraBackground({ blobs, accent }: { blobs: [string, string, string]; accent: string }) {
  return (
    <>
      <style>{`
        @keyframes aurora-drift-1 {
          0%   { transform: translate(0, 0) scale(1); }
          33%  { transform: translate(6%, 4%) scale(1.08); }
          66%  { transform: translate(-4%, 8%) scale(0.96); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes aurora-drift-2 {
          0%   { transform: translate(0, 0) scale(1); }
          33%  { transform: translate(-8%, -3%) scale(1.05); }
          66%  { transform: translate(5%, -7%) scale(1.10); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes aurora-drift-3 {
          0%   { transform: translate(0, 0) scale(1); }
          50%  { transform: translate(4%, -5%) scale(0.93); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .aurora-blob { animation: none !important; }
        }
      `}</style>

      {/* Blob 1 — top left */}
      <div
        className="aurora-blob absolute rounded-full"
        style={{
          width: '60vw', height: '60vw',
          maxWidth: 520, maxHeight: 520,
          top: '-10%', left: '-15%',
          background: blobs[0],
          filter: 'blur(80px)',
          opacity: 0.55,
          animation: 'aurora-drift-1 22s ease-in-out infinite',
          transition: 'background 1s ease',
        }}
      />
      {/* Blob 2 — top right */}
      <div
        className="aurora-blob absolute rounded-full"
        style={{
          width: '50vw', height: '50vw',
          maxWidth: 440, maxHeight: 440,
          top: '-5%', right: '-10%',
          background: blobs[1],
          filter: 'blur(90px)',
          opacity: 0.40,
          animation: 'aurora-drift-2 28s ease-in-out infinite',
          transition: 'background 1s ease',
        }}
      />
      {/* Blob 3 — bottom center (accent tinted) */}
      <div
        className="aurora-blob absolute rounded-full"
        style={{
          width: '45vw', height: '45vw',
          maxWidth: 400, maxHeight: 400,
          bottom: '0%', left: '50%',
          transform: 'translateX(-50%)',
          background: accent,
          filter: 'blur(100px)',
          opacity: 0.20,
          animation: 'aurora-drift-3 18s ease-in-out infinite',
          transition: 'background 1s ease',
        }}
      />

      {/* Subtle vignette to deepen edges */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.65) 100%)',
        }}
      />
    </>
  )
}

// ── Grain ────────────────────────────────────────────────────────────────────

function GrainBackground({ accent, palette }: { accent: string; palette: ReturnType<typeof PALETTES[keyof typeof PALETTES]['id'] extends string ? () => never : never> | any }) {
  const svgNoise = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`

  return (
    <>
      {/* Radial accent gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${accent}22 0%, transparent 70%)`,
          transition: 'background 0.8s ease',
        }}
      />
      {/* Bottom corner accent */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 100% 100%, ${palette.auroraBlobs[0]}30 0%, transparent 60%)`,
          transition: 'background 0.8s ease',
        }}
      />
      {/* Film grain overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: svgNoise,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
          opacity: 0.045,
          mixBlendMode: 'overlay',
        }}
      />
      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)',
        }}
      />
    </>
  )
}

// ── Dots ─────────────────────────────────────────────────────────────────────

function DotsBackground({ accent }: { accent: string }) {
  return (
    <>
      {/* Dot grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, ${accent}50 1.5px, transparent 1.5px)`,
          backgroundSize: '24px 24px',
        }}
      />
      {/* Tight dark circle — sized to match the ring, sharp falloff so dots outside are visible */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 15% 35% at 50% 50%, rgba(0,0,0,0.93) 0%, rgba(0,0,0,0.88) 40%, rgba(0,0,0,0.12) 60%, transparent 72%)',
        }}
      />
      {/* Top — header + tabs */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.68) 0%, transparent 20%)',
        }}
      />
      {/* Bottom — controls */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.62) 0%, transparent 20%)',
        }}
      />
      {/* Subtle accent glow at top edge */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 60% 35% at 50% 0%, ${accent}22 0%, transparent 70%)`,
          transition: 'background 0.8s ease',
        }}
      />
    </>
  )
}

// ── Mesh ─────────────────────────────────────────────────────────────────────

function MeshBackground({ blobs, accent }: { blobs: [string, string, string]; accent: string }) {
  return (
    <>
      <div
        className="absolute inset-0"
        style={{
          background: [
            `radial-gradient(ellipse 70% 60% at 20% 20%, ${blobs[0]}35 0%, transparent 55%)`,
            `radial-gradient(ellipse 60% 70% at 80% 15%, ${blobs[1]}28 0%, transparent 50%)`,
            `radial-gradient(ellipse 80% 50% at 50% 90%, ${accent}18 0%, transparent 55%)`,
            `radial-gradient(ellipse 50% 60% at 90% 80%, ${blobs[2]}22 0%, transparent 50%)`,
          ].join(', '),
          transition: 'background 1s ease',
        }}
      />
      {/* Center darkening so the ring pops */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 55% 55% at 50% 50%, rgba(0,0,0,0.60) 0%, transparent 70%)',
        }}
      />
    </>
  )
}

export function BgStylePreview({ style, paletteId }: { style: BgStyle; paletteId: string }) {
  const palette = PALETTES[paletteId as keyof typeof PALETTES] ?? PALETTES.cosmic
  const accent = palette.modes.focus
  const blobs = palette.auroraBlobs

  const svgNoise = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`

  const previews: Record<BgStyle, React.CSSProperties> = {
    aurora: {
      background: `radial-gradient(ellipse at 30% 40%, ${blobs[0]}cc 0%, transparent 55%), radial-gradient(ellipse at 75% 25%, ${blobs[1]}aa 0%, transparent 50%), ${palette.bgBase}`,
    },
    grain: {
      background: `radial-gradient(ellipse at 50% 0%, ${accent}44 0%, transparent 65%), ${palette.bgBase}`,
    },
    dots: {
      backgroundImage: `radial-gradient(circle, ${accent}55 1px, transparent 1px)`,
      backgroundSize: '10px 10px',
      backgroundColor: palette.bgBase,
    },
    mesh: {
      background: [
        `radial-gradient(ellipse at 20% 20%, ${blobs[0]}88 0%, transparent 55%)`,
        `radial-gradient(ellipse at 80% 15%, ${blobs[1]}66 0%, transparent 50%)`,
        `radial-gradient(ellipse at 50% 90%, ${accent}44 0%, transparent 55%)`,
        palette.bgBase,
      ].join(', '),
    },
    void: {
      background: palette.bgBase,
    },
  }

  return (
    <div
      className="w-full h-full rounded-lg overflow-hidden relative"
      style={previews[style]}
    >
      {style === 'grain' && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: svgNoise,
            backgroundRepeat: 'repeat',
            backgroundSize: '100px 100px',
            opacity: 0.08,
            mixBlendMode: 'overlay',
          }}
        />
      )}
    </div>
  )
}
