
type TickListener = () => void 
type TickListenerRegistration = string

const tickListeners: Map<string, TickListener> = new Map()

var regAutoinc = 0

export function registerTickListener(t: TickListener) {
  const key = "tickListener" + (regAutoinc++)
  tickListeners.set(key, t)
  return key
}

export function unregisterTickListener(k: TickListenerRegistration) {
  tickListeners.delete(k)
}

setInterval(() => {
  Array.from(tickListeners.values()).forEach(v => {
    v()
  })
}, 20)
