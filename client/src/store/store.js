import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice.js';
import foodsReducer from '../slices/foodsSlice.js';
import mealsReducer from '../slices/mealsSlice.js';
import analyticsReducer from '../slices/analyticsSlice.js';
import advisorReducer from '../slices/advisorSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    foods: foodsReducer,
    meals: mealsReducer,
    analytics: analyticsReducer,
    advisors: advisorReducer
  }
});

