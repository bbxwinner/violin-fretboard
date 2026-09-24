function sendGAClickEvent(category: string, label?: string, value?: number | string) {
  const { gtag } = useGtag()
  gtag('event', 'click', { event_category: category, event_label: label, value })
}

export default defineNuxtPlugin(() => {
  const e = (a: string, s?: string, r?: number | string) => {
    sendGAClickEvent(a, s, r)
  }
  return {
    provide: {
      sendGAClickEvent: e,
      sendGAClickPreferenceEvent: (a: string, s?: string) => e('preference', a, s),
      sendGAClickNavigationEvent: (a: string, s?: string) => e('navigation', a, s),
      sendGAClickHelpEvent: (a: string, s?: string) => e('help', a, s),
    },
  }
})