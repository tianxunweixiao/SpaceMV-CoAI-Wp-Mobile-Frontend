import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const INIT_STATE = {
  selMenuIdx: 0,
  open: false
}

const userSlice = createSlice({
  name: 'menu',
  initialState: INIT_STATE,
  reducers: {
    setMenuIdx(state, action: PayloadAction<number>) {
      state.selMenuIdx = action.payload
      // 滚动到顶部
      window.scrollTo(0, 0)
      state.open = false
    },
    setMenuOpen(state, action: PayloadAction<boolean>) {
      state.open = action.payload
    }
  }
})

export const { setMenuIdx, setMenuOpen } = userSlice.actions

export default userSlice.reducer
