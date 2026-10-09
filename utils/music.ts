export const TP = 500
export const wP = 5000
export const CP = 1
export const xP = 60
export const sh = Math.pow(2, 1 / 12)
export const Xn = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
export const eC = {
  'A#': 'Bb',
  'C#': 'Db',
  'D#': 'Eb',
  'F#': 'Gb',
  'G#': 'Ab',
}
export const iC = {
  C: 'Do',
  D: 'Re',
  E: 'Mi',
  F: 'Fa',
  G: 'So',
  A: 'La',
  B: 'Si',
}
export const mg = {
  '#': '♯',
  b: '♭',
}
export const Es = {
  C: { relativeMinor: 'A', pitches: ['C', 'D', 'E', 'F', 'G', 'A', 'B'] },
  G: { relativeMinor: 'E', pitches: ['G', 'A', 'B', 'C', 'D', 'E', 'F#'] },
  D: { relativeMinor: 'B', pitches: ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'] },
  A: { relativeMinor: 'F#', pitches: ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'] },
  E: { relativeMinor: 'C#', pitches: ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#'] },
  B: { relativeMinor: 'G#', pitches: ['B', 'C#', 'D#', 'E', 'F#', 'G#', 'A#'] },
  'F#': { relativeMinor: 'D#', pitches: ['F#', 'G#', 'A#', 'B', 'C#', 'D#', 'E#'] },
  'C#': { relativeMinor: 'A#', pitches: ['C#', 'D#', 'E#', 'F#', 'G#', 'A#', 'B#'] },
  F: { relativeMinor: 'D', pitches: ['F', 'G', 'A', 'Bb', 'C', 'D', 'E'] },
  Bb: { relativeMinor: 'G', pitches: ['Bb', 'C', 'D', 'Eb', 'F', 'G', 'A'] },
  Eb: { relativeMinor: 'C', pitches: ['Eb', 'F', 'G', 'Ab', 'Bb', 'C', 'D'] },
  Ab: { relativeMinor: 'F', pitches: ['Ab', 'Bb', 'C', 'Db', 'Eb', 'F', 'G'] },
  Db: { relativeMinor: 'Bb', pitches: ['Db', 'Eb', 'F', 'Gb', 'Ab', 'Bb', 'C'] },
  Gb: { relativeMinor: 'Eb', pitches: ['Gb', 'Ab', 'Bb', 'Cb', 'Db', 'Eb', 'F'] },
  Cb: { relativeMinor: 'Ab', pitches: ['Cb', 'Db', 'Eb', 'Fb', 'Gb', 'Ab', 'Bb'] },
}
export const DP = ['#ddd', '#0066cc', '#00cc66', '#ff0066']

export const U = {
  0: 'Pitch',
  1: 'Solfege',
  2: 'Frequency',
  3: 'Octave',
  4: 'StringLengthPercentage',
  5: 'SemitonePositionIndex',
  6: 'PianoBlackKey',
  7: 'Arpeggio',
}

export function __mmToKey(t: string | null): keyof typeof Es | null {
  if (!t) return null
  if (t in Es) return t as keyof typeof Es
  const m = Object.entries(Es).find(([, v]) => v.relativeMinor.toLowerCase() === t)
  return m ? (m[0] as keyof typeof Es) : null
}
export function wu(t: string): string {
  const e = mg[t.charAt(t.length - 1) as keyof typeof mg] || ''
  return `${t.charAt(0)}${e}`
}
export function rh(t: string): string | null {
  return (eC as Record<string, string | undefined>)[t] || null
}
export function nC(t: string, e: number, i: number): [string, number] {
  const o = Xn.indexOf(t) + i
  const a = e + Math.floor(o / Xn.length)
  return [Xn[o % Xn.length] as string, a]
}
export function oC(t: string, e: number, i: string, n: number): number {
  const o = Xn.indexOf(t)
  const s = Xn.indexOf(i) - o
  return (n - e) * Xn.length + s
}