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

export function __mmToKey(t) {
  if (!t) return null
  if (Es[t]) return t
  const m = Object.entries(Es).find((e) => e[1].relativeMinor.toLowerCase() === t)
  return m ? m[0] : null
}
export function wu(t) {
  const e = mg[t.substr(-1)] || ''
  return `${t.substr(0, 1)}${e}`
}
export function rh(t) {
  return eC[t] || null
}
export function nC(t, e, i) {
  let o = Xn.indexOf(t) + i
  const a = e + Math.floor(o / Xn.length)
  return [Xn[o % Xn.length], a]
}
export function oC(t, e, i, n) {
  const o = Xn.indexOf(t)
  let s = Xn.indexOf(i) - o
  return (n - e) * Xn.length + s
}