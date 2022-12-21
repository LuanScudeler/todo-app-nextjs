import { phrases } from './phrases'
import create from 'zustand'

export const useStore = create<Store>((set) => ({
  phrases,
  editTitle(newTitle: string) {
    set((state) => ({ phrases: { ...state.phrases, titleText: newTitle } }))
  },
}))

interface Store {
  phrases: Record<string, string>
  editTitle: (newTitle: string) => void
}
