import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import { addAxios } from "../errors/errors";
import { API_PREFIX } from "../../utils/config";
import {
  CreateUserRecipeRequest,
  CreateUserRecipeResponse,
  GetRecipeDetails,
  ListRecipesResponse,
  ListSavedRecipes,
  Recipe,
  RecipeDetails,
} from "../../api/recipe";

export interface State {
  recipes: Recipe[];
  savedRecipes: Recipe[];
  recipeDetails: { [key: number]: RecipeDetails };
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

export const listSavedRecipes = createAsyncThunk(
  "recipes/listSaved",
  async (input: {}, { dispatch, getState }) => {
    try {
      const userId = (getState() as any).user.userId;
      const response = await axios.get<ListSavedRecipes>(
        `${API_PREFIX}/users/${userId}/recipes`
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

export const getRecipeDetails = createAsyncThunk(
  "recipe/getDetails",
  async (input: { recipeID: number }, { dispatch }) => {
    try {
      const response = await axios.get<GetRecipeDetails>(
        `${API_PREFIX}/recipes/${input.recipeID}`
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

export const deleteRecipe = createAsyncThunk(
  "recipes/delete",
  async (input: { recipeID: number }, { dispatch, getState }) => {
    try {
      const userId = (getState() as any).user.userId;
      const response = await axios.delete<CreateUserRecipeResponse>(
        `${API_PREFIX}/users/${userId}/recipes/${input.recipeID}`
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
    savedRecipes: [],
    swipedIDs: [],
    recipeDetails: {},
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
    removeRecipeDetails: (state, action: PayloadAction<number>) => {
      delete state.recipeDetails[action.payload];
      return state;
    },
    resetRecipeDetails: (state) => {
      state.recipeDetails = {};
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

    // List asveed
    builder.addCase(listSavedRecipes.fulfilled, (state, { payload }) => {
      state.savedRecipes = payload;
      state.pending = false;
    });
    builder.addCase(listSavedRecipes.pending, (state) => {
      state.pending = true;
    });
    builder.addCase(listSavedRecipes.rejected, (state, action) => {
      state.pending = false;
    });

    // Get recipe details
    builder.addCase(getRecipeDetails.fulfilled, (state, { payload }) => {
      state.recipeDetails[payload.recipe.recipeId] = payload;
      state.pending = false;
    });
    builder.addCase(getRecipeDetails.pending, (state) => {
      state.pending = true;
    });
    builder.addCase(getRecipeDetails.rejected, (state, action) => {
      state.pending = false;
    });
  },
});

export const {
  addSwipedID,
  resetSwiped,
  removeRecipeDetails,
  resetRecipeDetails,
} = recipesSlice.actions;

export default recipesSlice.reducer;
