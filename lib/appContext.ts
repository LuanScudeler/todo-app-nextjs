import { phrases } from './phrases'
import create from 'zustand'

export const useStore = create<Store>((set) => ({
  phrases,
}))

interface Store {
  phrases: Record<string, string>
}
