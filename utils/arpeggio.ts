import { Es, __mmToKey, rh } from './music'

const Oe = [0, 2, 4, 5, 7, 9, 11]

export function noteToMidi(name: string): number | null {
  const m = /^([A-Ga-g])(#{1,2}|b{1,2}|x{1,2}|)(-?\d+)$/.exec(name)
  if (!m) return null
  const letter = m[1].toUpperCase()
  const u = (letter.charCodeAt(0) - 65 + 3) % 7
  let alt = 0
  for (const ch of m[2]) {
    if (ch === '#') alt++
    else if (ch === 'b') alt--
    else if (ch === 'x') alt += 2
  }
  const octave = parseInt(m[3], 10)
  const midi = Oe[u] + alt + 12 * (octave + 1)
  return midi >= 0 && midi <= 127 ? midi : null
}

export function getArpeggioPitchesFromMode(m: string | null): string[] {
  if (!m) return []
  const k = __mmToKey(m)
  if (!k || !Es[k]) return []
  const scale = Es[k].pitches
  if (Es[m]) {
    return [scale[0], scale[2], scale[4]]
  }
  const rootStr = m.toUpperCase()
  let idx = scale.findIndex((p) => p.toUpperCase() === rootStr)
  if (idx === -1) {
    idx = scale.findIndex((p) => {
      const alt = rh(p)
      return alt && alt.toUpperCase() === rootStr
    })
  }
  if (idx === -1) idx = 0
  return [scale[idx], scale[(idx + 2) % 7], scale[(idx + 4) % 7]]
}
