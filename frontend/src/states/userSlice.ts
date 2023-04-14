import { createSlice, Slice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    userId: 0,
    userName: "test",
    likedRecipes: [],
  },
  reducers: {
    updateId: (state, action) => {
      state.userId = action.payload;
    },
    updateName: (state, action) => {
      state.userName = action.payload;
    },
    updateRecipes: (state, action) => {
      state.likedRecipes = action.payload;
    },
  },
});

export const { updateName, updateRecipes } = userSlice.actions;

export const selectName = (state: any) => state.user.userName;
export const selectId = (state: any) => state.user.userId;

export default userSlice.reducer;
