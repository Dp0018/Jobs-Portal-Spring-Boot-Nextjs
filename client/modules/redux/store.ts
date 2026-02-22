import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/modules/auth/server/user-slice";
import profileReducer from "@/modules/landing/server/profile-slice";

const store = configureStore({
  reducer: {
    user: userReducer,
    profile: profileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
