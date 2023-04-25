import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import { addAxios } from "../errors/errors";
import { API_PREFIX } from "../../utils/config";
import {
  CreateUserRecipeRequest,
  CreateUserRecipeResponse,
  ListRecipesResponse,
  Recipe,
} from "../../api/recipe";

export interface State {
  recipes: Recipe[];
  swipedIDs: number[];
  pending: boolean;
}

export const listRecipes = createAsyncThunk(
  "recipes/list",
  async (input: { ingredientIDs: number[] }, { dispatch }) => {
    try {
      const params = { ingredients: input.ingredientIDs.join(",") };
      const response = await axios.get<ListRecipesResponse>(
        `${API_PREFIX}/recipes`,
        { params }
      );

      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        dispatch(addAxios(err));
      }
      throw err;
    }
  }
);

export const saveRecipe = createAsyncThunk(
  "recipes/save",
  async (body: CreateUserRecipeRequest, { dispatch, getState }) => {
    try {
      const userId = (getState() as any).user.userId;
      const response = await axios.post<CreateUserRecipeResponse>(
        `${API_PREFIX}/users/${userId}/recipes/`,
        body
      );

      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        dispatch(addAxios(err));
      }
      throw err;
    }
  }
);

export const recipesSlice = createSlice({
  name: "recipes",
  initialState: {
    recipes: [],
    swipedIDs: [],
    pending: false,
  } as State,
  reducers: {
    addSwipedID: (state, action: PayloadAction<number>) => {
      state.swipedIDs.push(action.payload);
      return state;
    },
    resetSwiped: (state) => {
      state.swipedIDs = [];
      return state;
    },
  },
  extraReducers: (builder) => {
    // List
    builder.addCase(listRecipes.fulfilled, (state, { payload }) => {
      state.recipes = payload;
      state.pending = false;
    });
    builder.addCase(listRecipes.pending, (state) => {
      state.pending = true;
    });
    builder.addCase(listRecipes.rejected, (state, action) => {
      state.pending = false;
    });
  },
});

export const { addSwipedID, resetSwiped } = recipesSlice.actions;

export default recipesSlice.reducer;
