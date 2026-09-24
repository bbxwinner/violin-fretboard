import {
  newMelodyId,
  loadMelodyInventory,
  saveMelodyInventory,
  ticksToMilliseconds,
  getMelodyTrackTotalMs,
  getMelodyTrackNumNotes,
  getKeySignatureName,
  getKeySignatureKeys,
  getFlattenFingerboard,
  midiToNote,
  getNoteDetail,
} from '../utils/melody'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      addMelody: (name: string, parsed: unknown) => {
        const n = loadMelodyInventory()
        const o = newMelodyId()
        n[o] = { version: 0, name, parsed }
        saveMelodyInventory(n)
        return o
      },
      getAllMelodiesDict: () => loadMelodyInventory(),
      getMelody: (id: string | number) => loadMelodyInventory()[id],
      deleteMelody: (id: string | number) => {
        const i = loadMelodyInventory()
        delete i[id]
        saveMelodyInventory(i)
      },
      getMelodyTrackTotalMs,
      ticksToMilliseconds,
      getMelodyTrackNumNotes,
      getKeySignatureName,
      getkeySignatureKeys: getKeySignatureKeys,
      getFlattenFingerboard,
      midiToNote,
      getNoteDetail,
    },
  }
})