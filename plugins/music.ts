import { __mmToKey, Es, sh, wu, rh, iC, mg, nC, oC } from '../utils/music'

export default defineNuxtPlugin(() => {
  const t = (key: string, params: Record<string, unknown> = {}) => {
    const { t: translate } = useI18n()
    return translate(key, params)
  }
  return {
    provide: {
      getTranslatedModesOptions: () => [
        { label: t('board_unspecified'), value: null },
        ...(Object.keys(Es) as (keyof typeof Es)[]).flatMap((key) => {
          const entry = Es[key]
          const n = t('board_note_major', { note: wu(key) })
          const o = t('board_note_minor', { note: wu(entry.relativeMinor).toLowerCase() })
          return [
            { label: n, value: key },
            { label: o, value: entry.relativeMinor.toLowerCase() },
          ]
        }),
      ],
      getTranslatedDisplayOptions: (i: Record<string, unknown>) =>
        Object.entries(i)
          .filter(([o]) => !isNaN(Number(o)))
          .map(([o, a]) => [Number(o), a] as [number, string])
          .map((o) => ({ label: t('board_display_option_' + o[1]), value: o[0] })),
      getDisplayPitch: wu,
      getDisplaySolfege: (i: string) => {
        const n = iC[i.charAt(0) as keyof typeof iC]
        const o = mg[i.charAt(i.length - 1) as keyof typeof mg] || ''
        return `${n}${o}`
      },
      getAltPitch: rh,
      getPreferredPitch: (i: string, n: string | null, mode: string | null) => {
        if (!n) return i
        if (!mode) return null
        const key = __mmToKey(mode)
        if (!key) return i
        const pitches = Es[key as keyof typeof Es].pitches
        if (pitches.includes(i)) return i
        if (pitches.includes(n)) return n
        const sharps = pitches.filter((p) => p.includes('#')).length
        const flats = pitches.filter((p) => p.includes('b')).length
        if (sharps > flats) return i
        if (flats > sharps) return n
        return i
      },
      getFrequency: (i: number, n: string, o: number) => i * Math.pow(sh, oC('A', 4, n, o)),
      getPositionOnString: (i: number, n: string, o: number, a: number, s?: number) => {
        const r = o * Math.pow(sh, i)
        const [u, c] = nC(n, a, i)
        const l = rh(u)
        const d = o / r
        let f
        if (s && i > 0 && n !== 'A') f = s / r
        else f = d
        return {
          pitch: u,
          altPitch: l,
          octave: c,
          freq: s && i === 0 && n !== 'A' ? s : r,
          position: {
            percentage: parseFloat((f * 100).toFixed(2)),
            raw: f,
          },
          standardPosition: {
            percentage: parseFloat((d * 100).toFixed(2)),
            raw: d,
          },
        }
      },
      isNoteHiddenInCurrentMode: (i: string, n: string, o: string | null) => {
        if (!o) return false
        const a = Es[__mmToKey(o) as keyof typeof Es].pitches
        return !(a.includes(i) || a.includes(n))
      },
      getPurePitchInCurrentMode: (i: string, n: string, o: string | null) => {
        if (!o) return null
        const a = Es[__mmToKey(o) as keyof typeof Es].pitches
        return a.includes(i) ? i.substr(0, 1) : n && a.includes(n) ? n.substr(0, 1) : null
      },
    },
  }
})