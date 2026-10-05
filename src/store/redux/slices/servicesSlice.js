import { createSlice } from '@reduxjs/toolkit'

const servicesSlice = createSlice({
  name: 'services',
  initialState: { 
    activeCategory: 'all',
    activeServiceId: null,
  },
  reducers: {
    setCategory: (state, action) => {
      state.activeCategory = action.payload
    },
    openService: (state, action) => {
      state.activeServiceId = action.payload
    },
    closeService: (state) => {
      state.activeServiceId = null
    }
  },
})

export const { setCategory, openService, closeService } = servicesSlice.actions
export default servicesSlice.reducer
