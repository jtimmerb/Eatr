import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import { addAxios as addError } from "../errors/errors";
import {
  Ingredient,
  CreateUserIngredientRequest,
  ListUserPantryIngredients,
  ListIngredients,
} from "../../api/pantry";
import { API_PREFIX } from "../../utils/config";

interface StateIngredient {
  id: number;
  amount: string;
  name: string;
}

export interface State {
  items: StateIngredient[];
  search?: StateIngredient;
  pending: boolean;
}

export const createItem = createAsyncThunk(
  "pantry/createItem",
  async (body: CreateUserIngredientRequest, { dispatch, getState }) => {
    try {
      const userId = (getState() as any).user.userId;
      const response = await axios.post(
        `${API_PREFIX}/users/${userId}/ingredients`,
        body
      );

      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        dispatch(addError(err));
      }
      throw err;
    }
  }
);

export const listItems = createAsyncThunk(
  "pantry/listItems",
  async (_: {}, { dispatch, getState }) => {
    try {
      const userId = (getState() as any).user.userId;
      const response = await axios.get<ListUserPantryIngredients>(
        `${API_PREFIX}/users/${userId}/ingredients`
      );

      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        dispatch(addError(err));
      }
      throw err;
    }
  }
);

export const searchIngredient = createAsyncThunk(
  "pantry/searchIngredient",
  async (params: { name: string }, { dispatch, getState }) => {
    try {
      const response = await axios.get<ListIngredients>(
        `${API_PREFIX}/ingredients`,
        { params }
      );

      if (response.data.length === 0)
        return {
          id: NaN,
          name: params.name,
          amount: "",
        } as StateIngredient;

      const ingredient = {
        id: response.data[0].ingredientId,
        name: response.data[0].name,
        amount: "",
      };
      return ingredient;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        dispatch(addError(err));
      }
      throw err;
    }
  }
);

export const deleteItem = createAsyncThunk(
  "pantry/deleteItem",
  async (input: { ingredientID: number }, { dispatch, getState }) => {
    try {
      const userId = (getState() as any).user.userId;
      await axios.delete(
        `${API_PREFIX}/users/${userId}/ingredients/${input.ingredientID}`
      );
    } catch (err) {
      if (axios.isAxiosError(err)) {
        dispatch(addError(err));
      }
      throw err;
    }
  }
);

export const pantrySlice = createSlice({
  name: "pantry",
  initialState: {
    items: [],
    pending: false,
  } as State,
  reducers: {},
  extraReducers: (builder) => {
    // Create pantry item
    builder.addCase(createItem.fulfilled, (state) => {
      state.pending = false;
    });
    builder.addCase(createItem.pending, (state) => {
      state.pending = true;
    });
    builder.addCase(createItem.rejected, (state) => {
      state.pending = false;
    });

    // List user pantry items
    builder.addCase(listItems.fulfilled, (state, { payload }) => {
      state.items = payload.map((item) => ({
        id: item.ingredient.ingredientId,
        name: item.ingredient.name,
        amount: item.userPantry.ingredientAmount,
      }));
      state.pending = false;
    });
    builder.addCase(listItems.pending, (state) => {
      state.pending = true;
    });
    builder.addCase(listItems.rejected, (state) => {
      state.pending = false;
    });

    // Search ingredient
    builder.addCase(searchIngredient.fulfilled, (state, { payload }) => {
      state.search = payload;
      state.pending = false;
    });
    builder.addCase(searchIngredient.pending, (state) => {
      state.pending = true;
    });
    builder.addCase(searchIngredient.rejected, (state) => {
      state.pending = false;
    });

    // Delete pantry item
    builder.addCase(deleteItem.fulfilled, (state) => {
      state.pending = false;
    });
    builder.addCase(deleteItem.pending, (state) => {
      state.pending = true;
    });
    builder.addCase(deleteItem.rejected, (state) => {
      state.pending = false;
    });
  },
});

export default pantrySlice.reducer;
