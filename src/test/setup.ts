import '@testing-library/jest-dom'

const store = new Map<string, string>()
const mockStorage: Storage = {
  get length() {
    return store.size
  },
  clear() {
    store.clear()
  },
  getItem(key: string) {
    return store.get(key) ?? null
  },
  key(index: number) {
    return Array.from(store.keys())[index] ?? null
  },
  removeItem(key: string) {
    store.delete(key)
  },
  setItem(key: string, value: string) {
    store.set(key, value)
  },
}

Object.defineProperty(window, 'localStorage', {
  value: mockStorage,
  configurable: true,
})

Object.defineProperty(globalThis, 'localStorage', {
  value: mockStorage,
  configurable: true,
})
