import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../services/api.js';

const handleError = (error) =>
  error?.response?.data?.message || error.message || 'Something went wrong';

export const fetchFoods = createAsyncThunk(
  'foods/fetchAll',
  async (searchTerm = '', thunkAPI) => {
    try {
      const params = searchTerm ? `?q=${encodeURIComponent(searchTerm)}` : '';
      const { data } = await api.get(`/foods${params}`);
      return data.foods;
    } catch (error) {
      return thunkAPI.rejectWithValue(handleError(error));
    }
  }
);

export const fetchFoodById = createAsyncThunk(
  'foods/fetchById',
  async (id, thunkAPI) => {
    try {
      const { data } = await api.get(`/foods/${id}`);
      return data.food;
    } catch (error) {
      return thunkAPI.rejectWithValue(handleError(error));
    }
  }
);

export const fetchSmartTip = createAsyncThunk(
  'foods/smartTip',
  async (id, thunkAPI) => {
    try {
      const { data } = await api.get(`/foods/${id}/tip`);
      return { id, tip: data.tip };
    } catch (error) {
      return thunkAPI.rejectWithValue(handleError(error));
    }
  }
);

export const fetchSwapIdeas = createAsyncThunk(
  'foods/swaps',
  async (id, thunkAPI) => {
    try {
      const { data } = await api.get(`/foods/${id}/swaps`);
      return { id, swaps: data.swaps };
    } catch (error) {
      return thunkAPI.rejectWithValue(handleError(error));
    }
  }
);

export const createFoodRequest = createAsyncThunk(
  'foods/create',
  async (payload, thunkAPI) => {
    try {
      const { data } = await api.post('/foods', payload);
      return data.food;
    } catch (error) {
      return thunkAPI.rejectWithValue(handleError(error));
    }
  }
);

const foodsSlice = createSlice({
  name: 'foods',
  initialState: {
    items: [],
    selected: null,
    status: 'idle',
    error: null,
    smartTips: {},
    swaps: {}
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFoods.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchFoods.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchFoods.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchFoodById.fulfilled, (state, action) => {
        state.selected = action.payload;
      })
      .addCase(fetchSmartTip.fulfilled, (state, action) => {
        state.smartTips[action.payload.id] = action.payload.tip;
      })
      .addCase(fetchSwapIdeas.fulfilled, (state, action) => {
        state.swaps[action.payload.id] = action.payload.swaps;
      })
      .addCase(createFoodRequest.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      });
  }
});

export default foodsSlice.reducer;

