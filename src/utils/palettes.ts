export type PaletteId = 'cosmic' | 'ember' | 'aurora' | 'rose' | 'acid' | 'sakura'
export type BgStyle = 'aurora' | 'grain' | 'dots' | 'mesh' | 'void'

export interface ModeColors {
  focus: string
  short: string
  long: string
}

export interface Palette {
  id: PaletteId
  name: string
  accent: string
  glow: string
  glowSm: string
  bgBase: string
  bgSurface: string
  bgElevated: string
  bgOverlay: string
  auroraBlobs: [string, string, string]
  modes: ModeColors
  modesGlow: ModeColors
}

export const PALETTES: Record<PaletteId, Palette> = {
  cosmic: {
    id: 'cosmic',
    name: 'Cosmic',
    accent: '#818cf8',
    glow: 'rgba(129,140,248,0.28)',
    glowSm: 'rgba(129,140,248,0.14)',
    bgBase: '#0c0c0f',
    bgSurface: '#13131a',
    bgElevated: '#1a1a24',
    bgOverlay: '#22222f',
    auroraBlobs: ['#312e81', '#4338ca', '#1e1b4b'],
    modes: { focus: '#818cf8', short: '#34d399', long: '#60a5fa' },
    modesGlow: {
      focus: 'rgba(129,140,248,0.35)',
      short: 'rgba(52,211,153,0.30)',
      long: 'rgba(96,165,250,0.30)',
    },
  },
  ember: {
    id: 'ember',
    name: 'Ember',
    accent: '#f97316',
    glow: 'rgba(249,115,22,0.28)',
    glowSm: 'rgba(249,115,22,0.14)',
    bgBase: '#0f0b07',
    bgSurface: '#171008',
    bgElevated: '#1f160a',
    bgOverlay: '#281d0d',
    auroraBlobs: ['#7c2d12', '#c2410c', '#431407'],
    modes: { focus: '#f97316', short: '#fbbf24', long: '#fb923c' },
    modesGlow: {
      focus: 'rgba(249,115,22,0.35)',
      short: 'rgba(251,191,36,0.30)',
      long: 'rgba(251,146,60,0.30)',
    },
  },
  aurora: {
    id: 'aurora',
    name: 'Aurora',
    accent: '#2dd4bf',
    glow: 'rgba(45,212,191,0.28)',
    glowSm: 'rgba(45,212,191,0.14)',
    bgBase: '#060d0d',
    bgSurface: '#0a1414',
    bgElevated: '#0f1c1c',
    bgOverlay: '#152424',
    auroraBlobs: ['#134e4a', '#0f766e', '#042f2e'],
    modes: { focus: '#2dd4bf', short: '#34d399', long: '#22d3ee' },
    modesGlow: {
      focus: 'rgba(45,212,191,0.35)',
      short: 'rgba(52,211,153,0.30)',
      long: 'rgba(34,211,238,0.30)',
    },
  },
  rose: {
    id: 'rose',
    name: 'Rose',
    accent: '#fb7185',
    glow: 'rgba(251,113,133,0.28)',
    glowSm: 'rgba(251,113,133,0.14)',
    bgBase: '#0f080c',
    bgSurface: '#180d12',
    bgElevated: '#201219',
    bgOverlay: '#281820',
    auroraBlobs: ['#881337', '#9f1239', '#4c0519'],
    modes: { focus: '#fb7185', short: '#f472b6', long: '#e879f9' },
    modesGlow: {
      focus: 'rgba(251,113,133,0.35)',
      short: 'rgba(244,114,182,0.30)',
      long: 'rgba(232,121,249,0.30)',
    },
  },
  acid: {
    id: 'acid',
    name: 'Acid',
    accent: '#a3e635',
    glow: 'rgba(163,230,53,0.28)',
    glowSm: 'rgba(163,230,53,0.14)',
    bgBase: '#060f06',
    bgSurface: '#0a160a',
    bgElevated: '#0f1e0f',
    bgOverlay: '#152615',
    auroraBlobs: ['#14532d', '#166534', '#052e16'],
    modes: { focus: '#a3e635', short: '#4ade80', long: '#22c55e' },
    modesGlow: {
      focus: 'rgba(163,230,53,0.35)',
      short: 'rgba(74,222,128,0.30)',
      long: 'rgba(34,197,94,0.30)',
    },
  },
  sakura: {
    id: 'sakura',
    name: 'Sakura',
    accent: '#f9a8d4',
    glow: 'rgba(249,168,212,0.28)',
    glowSm: 'rgba(249,168,212,0.14)',
    bgBase: '#0c080f',
    bgSurface: '#140d18',
    bgElevated: '#1c1222',
    bgOverlay: '#24182c',
    auroraBlobs: ['#701a75', '#86198f', '#4a044e'],
    modes: { focus: '#f9a8d4', short: '#fda4af', long: '#c4b5fd' },
    modesGlow: {
      focus: 'rgba(249,168,212,0.35)',
      short: 'rgba(253,164,175,0.30)',
      long: 'rgba(196,181,253,0.30)',
    },
  },
}

export interface BgStyleDef {
  id: BgStyle
  name: string
  desc: string
}

export const BG_STYLES: BgStyleDef[] = [
  { id: 'aurora', name: 'Aurora',  desc: 'Живые цветные пятна' },
  { id: 'grain',  name: 'Grain',   desc: 'Киноплёночный шум' },
  { id: 'dots',   name: 'Dots',    desc: 'Точечная сетка' },
  { id: 'mesh',   name: 'Mesh',    desc: 'Цветной меш' },
  { id: 'void',   name: 'Void',    desc: 'Чистая темнота' },
]

export function applyPalette(palette: Palette) {
  const root = document.documentElement
  root.style.setProperty('--color-accent', palette.accent)
  root.style.setProperty('--color-accent-dim', palette.auroraBlobs[0])
  root.style.setProperty('--color-accent-glow', palette.glow)
  root.style.setProperty('--color-accent-glow-sm', palette.glowSm)
  root.style.setProperty('--color-bg-base', palette.bgBase)
  root.style.setProperty('--color-bg-surface', palette.bgSurface)
  root.style.setProperty('--color-bg-elevated', palette.bgElevated)
  root.style.setProperty('--color-bg-overlay', palette.bgOverlay)
  // Mode-specific accent colors
  root.style.setProperty('--color-mode-focus', palette.modes.focus)
  root.style.setProperty('--color-mode-short', palette.modes.short)
  root.style.setProperty('--color-mode-long',  palette.modes.long)
  root.style.setProperty('--color-mode-focus-glow', palette.modesGlow.focus)
  root.style.setProperty('--color-mode-short-glow', palette.modesGlow.short)
  root.style.setProperty('--color-mode-long-glow',  palette.modesGlow.long)
}
