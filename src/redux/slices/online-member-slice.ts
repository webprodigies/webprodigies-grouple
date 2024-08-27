import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type InitialStateProps = {
  members: {
    id: string
  }[]
}

const InitialState: InitialStateProps = {
  members: [],
}

export const OnlineTracking = createSlice({
  name: "online",
  initialState: InitialState,
  reducers: {
    onOnline: (state, action: PayloadAction<InitialStateProps>) => {
      //check for duplicates
      const list = state.members.find((data: any) =>
        action.payload.members.find((payload: any) => data.id === payload.id),
      )

      if (!list) state.members = [...state.members, ...action.payload.members]
    },
    onOffline: (state, action: PayloadAction<InitialStateProps>) => {
      //look for member and remove them
      state.members = state.members.filter((member) =>
        action.payload.members.find((m) => member.id !== m.id),
      )
    },
  },
})

export const { onOffline, onOnline } = OnlineTracking.actions
export default OnlineTracking.reducer
