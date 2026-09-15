import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  token: localStorage.getItem('qcs_token') || null,
  user: JSON.parse(localStorage.getItem('qcs_user')) || null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { token, user } = action.payload
      state.token = token
      state.user = user
      localStorage.setItem('qcs_token', token)
      localStorage.setItem('qcs_user', JSON.stringify(user))
    },
    logout: (state) => {
      state.token = null
      state.user = null
      localStorage.removeItem('qcs_token')
      localStorage.removeItem('qcs_user')
    },
  },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer
