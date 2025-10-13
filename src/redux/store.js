// redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import requestsReducer from "./requestsSlice";

const store = configureStore({
  reducer: {
    requests: requestsReducer,
  },
});

export default store;
