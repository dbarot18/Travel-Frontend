// redux/requestsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE = "http://localhost:5000/api";

// Async thunks
export const fetchRequests = createAsyncThunk(
  "requests/fetchRequests",
  async (status = "all", { rejectWithValue }) => {
    try {
      const url =
        status && status !== "all"
          ? `${API_BASE}/requests?status=${status}`
          : `${API_BASE}/requests`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateRequestStatus = createAsyncThunk(
  "requests/updateRequestStatus",
  async ({ id, status, notes }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/requests/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status, notes }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createRequest = createAsyncThunk(
  "requests/createRequest",
  async (requestData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteRequest = createAsyncThunk(
  "requests/deleteRequest",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/requests/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const requestsSlice = createSlice({
  name: "requests",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Fetch Requests
    builder
      .addCase(fetchRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update Request Status
    builder
      .addCase(updateRequestStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRequestStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(
          (req) => req._id === action.payload._id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateRequestStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create Request
    builder
      .addCase(createRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete Request
    builder
      .addCase(deleteRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((req) => req._id !== action.payload);
      })
      .addCase(deleteRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default requestsSlice.reducer;
