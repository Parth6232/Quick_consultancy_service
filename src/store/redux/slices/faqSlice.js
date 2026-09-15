import { createSlice } from '@reduxjs/toolkit'

const faqSlice = createSlice({
  name: 'faq',
  initialState: { openIndex: null },
  reducers: {
    toggleFaq: (state, action) => {
      state.openIndex = state.openIndex === action.payload ? null : action.payload
    },
  },
})

export const { toggleFaq } = faqSlice.actions
export default faqSlice.reducer
