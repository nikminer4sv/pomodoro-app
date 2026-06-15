import type { SoundTheme } from '../store/useTimerStore'

let ctx: AudioContext | null = null

function getCtx(): AudioContext {
  if (!ctx || ctx.state === 'closed') {
    ctx = new AudioContext()
  }
  return ctx
}

function resumeCtx(): Promise<void> {
  const c = getCtx()
  return c.state === 'suspended' ? c.resume() : Promise.resolve()
}

// ── helpers ──────────────────────────────────────────────────────────────────

function osc(
  ac: AudioContext,
  type: OscillatorType,
  freq: number,
  gain: number,
  startAt: number,
  endAt: number,
  fadeOut = true,
) {
  const g = ac.createGain()
  g.connect(ac.destination)
  g.gain.setValueAtTime(gain, startAt)
  if (fadeOut) g.gain.exponentialRampToValueAtTime(0.001, endAt)

  const o = ac.createOscillator()
  o.type = type
  o.frequency.setValueAtTime(freq, startAt)
  o.connect(g)
  o.start(startAt)
  o.stop(endAt)
}

// ── ZEN theme: soft bowl-like tones ──────────────────────────────────────────

function zenTick(ac: AudioContext, t: number) {
  osc(ac, 'sine', 880, 0.04, t, t + 0.08)
}

function zenStart(ac: AudioContext, t: number) {
  // Two warm bells a fifth apart
  osc(ac, 'sine', 528, 0.25, t, t + 1.5)
  osc(ac, 'sine', 792, 0.15, t + 0.05, t + 1.2)
}

function zenEnd(ac: AudioContext, t: number) {
  // Three ascending tones — like a chime
  osc(ac, 'sine', 396, 0.3, t, t + 1.2)
  osc(ac, 'sine', 528, 0.3, t + 0.35, t + 1.4)
  osc(ac, 'sine', 660, 0.3, t + 0.7, t + 1.8)
}

// ── RETRO theme: chiptune beeps ──────────────────────────────────────────────

function retroTick(ac: AudioContext, t: number) {
  osc(ac, 'square', 440, 0.05, t, t + 0.05, false)
}

function retroStart(ac: AudioContext, t: number) {
  const melody = [523, 659, 784]
  melody.forEach((f, i) => osc(ac, 'square', f, 0.12, t + i * 0.12, t + i * 0.12 + 0.1, false))
}

function retroEnd(ac: AudioContext, t: number) {
  const melody = [784, 659, 523, 392]
  melody.forEach((f, i) => osc(ac, 'square', f, 0.12, t + i * 0.1, t + i * 0.1 + 0.09, false))
  // victory flourish
  setTimeout(() => {
    const at = ac.currentTime
    osc(ac, 'square', 1047, 0.15, at, at + 0.3, false)
  }, 450)
}

// ── MINIMAL theme: short click / pure sine ───────────────────────────────────

function minimalTick(ac: AudioContext, t: number) {
  osc(ac, 'sine', 1200, 0.02, t, t + 0.04)
}

function minimalStart(ac: AudioContext, t: number) {
  osc(ac, 'sine', 880, 0.2, t, t + 0.3)
}

function minimalEnd(ac: AudioContext, t: number) {
  osc(ac, 'sine', 660, 0.2, t, t + 0.25)
  osc(ac, 'sine', 880, 0.2, t + 0.3, t + 0.55)
}

// ── Public API ────────────────────────────────────────────────────────────────

const themes = {
  zen:     { tick: zenTick,     start: zenStart,     end: zenEnd },
  retro:   { tick: retroTick,   start: retroStart,   end: retroEnd },
  minimal: { tick: minimalTick, start: minimalStart, end: minimalEnd },
}

type SoundType = 'tick' | 'start' | 'end'

export async function playSound(theme: SoundTheme, type: SoundType): Promise<void> {
  try {
    await resumeCtx()
    const ac = getCtx()
    themes[theme][type](ac, ac.currentTime)
  } catch {
    // Audio blocked by browser policy — silently ignore
  }
}

export function resumeAudio(): Promise<void> {
  return resumeCtx()
}
