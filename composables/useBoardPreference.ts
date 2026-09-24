import { computed } from 'vue'
import { useBoardStore } from '../stores/board'
import { U } from '../utils/music'

export function useBoardPreference(key: string) {
  const store = useBoardStore()
  return computed({
    get: () => (store.preference as any)[key],
    set: (n) => {
      const app: any = useNuxtApp()
      let r = null
      if (key === 'displayOptions' && Array.isArray(n)) {
        const u = new Set(store.preference.displayOptions)
        const f = new Set(n)
        const o = [...f].filter((s) => !u.has(s))
        const s = [...u].filter((s) => !f.has(s))
        if (o.length > 0) r = `add_${o.map((s) => U[s as number]).join('_')}`
        if (s.length > 0) r = (r ? r + ',' : '') + `rm_${s.map((s) => U[s as number]).join('_')}`
      }
      store.setPreference(key, n)
      store.savePreferenceLocalStorage()
      if (r) app.$sendGAClickPreferenceEvent('pref_displayOptions_' + r)
      else if (key === 'stringLength' || key === 'semitonesPerString')
        app.$sendGAClickPreferenceEvent('pref_' + key, Number(n))
      else app.$sendGAClickPreferenceEvent('pref_' + key + '_' + n)
    },
  })
}
