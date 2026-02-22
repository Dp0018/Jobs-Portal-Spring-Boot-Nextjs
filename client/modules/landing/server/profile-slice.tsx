import { createSlice } from "@reduxjs/toolkit";
import { updateProfile } from "./profile-service";

const profileSlice = createSlice({
  name: "profile",
  initialState: {},
  reducers: {
    changeProfile: (state, action) => {
      // Optimistic update in state
      const newState = { ...state, ...action.payload };

      // Fire API call asynchronously to sync with backend
      updateProfile(action.payload).catch((err) => {
        console.error("Failed to sync profile change with backend", err);
      });

      return newState;
    },
    setProfile: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { changeProfile, setProfile } = profileSlice.actions;
export default profileSlice.reducer;
