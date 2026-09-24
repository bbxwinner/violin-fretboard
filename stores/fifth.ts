export const FIFTHS_PREF_KEY = 'fifthPreference'
const xt = 640
const It = 120
const Ot = 2200
const se = [1, 2, 3, 4, 5, 6, 7]
const J = {
  1: { startRow: 0, endRow: 7 },
  2: { startRow: 3, endRow: 9 },
  3: { startRow: 5, endRow: 11 },
  4: { startRow: 7, endRow: 12 },
  5: { startRow: 8, endRow: 14 },
  6: { startRow: 12, endRow: 19 },
  7: { startRow: 14, endRow: 21 },
}

type Range = { startRow: number; endRow: number }

function Q(): Record<number, Range> {
  return se.reduce((e, o) => {
    const t = J[o]
    e[o] = { startRow: t.startRow, endRow: t.endRow }
    return e
  }, {} as Record<number, Range>)
}
function ye(e: number): number {
  const o = Math.round(e)
  return Math.max(It, Math.min(Ot, o))
}
function pe(e: unknown, o: number): number {
  const t = Number(e)
  return Number.isFinite(t) ? Math.max(0, Math.floor(t)) : o
}
function Se(e: Range | null | undefined, o: Range): Range {
  const t = pe(e?.startRow, o.startRow)
  const n = pe(e?.endRow, o.endRow)
  return { startRow: t, endRow: Math.max(t, n) }
}

export const useFifthStore = defineStore('fifth', {
  state: () => ({
    isPreferenceDialogOpen: false,
    selectedMode: 'C',
    visibleHandPositions: [1, 3] as number[],
    fingerOverlayTransitionMs: xt,
    handPositionRanges: Q(),
  }),
  getters: {
    isHandPositionVisible: (e) => (o: number) => e.visibleHandPositions.includes(o),
    getHandPositionRange: (e) => (o: number): Range => {
      const t = J[o] || { startRow: 0, endRow: 0 }
      return e.handPositionRanges[o] || t
    },
  },
  actions: {
    setPreferenceDialogOpen(v: boolean) {
      this.isPreferenceDialogOpen = v
    },
    setSelectedMode(v: string) {
      this.selectedMode = v
      this.savePreferenceLocalStorage()
    },
    setVisibleHandPositions(v: number[]) {
      const o = Array.from(new Set(v.filter((t) => Number.isInteger(t) && t > 0)))
      o.sort((t, n) => t - n)
      this.visibleHandPositions = o
      this.savePreferenceLocalStorage()
    },
    setHandPositionVisible(pos: number, v: boolean) {
      if (Number.isInteger(pos) && pos > 0) {
        if (v) {
          this.setVisibleHandPositions([...this.visibleHandPositions, pos])
          return
        }
        this.setVisibleHandPositions(this.visibleHandPositions.filter((t) => t !== pos))
      }
    },
    setFingerOverlayTransitionMs(v: number) {
      if (Number.isFinite(v)) {
        this.fingerOverlayTransitionMs = ye(v)
        this.savePreferenceLocalStorage()
      }
    },
    setHandPositionRange(pos: number, startRow: number, endRow: number) {
      if (!se.includes(pos)) return
      const n = J[pos] || { startRow: 0, endRow: 0 }
      const l = Se({ startRow, endRow }, n)
      this.handPositionRanges = { ...this.handPositionRanges, [pos]: l }
      this.savePreferenceLocalStorage()
    },
    resetHandPositionRanges() {
      this.handPositionRanges = Q()
      this.savePreferenceLocalStorage()
    },
    ensureSelectedMode(modes: string[]) {
      if (!modes.includes(this.selectedMode)) {
        this.selectedMode = modes[0] || 'C'
        this.savePreferenceLocalStorage()
      }
    },
    loadPreferenceLocalStorage() {
      if (!import.meta.client) return
      const e = localStorage.getItem(FIFTHS_PREF_KEY)
      if (!e) return
      try {
        const o = JSON.parse(e)
        if (typeof o?.selectedMode === 'string' && o.selectedMode) this.selectedMode = o.selectedMode
        if (Array.isArray(o?.visibleHandPositions))
          this.visibleHandPositions = Array.from(
            new Set(o.visibleHandPositions.filter((t: unknown) => Number.isInteger(t) && Number(t) > 0)),
          ).sort((t: number, n: number) => Number(t) - Number(n))
        if (typeof o?.fingerOverlayTransitionMs === 'number')
          this.fingerOverlayTransitionMs = ye(o.fingerOverlayTransitionMs)
        if (o?.handPositionRanges && typeof o.handPositionRanges === 'object') {
          const t = Q()
          se.forEach((n) => {
            const l = J[n]
            t[n] = Se(o.handPositionRanges[n], l)
          })
          this.handPositionRanges = t
        }
      } catch {
        /* ignore */
      }
    },
    savePreferenceLocalStorage() {
      if (!import.meta.client) return
      localStorage.setItem(
        FIFTHS_PREF_KEY,
        JSON.stringify({
          selectedMode: this.selectedMode,
          visibleHandPositions: this.visibleHandPositions,
          fingerOverlayTransitionMs: this.fingerOverlayTransitionMs,
          handPositionRanges: this.handPositionRanges,
        }),
      )
    },
  },
})
