export const fifthsNaturalNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
export const majorScaleIntervals = [2, 2, 1, 2, 2, 2, 1]
export const majorDegrees = [0, 2, 4, 5, 7, 9, 11]

const notes: Record<string, number> = fifthsNaturalNotes.reduce(
  (acc: Record<string, number>, n, i) => {
    if (i === 0) {
      acc[n] = 0
      return acc
    }
    const prev = fifthsNaturalNotes[i - 1]
    acc[n] = acc[prev] + majorScaleIntervals[i - 1]
    return acc
  },
  {},
)

export function parseNatural(t: string | null | undefined): string | null {
  if (!t) return null
  const e = String(t).trim().toUpperCase()
  return fifthsNaturalNotes.includes(e) ? e : null
}

export function parseNote(t: string | null | undefined): { letter: string; accidental: string } | null {
  if (!t) return null
  const i = String(t).trim().match(/^([A-Ga-g])([#b]*)$/)
  if (!i) return null
  const n = i[1].toUpperCase()
  const o = i[2] || ''
  return { letter: n, accidental: o }
}

export function toPitchClass(t: string | null | undefined): number | null {
  const e = parseNote(t)
  if (!e) return null
  const i = notes[e.letter]
  const n = e.accidental.split('').reduce((o, a) => o + (a === '#' ? 1 : -1), 0)
  return (i + n + 120) % 12
}

export function getFifthsDisplayPitchSymbol(t: string | null | undefined, lower = false): string {
  const i = parseNote(t)
  if (!i) return ''
  const n = lower ? i.letter.toLowerCase() : i.letter
  const o = i.accidental.replaceAll('#', '♯').replaceAll('b', '♭')
  return `${n}${o}`
}

export function getFifthsPitchSolfege(t: string | null | undefined): string {
  const e = parseNote(t)
  if (!e) return ''
  const i = { C: 'Do', D: 'Re', E: 'Mi', F: 'Fa', G: 'Sol', A: 'La', B: 'Si' }[e.letter]
  if (!i) return ''
  const n = e.accidental.replaceAll('#', '♯').replaceAll('b', '♭')
  return `${i}${n}`
}

export function addSemitones(t: string, e: number): string {
  const i = parseNote(t)
  if (!i || !Number.isFinite(e)) return t
  const o = i.accidental.split('').reduce((a, s) => a + (s === '#' ? 1 : -1), 0) + e
  return o === 0
    ? i.letter
    : o > 0
      ? `${i.letter}${'#'.repeat(o)}`
      : `${i.letter}${'b'.repeat(Math.abs(o))}`
}

export function enharmonicOf(t: string): string | null {
  const e = parseNote(t)
  if (!e || !e.accidental) return null
  const i = toPitchClass(t)
  if (i === null) return null
  const n = fifthsNaturalNotes
    .flatMap((u) => [u, `${u}#`, `${u}b`])
    .filter((u) => (u === t ? false : toPitchClass(u) === i))
  if (!n.length) return null
  const o = e.accidental.includes('#')
  const a = e.accidental.includes('b')
  const s = n.filter((u) => {
    const c = parseNote(u)
    return c ? (o ? c.accidental.includes('b') : a ? c.accidental.includes('#') : false) : false
  })
  const r = s.length ? s : n
  return (
    r.sort((u, c) => {
      const l = parseNote(u)
      const d = parseNote(c)
      const f = l?.accidental.length || 0
      const h = d?.accidental.length || 0
      return f !== h ? f - h : u.localeCompare(c)
    })[0] || null
  )
}

export function getFifthsEnharmonicDisplayPitch(t: string, lower = false): string | null {
  const i = enharmonicOf(t)
  return i ? getFifthsDisplayPitchSymbol(i, lower) : null
}

export function getFifthsModeNotes(t: string): string[] {
  const e = parseNote(t)
  if (!e) return []
  const i = toPitchClass(t)
  const n = fifthsNaturalNotes.indexOf(e.letter)
  if (i === null || n < 0) return []
  return majorDegrees.map((o, a) => {
    const s = fifthsNaturalNotes[(n + a) % fifthsNaturalNotes.length]
    const r = (i + o) % 12
    const u = notes[s]
    let c = (r - u + 12) % 12
    if (c > 6) c -= 12
    return c === 0 ? s : c > 0 ? `${s}${'#'.repeat(c)}` : `${s}${'b'.repeat(Math.abs(c))}`
  })
}

export function getFifthsRelativeMinor(t: string): string | null {
  const e = getFifthsModeNotes(t)
  if (!e.length) return null
  const i = e[5]
  return i ? `${i}m` : null
}

export function getFifthsRelativeMinorDisplay(t: string): string | null {
  const e = getFifthsModeNotes(t)
  if (!e.length) return null
  const i = e[5]
  return i ? getFifthsDisplayPitchSymbol(i, true) : null
}

export function getFifthsRelativeMinorScaleVariants(t: string): Record<string, string[]> {
  const e = getFifthsModeNotes(t)
  if (e.length < 7) {
    return { natural: [], harmonic: [], melodicAscending: [], melodicDescending: [], melodicDescendingByDegree: [] }
  }
  const i = [e[5], e[6], e[0], e[1], e[2], e[3], e[4]]
  const n = [...i]
  n[6] = addSemitones(n[6], 1)
  const o = [...i]
  o[5] = addSemitones(o[5], 1)
  o[6] = addSemitones(o[6], 1)
  const a = [...i].reverse()
  const s = [...a].reverse()
  return { natural: i, harmonic: n, melodicAscending: o, melodicDescending: a, melodicDescendingByDegree: s }
}

export function countModeAccidentals(t: string): { sharpCount: number; flatCount: number } {
  const e = getFifthsModeNotes(t)
  if (!e.length) return { sharpCount: 0, flatCount: 0 }
  let i = 0
  let n = 0
  e.forEach((o) => {
    const a = parseNote(o)
    if (!a || !a.accidental) return
    a.accidental.split('').forEach((s) => {
      if (s === '#') i += 1
      else if (s === 'b') n += 1
    })
  })
  return { sharpCount: i, flatCount: n }
}

export function getFifthsModePitchClasses(t: string): number[] {
  const e = getFifthsModeNotes(t)
  return e.length ? e.map((i) => toPitchClass(i)).filter((i) => i !== null) as number[] : []
}

export function getFifthsModeAccidentalLabel(t: string): string {
  const { sharpCount: e, flatCount: i } = countModeAccidentals(t)
  return e === 0 && i === 0 ? '♮' : e > 0 ? `${e}♯` : `${i}♭`
}

export function fifthsCircleModes(): string[] {
  const t = fifthsNaturalNotes.flatMap((o) => [o, `${o}#`, `${o}b`])
  const e = (o: string, a: number) => {
    const s = t
      .filter((r) => {
        const { sharpCount: u, flatCount: c } = countModeAccidentals(r)
        return o === '#' ? u === a && c === 0 : c === a && u === 0
      })
      .sort((r, u) => {
        const c = parseNote(r)?.accidental.length || 0
        const l = parseNote(u)?.accidental.length || 0
        return c !== l ? c - l : r.localeCompare(u)
      })
    return s[0] || null
  }
  const i = Array.from({ length: 7 }, (o, a) => e('#', a)).filter(Boolean)
  const n = Array.from({ length: 5 }, (o, a) => e('b', 5 - a)).filter(Boolean)
  return [...i, ...n]
}

export function isFifthsSemitoneNoteInMode(t: { isNatural: boolean; natural: string | null; sharp: string | null; flat: string | null }, e: string): boolean {
  const i = getFifthsModeNotes(e)
  if (!i.length) return false
  const n = i.map((a) => toPitchClass(a)).filter((a) => a !== null)
  return (t.isNatural ? [t.natural] : [t.sharp, t.flat].filter(Boolean)).some((a) => {
    const s = toPitchClass(a)
    return s !== null && (n as number[]).includes(s)
  })
}

export function getFifthsSemitoneNoteInfo(t: string, e: number): {
  semitone: number
  isNatural: boolean
  natural: string | null
  sharp: string | null
  flat: string | null
} {
  const n = (notes[t] + e) % 12
  const o = fifthsNaturalNotes.find((r) => notes[r] === n) || null
  if (o) {
    return { semitone: e, isNatural: true, natural: o, sharp: null, flat: null }
  }
  const a = fifthsNaturalNotes.find((r) => (n - notes[r] + 12) % 12 === 1)
  const s = fifthsNaturalNotes.find((r) => (notes[r] - n + 12) % 12 === 1)
  return {
    semitone: e,
    isNatural: false,
    natural: null,
    sharp: a ? `${a}#` : null,
    flat: s ? `${s}b` : null,
  }
}

export function getFifthsStringSemitoneNotes(t: string, e = 30): ReturnType<typeof getFifthsSemitoneNoteInfo>[] {
  const i = parseNatural(t)
  if (!i) return []
  const n = Number.isFinite(e) ? Math.max(1, Math.floor(e)) : 30
  return Array.from({ length: n }, (o, a) => getFifthsSemitoneNoteInfo(i, a))
}