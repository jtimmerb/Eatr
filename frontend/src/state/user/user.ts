import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import { add as addError } from "../errors/errors";
import {
  CreateUserResponse,
  CreateUserRequest,
  ListUsersResponse,
} from "../../api/users";
import { API_PREFIX } from "../../utils/config";

export interface State {
  userId?: number;
  name?: string;
  likedRecipes: [];
  pending: boolean;
  error?: string;
}

// API calls
export const login = createAsyncThunk(
  "user/login",
  async (input: { name: string }, { dispatch, rejectWithValue }) => {
    try {
      const params = input;
      const response = await axios.get<ListUsersResponse>(
        `${API_PREFIX}/users`,
        { params }
      );

      if (response.data.length === 0) {
        dispatch(
          addError({
            message: `No user found with the username ${name}`,
          })
        );
        throw new Error("User not found.");
      }

      const user = response.data[0];
      return user;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        dispatch(
          addError({
            message: err.response?.data.message
              ? err.response?.data.message
              : err.message,
          })
        );
      }
      throw err;
    }
  }
);

export const signup = createAsyncThunk(
  "user/signup",
  async (body: CreateUserRequest, { dispatch }) => {
    try {
      const response = await axios.post<CreateUserResponse>(
        `${API_PREFIX}/users`,
        body
      );

      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        dispatch(
          addError({
            message: err.response?.data.message
              ? err.response?.data.message
              : err.message,
          })
        );
      }
      throw err;
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState: {
    likedRecipes: [],
    pending: false,
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
  extraReducers: (builder) => {
    // Login
    builder.addCase(login.fulfilled, (state, { payload }) => {
      state.name = payload.name;
      state.userId = payload.userId;
    });
    builder.addCase(login.pending, (state) => {
      state.pending = true;
    });
    builder.addCase(login.rejected, (state) => {
      state.pending = false;
    });

    // Signup
    builder.addCase(signup.fulfilled, (state, { payload }) => {
      state.name = payload.name;
      state.userId = payload.userId;
    });
    builder.addCase(signup.pending, (state) => {
      state.pending = true;
    });
    builder.addCase(signup.rejected, (state, action) => {
      if (action.payload) state.error = action.payload as string;
      else state.error = action.error.message;

      state.pending = false;
    });
  },
});

export const { updateName, updateRecipes } = userSlice.actions;

export const selectName = (state: any) => state.user.userName;
export const selectId = (state: any) => state.user.userId;

export default userSlice.reducer;
