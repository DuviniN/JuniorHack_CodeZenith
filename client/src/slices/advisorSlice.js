import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../services/api.js';

const handleError = (error) =>
  error?.response?.data?.message || error.message || 'Something went wrong';

export const fetchAdvisors = createAsyncThunk(
  'advisors/list',
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get('/advisors');
      return data.advisors;
    } catch (error) {
      return thunkAPI.rejectWithValue(handleError(error));
    }
  }
);

export const fetchShops = createAsyncThunk(
  'advisors/shops',
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get('/advisors/shops');
      return data.shops;
    } catch (error) {
      return thunkAPI.rejectWithValue(handleError(error));
    }
  }
);

export const fetchAppointments = createAsyncThunk(
  'advisors/appointments',
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get('/advisors/appointments');
      return data.appointments;
    } catch (error) {
      return thunkAPI.rejectWithValue(handleError(error));
    }
  }
);

export const bookAppointment = createAsyncThunk(
  'advisors/book',
  async (payload, thunkAPI) => {
    try {
      const { data } = await api.post('/advisors/appointments', payload);
      return data.appointment;
    } catch (error) {
      return thunkAPI.rejectWithValue(handleError(error));
    }
  }
);

const advisorSlice = createSlice({
  name: 'advisors',
  initialState: {
    list: [],
    shops: [],
    appointments: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdvisors.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAdvisors.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchAdvisors.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchShops.fulfilled, (state, action) => {
        state.shops = action.payload;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.appointments = action.payload;
      })
      .addCase(bookAppointment.fulfilled, (state, action) => {
        state.appointments = [action.payload, ...state.appointments];
      });
  }
});

export default advisorSlice.reducer;

