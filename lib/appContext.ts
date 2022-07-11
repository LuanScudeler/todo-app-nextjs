import { createContext } from 'react'

export const AppContext = createContext<AppContextValue>({ phrases: {} })

interface AppContextValue {
  phrases: Record<string, string>
}
