import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface State {
  userId?: string;
  name?: string;
  likedRecipes: [];
}

// API calls
export const login = createAsyncThunk('user/login', async (input: {name: string}) => {
  try {
    const {name} = input;
    const response = await axios.post<GetUserResponse>(`${API_PREFIX}/users/${name}`)
  }
})

export const userSlice = createSlice({
  name: "user",
  initialState: {
    likedRecipes: [],
  } as State,
  reducers: {
    updateId: (state, action) => {
      state.userId = action.payload;
    },
    updateName: (state, action) => {
      state.name = action.payload;
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
