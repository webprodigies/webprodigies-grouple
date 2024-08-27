//this is our redux store
"use client"
import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { TypedUseSelectorHook, useSelector } from "react-redux"
import chatReducer from "./slices/chats-slices"
import infiniteScrollReducer from "./slices/infinite-scroll-slice"
import onlineTrackingReducer from "./slices/online-member-slice"
import searchReducer from "./slices/search-slice"

const rootReducer = combineReducers({
  //add all your reducers here
  searchReducer,
  onlineTrackingReducer,
  infiniteScrollReducer,
  chatReducer,
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

//we export these type definitions
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

//this useAppSelector has type definitions added
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
