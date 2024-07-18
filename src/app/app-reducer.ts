import { Dispatch } from "redux"
import { authAPI } from "../api/todolists-api"
import { setIsLoggedIn } from "features/Login/auth-reducer"
import { AppDispatch, AppThunk } from "app/store"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

// const initialState: InitialStateType = {
//   status: "idle",
//   error: null,
//   isInitialized: false
// }
const slice = createSlice({
  name: "app",
  initialState: {
    status: "idle" as RequestStatusType,
    error: null as string | null,
    isInitialized: false,
  },
  reducers: {
    setAppError: (state, action: PayloadAction<{ error: string | null }>) => {
      state.error = action.payload.error
    },
    setAppStatus: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
      state.status = action.payload.status
    },
    setAppInitialized: (state, action: PayloadAction<{ isInitialized: boolean }>) => {
      state.isInitialized = action.payload.isInitialized
    },
  },
})
export const appReducer = slice.reducer
export const { setAppError, setAppStatus, setAppInitialized } = slice.actions

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed"
export type InitialStateType = {
  // происходит ли сейчас взаимодействие с сервером
  status: RequestStatusType
  // если ошибка какая-то глобальная произойдёт - мы запишем текст ошибки сюда
  error: string | null
  // true когда приложение проинициализировалось (проверили юзера, настройки получили и т.д.)
  isInitialized: boolean
}

export const setAppStatusAC = (status: RequestStatusType) => ({ type: "APP/SET-STATUS", status }) as const
export const setAppInitializedAC = (value: boolean) => ({ type: "APP/SET-IS-INITIALIED", value }) as const

export const initializeAppTC = (): AppThunk => (dispatch) => {
  authAPI.me().then((res) => {
    if (res.data.resultCode === 0) {
      dispatch(setIsLoggedIn({ isLoggedIn: false }))
    } else {
    }

    dispatch(setAppInitializedAC(true))
  })
}

export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>

type ActionsType = SetAppStatusActionType | ReturnType<typeof setAppInitializedAC>
export type AppInit = ReturnType<typeof slice.getInitialState>
