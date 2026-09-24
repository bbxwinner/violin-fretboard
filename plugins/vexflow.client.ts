import * as VexFlow from 'vexflow'

let retry = 0
async function loadVexflowModule() {
  try {
    return await import('vexflow')
  } catch (e) {
    // font loading can transiently fail on slow networks; retry once
    if (retry < 1) {
      retry += 1
      return loadVexflowModule()
    }
    throw e
  }
}

export default defineNuxtPlugin(async () => {
  const X = await loadVexflowModule()
  if (typeof X.setFonts === 'function') {
    X.setFonts('Bravura', 'Academico')
  } else if (typeof X.Flow?.setFonts === 'function') {
    X.Flow.setFonts('Bravura', 'Academico')
  }
  return {
    provide: { vexflow: X },
  }
})