import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./states/userSlice";

export default configureStore({
  reducer: {
    user: userReducer,
  },
});
