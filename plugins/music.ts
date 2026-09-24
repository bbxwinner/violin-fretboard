import { __mmToKey, Es, sh, wu, rh, iC, mg, nC, oC } from '../utils/music'

export default defineNuxtPlugin(() => {
  const t = (key: string, params?: Record<string, unknown>) => {
    const { t: translate } = useI18n()
    return translate(key, params)
  }
  return {
    provide: {
      getTranslatedModesOptions: () => [
        { label: t('board_unspecified'), value: null },
        ...Object.keys(Es).flatMap((i) => {
          const n = t('board_note_major', { note: wu(i) })
          const o = t('board_note_minor', { note: wu(Es[i].relativeMinor) })
          return [
            { label: n, value: i },
            { label: o, value: Es[i].relativeMinor.toLowerCase() },
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
        const n = iC[i.substr(0, 1)]
        const o = mg[i.substr(-1)] || ''
        return `${n}${o}`
      },
      getAltPitch: rh,
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
        const a = Es[__mmToKey(o)].pitches
        return !(a.includes(i) || a.includes(n))
      },
      getPurePitchInCurrentMode: (i: string, n: string, o: string | null) => {
        if (!o) return null
        const a = Es[__mmToKey(o)].pitches
        return a.includes(i) ? i.substr(0, 1) : n && a.includes(n) ? n.substr(0, 1) : null
      },
    },
  }
})