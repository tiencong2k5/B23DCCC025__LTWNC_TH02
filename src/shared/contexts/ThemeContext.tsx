import { createContext, useContext } from 'react'

export type Theme = 'light' | 'dark'

export interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export function useTheme(): ThemeContextValue {
  const themeContext = useContext(ThemeContext)
  if (!themeContext) throw new Error('useTheme phải được dùng bên trong ThemeProvider')
  return themeContext
}
