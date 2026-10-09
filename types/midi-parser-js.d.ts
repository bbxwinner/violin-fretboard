declare module 'midi-parser-js' {
  export interface MidiEvent {
    type: string
    [key: string]: unknown
  }
  export interface MidiTrack {
    event: MidiEvent[]
    name?: string
    instrument?: number
  }
  export interface MidiHeader {
    ticksPerBeat: number
    [key: string]: unknown
  }
  export interface MidiFile {
    header: MidiHeader
    track: MidiTrack[]
    [key: string]: unknown
  }
  export interface MidiParser {
    parse(data: Uint8Array | number[] | ArrayBuffer): MidiFile
  }
  const MidiParser: MidiParser
  export default MidiParser
}
