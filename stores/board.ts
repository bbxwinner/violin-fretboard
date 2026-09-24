import { defineStore } from 'pinia'
import { getArpeggioPitchesFromMode, noteToMidi } from '../utils/arpeggio'
import { U, DP } from '../utils/music'

const Qe = {
  stringLength: 1500,
  modeMajor: null as string | null,
  pitchStandard: 440,
  displayOptions: [0, 3] as number[],
  semitonesPerString: 13,
  tuningJustIntonation: false,
  fingerPositionLabelColor: {} as Record<string, number>,
  volume: 80,
  noteDuration: 500,
}
const et = 'preference'
const Ie = Math.pow(2, 7 / 12)
const at = 500
const rt = 5000

let arpeggioTimer: ReturnType<typeof setInterval> | null = null

type Note = { pitch: string; octave: number } | null

export const useBoardStore = defineStore('board', {
  state: () => ({
    currentNote: null as Note,
    preference: { ...Qe },
    isPlayingArpeggio: false,
  }),
  getters: {
    currentNoteInfo: (e) => {
      if (!e.currentNote) return null
      const app: any = useNuxtApp()
      return {
        pitch: e.currentNote.pitch,
        octave: e.currentNote.octave,
        altPitch: app.$getAltPitch(e.currentNote.pitch),
        freq: app.$getFrequency(e.preference.pitchStandard, e.currentNote.pitch, e.currentNote.octave),
      }
    },
    fingerPositionLabelColorArray: (e) => {
      const t: number[] = []
      for (let n = 0; n < e.preference.semitonesPerString; n++) {
        const a = e.preference.fingerPositionLabelColor[n]
        DP[a] ? t.push(a) : t.push(0)
      }
      return t
    },
    strings: (e) => {
      const t = e.preference.pitchStandard
      return [
        { pitch: 'G', freq: t / Ie / Ie, freqJustIntonation: (t * 4) / 9, thickness: 4, octave: 3 },
        { pitch: 'D', freq: t / Ie, freqJustIntonation: (t * 2) / 3, thickness: 3, octave: 4 },
        { pitch: 'A', freq: t, freqJustIntonation: t, thickness: 2, octave: 4 },
        { pitch: 'E', freq: t * Ie, freqJustIntonation: (t * 3) / 2, thickness: 1, octave: 5 },
      ]
    },
    currentArpeggioPitches: (e) => getArpeggioPitchesFromMode(e.preference.modeMajor),
    hasDisplayOption: (e) => (t: number) => e.preference.displayOptions.includes(t),
  },
  actions: {
    setCurrentNote(note: Note) {
      const app: any = useNuxtApp()
      this.currentNote = note
      if (note) app.$sendGAClickEvent('note', note.pitch + note.octave)
    },
    setPreference(key: string, value: unknown) {
      ;(this.preference as any)[key] = value
    },
    savePreferenceLocalStorage() {
      if (import.meta.client) localStorage.setItem(et, JSON.stringify(this.preference))
    },
    toggleFingerPositionLabelColor(i: number) {
      const app: any = useNuxtApp()
      const a = ((this.preference.fingerPositionLabelColor[i] || 0) + 1) % DP.length
      if (a === 0) delete this.preference.fingerPositionLabelColor[i]
      else this.preference.fingerPositionLabelColor[i] = a
      if (a === 0 || a === 1) app.$sendGAClickPreferenceEvent(`fingerPositionLabelColor_${i}_${a > 0 ? 'on' : 'off'}`)
      app.$sendGAClickPreferenceEvent(`fingerPositionLabelColor_${i}`, a)
    },
    loadPreferenceLocalStorage() {
      if (!import.meta.client) return
      const s = localStorage.getItem(et)
      if (!s) {
        this.resetPreferenceToDefault()
        return
      }
      try {
        const t = JSON.parse(s)
        const n = this.$state.preference
        const a = {
          stringLength: typeof t.stringLength === 'number' ? t.stringLength : n.stringLength,
          modeMajor: typeof t.modeMajor === 'string' || t.modeMajor === null ? t.modeMajor : n.modeMajor,
          pitchStandard: typeof t.pitchStandard === 'number' ? t.pitchStandard : n.pitchStandard,
          semitonesPerString: typeof t.semitonesPerString === 'number' ? t.semitonesPerString : n.semitonesPerString,
          tuningJustIntonation:
            typeof t.tuningJustIntonation === 'boolean' ? t.tuningJustIntonation : n.tuningJustIntonation,
          displayOptions:
            Array.isArray(t.displayOptions) &&
            t.displayOptions.every((r: unknown) => typeof r === 'number' && r in U)
              ? t.displayOptions
              : n.displayOptions,
          fingerPositionLabelColor:
            typeof t.fingerPositionLabelColor === 'object' &&
            Object.entries(t.fingerPositionLabelColor).every(
              ([r, u]) => Number.isInteger(+r) && typeof u === 'number' && u >= 0 && u < DP.length,
            )
              ? t.fingerPositionLabelColor
              : n.fingerPositionLabelColor,
          volume: typeof t.volume === 'number' && t.volume >= 0 && t.volume <= 100 ? t.volume : n.volume,
          noteDuration:
            typeof t.noteDuration === 'number' && t.noteDuration >= 100 && t.noteDuration <= 2e3
              ? t.noteDuration
              : n.noteDuration,
        }
        this.preference = a
      } catch (err) {
        console.error('load preference error：', err)
        this.resetPreferenceToDefault()
      }
    },
    resetPreferenceToDefault() {
      const app: any = useNuxtApp()
      this.preference = { ...Qe }
      app.$sendGAClickPreferenceEvent('reset')
    },
    adjustStringLength(delta: number) {
      this.preference.stringLength = Math.max(at, Math.min(rt, this.preference.stringLength + delta))
    },
    startArpeggioPlay() {
      const pitches = this.currentArpeggioPitches
      if (!pitches || !pitches.length) return
      const app: any = useNuxtApp()
      const getPos = app.$getPositionOnString
      const justFreqOpt = this.preference.tuningJustIntonation
      const strings = this.strings
      const count = this.preference.semitonesPerString
      const arpeggioNotes: { pitch: string; octave: number; midi: number }[] = []
      const noteSet = new Set<number>()
      strings.forEach((str) => {
        const justFreq = justFreqOpt ? str.freqJustIntonation : null
        for (let i = 0; i < count; i++) {
          const info = getPos(i, str.pitch, str.freq, str.octave, justFreq)
          const match = pitches.includes(info.pitch) || (info.altPitch && pitches.includes(info.altPitch))
          if (match) {
            const pitchToUse = pitches.includes(info.pitch) ? info.pitch : info.altPitch
            const midi = noteToMidi(pitchToUse + info.octave)
            if (midi !== null && !noteSet.has(midi)) {
              noteSet.add(midi)
              arpeggioNotes.push({ pitch: pitchToUse, octave: info.octave, midi })
            }
          }
        }
      })
      arpeggioNotes.sort((x, y) => x.midi - y.midi)
      if (!arpeggioNotes.length) return
      this.stopArpeggioPlay()
      this.isPlayingArpeggio = true
      this.setCurrentNote({ pitch: arpeggioNotes[0].pitch, octave: arpeggioNotes[0].octave })
      let index = 1
      const duration = Math.max(200, this.preference.noteDuration || 500)
      arpeggioTimer = setInterval(() => {
        if (!this.isPlayingArpeggio || index >= arpeggioNotes.length) {
          this.stopArpeggioPlay()
          return
        }
        const note = arpeggioNotes[index]
        this.setCurrentNote({ pitch: note.pitch, octave: note.octave })
        index++
      }, duration)
    },
    stopArpeggioPlay() {
      if (arpeggioTimer) {
        clearInterval(arpeggioTimer)
        arpeggioTimer = null
      }
      this.isPlayingArpeggio = false
    },
    toggleArpeggioPlay() {
      if (this.isPlayingArpeggio) this.stopArpeggioPlay()
      else this.startArpeggioPlay()
    },
  },
})
