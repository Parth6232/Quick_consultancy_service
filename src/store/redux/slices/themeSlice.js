import { createSlice } from '@reduxjs/toolkit'

const getInitial = () => {
  if (typeof window === 'undefined') return 'light'
  const stored = localStorage.getItem('theme')
  if (stored === 'dark' || stored === 'light') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const applyToDom = (mode) => {
  if (typeof document === 'undefined') return
  document.documentElement.classList.toggle('dark', mode === 'dark')
  localStorage.setItem('theme', mode)
}

const initialMode = getInitial()
applyToDom(initialMode)

const themeSlice = createSlice({
  name: 'theme',
  initialState: { mode: initialMode },
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'dark' ? 'light' : 'dark'
      applyToDom(state.mode)
    },
    setTheme: (state, action) => {
      state.mode = action.payload
      applyToDom(state.mode)
    },
  },
})

export const { toggleTheme, setTheme } = themeSlice.actions
export default themeSlice.reducer
