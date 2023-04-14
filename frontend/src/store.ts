import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./states/counterSlice";
import userReducer from "./states/userSlice";

export default configureStore({
  reducer: {
    counter: counterReducer,
    user: userReducer,
  },
});
