import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './redux/rootReducer'
import { apiSlice } from './redux/apiSlice'

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
})

export default store
