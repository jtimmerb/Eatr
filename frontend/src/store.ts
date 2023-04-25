import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./redux/user/userSlice";

export default configureStore({
  reducer: {
    user: userReducer,
  },
});
