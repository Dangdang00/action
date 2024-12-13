import {configureStore} from '@reduxjs/toolkit'
import rootReducer from '../actions'

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false}),
})
