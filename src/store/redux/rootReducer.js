import { combineReducers } from '@reduxjs/toolkit'
import themeReducer from './slices/themeSlice'
import faqReducer from './slices/faqSlice'
import servicesReducer from './slices/servicesSlice'
import chatReducer from './slices/chatSlice'
import authReducer from './slices/authSlice'
import { apiSlice } from './apiSlice'

const rootReducer = combineReducers({
  theme: themeReducer,
  faq: faqReducer,
  services: servicesReducer,
  chat: chatReducer,
  auth: authReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
})

export default rootReducer
