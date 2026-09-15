import { createSlice } from '@reduxjs/toolkit'

const WELCOME = {
  id: 'welcome',
  sender: 'bot',
  text: "Hi! I'm QuickBot 👋 Ask me about our services, pricing, or how to get a quote.",
}

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    open: false,
    language: 'en',
    messages: [WELCOME],
  },
  reducers: {
    toggleChat: (state) => {
      state.open = !state.open
    },
    setLanguage: (state, action) => {
      state.language = action.payload
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload)
    },
  },
})

export const { toggleChat, setLanguage, addMessage } = chatSlice.actions
export default chatSlice.reducer
