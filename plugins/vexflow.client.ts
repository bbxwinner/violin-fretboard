import * as VexFlow from 'vexflow'
import { vexflowFonts } from '../utils/vexflow-fonts'

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
  const X: any = await loadVexflowModule()
  if (typeof X.setFonts === 'function') {
    X.setFonts('Bravura', 'Academico')
  } else if (typeof X.Flow?.setFonts === 'function') {
    X.Flow.setFonts('Bravura', 'Academico')
  }
  // The canvas renderer draws music glyphs with fillText, so the font faces
  // must be registered (FontFace API) before any staff can be drawn.
  let fontsReady: Promise<unknown> = Promise.resolve()
  const Font: any = X.Font
  if (typeof Font?.load === 'function') {
    const loads = vexflowFonts.map((f) => Font.load(f.name, f.url, f.options).catch((err: unknown) => {
      console.error('Failed to load VexFlow font:', f.name, err)
      return null
    }))
    fontsReady = Promise.all(loads).then(async () => {
      // 确认字体已可用于文本测量（VexFlow 用 measureText 计算调号/音符的 x 位置，
      // 若测量时字体未就绪会退回后备字体，导致调号与谱号重叠）
      try {
        await (document as any).fonts?.load('30pt Bravura')
        await (document as any).fonts?.load('30pt Academico')
      } catch {
        /* ignore */
      }
    })
  }
  return {
    provide: {
      vexflow: X,
      vexflowFontsReady: fontsReady,
    },
  }
})
