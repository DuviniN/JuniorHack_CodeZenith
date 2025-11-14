import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../services/api.js';

const handleError = (error) =>
  error?.response?.data?.message || error.message || 'Something went wrong';

export const fetchMeals = createAsyncThunk(
  'meals/fetch',
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get('/meals');
      return data.meals;
    } catch (error) {
      return thunkAPI.rejectWithValue(handleError(error));
    }
  }
);

export const addMeal = createAsyncThunk(
  'meals/add',
  async (payload, thunkAPI) => {
    try {
      const { data } = await api.post('/meals', payload);
      return data.meal;
    } catch (error) {
      return thunkAPI.rejectWithValue(handleError(error));
    }
  }
);

const mealsSlice = createSlice({
  name: 'meals',
  initialState: {
    logs: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMeals.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchMeals.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.logs = action.payload;
      })
      .addCase(fetchMeals.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addMeal.fulfilled, (state, action) => {
        state.logs = [action.payload, ...state.logs];
      });
  }
});

export default mealsSlice.reducer;

