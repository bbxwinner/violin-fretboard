import {
  getFifthsStringSemitoneNotes,
  getFifthsSemitoneNoteInfo,
  getFifthsDisplayPitchSymbol,
  getFifthsPitchSolfege,
  getFifthsEnharmonicDisplayPitch,
  getFifthsModeNotes,
  getFifthsRelativeMinor,
  getFifthsRelativeMinorDisplay,
  getFifthsRelativeMinorScaleVariants,
  getFifthsModeAccidentalLabel,
  getFifthsModePitchClasses,
  isFifthsSemitoneNoteInMode,
  fifthsNaturalNotes,
  fifthsCircleModes,
} from '../utils/fifths'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      getFifthsStringSemitoneNotes,
      getFifthsSemitoneNoteInfo,
      getFifthsDisplayPitchSymbol,
      getFifthsPitchSolfege,
      getFifthsEnharmonicDisplayPitch,
      getFifthsModeNotes,
      getFifthsRelativeMinor,
      getFifthsRelativeMinorDisplay,
      getFifthsRelativeMinorScaleVariants,
      getFifthsModeAccidentalLabel,
      getFifthsModePitchClasses,
      isFifthsSemitoneNoteInMode,
      fifthsNaturalNotes,
      fifthsCircleModes: fifthsCircleModes(),
    },
  }
})