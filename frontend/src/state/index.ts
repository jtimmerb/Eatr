import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

import errorsReducer from "./errors/errors";
import userReducer from "./user/user";
import pantryReducer from "./pantry/pantry";
import recipesReducer from "./recipes/recipes";

const LOCAL_STORAGE_KEY = "eatr/redux-state";

const rootReducer = combineReducers({
  user: userReducer,
  errors: errorsReducer,
  pantry: pantryReducer,
  recipes: recipesReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const saveToLocalStorage = (state: RootState) => {
  try {
    const stateJSON = JSON.stringify(state);
    localStorage.setItem(LOCAL_STORAGE_KEY, stateJSON);
  } catch (ex) {
    console.warn(ex);
  }
};

const loadFromLocalStorage = () => {
  try {
    const stateJSON = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stateJSON === null) return undefined;
    return JSON.parse(stateJSON) as RootState;
  } catch (ex) {
    console.warn(ex);
  }
};

const store = configureStore({
  reducer: rootReducer,
  preloadedState: loadFromLocalStorage(),
});

// Save state to local storage periodically
store.subscribe(() => saveToLocalStorage(store.getState()));

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
