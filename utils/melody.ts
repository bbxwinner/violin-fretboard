import { Cl, ga } from './keySignatures'
import { Tu, ur, hg } from './notes'

export const fg = 'melodyInventory'

export function newMelodyId() {
  return new Date().getTime()
}

export function loadMelodyInventory() {
  const e = window.localStorage.getItem(fg) || '{}'
  let i
  try {
    i = JSON.parse(e)
  } catch (n) {
    console.error(n)
  }
  return i || {}
}

export function saveMelodyInventory(t: Record<string, unknown>) {
  window.localStorage.setItem(fg, JSON.stringify(t))
}

export function ticksToMilliseconds(t: number, e: number, i = 5e5) {
  const s = 6e4 / (6e7 / i) / e
  return t * s
}

export function getMelodyTrackTotalMs(track: { ticksPerBeat?: number; events?: any[] }, events: any[]) {
  const n = track?.ticksPerBeat || 480
  const o = events.filter((r) => r.type === 'noteOn' || r.type === 'noteOff').reduce((r, u) => (r += u.deltaTime), 0)
  const a = events.find((r) => r.type === 'setTempo')?.microsecondsPerBeat
  return ticksToMilliseconds(o, n, a)
}

export function getMelodyTrackNumNotes(events: any[]) {
  return events.filter((i) => i.type === 'noteOn').length
}

export function getKeySignatureName(key: string) {
  const i = Cl[key]
  return i.name.replace(/b/, '♭').replace('#', '♯') + ' ' + (i.type === 'major' ? '大調' : '小調')
}

export function getKeySignatureKeys(events: any[]) {
  const i = new Set<string>()
  events.forEach((n) => {
    if (n.type === 'keySignature' && n.key !== undefined && n.scale !== undefined) {
      const o = n.key
      const a = n.scale
      if (ga[o]) i.add(ga[o][a])
    }
  })
  if (i.size === 0) i.add('C0')
  return Array.from(i)
}

export function getFlattenFingerboard() {
  const e = []
  for (let i = 0; i < Tu[0].length; i++) {
    const n = []
    for (let o = 0; o < 4; o++) n.push({ ...Tu[o][i], info: ur[Tu[o][i].key] })
    e.push(n)
  }
  return e
}

export function midiToNote(midi: number) {
  return hg[midi]
}

export function getNoteDetail(note: string) {
  return ur[note]
}