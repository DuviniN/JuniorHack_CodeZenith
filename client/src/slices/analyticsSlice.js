import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../services/api.js';

const handleError = (error) =>
  error?.response?.data?.message || error.message || 'Something went wrong';

export const fetchWeeklyAnalytics = createAsyncThunk(
  'analytics/weekly',
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get('/analytics/weekly');
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(handleError(error));
    }
  }
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState: {
    summary: null,
    trend: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeeklyAnalytics.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWeeklyAnalytics.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.summary = action.payload.summary;
        state.trend = action.payload.trend;
      })
      .addCase(fetchWeeklyAnalytics.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export default analyticsSlice.reducer;

