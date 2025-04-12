import { configureStore } from '@reduxjs/toolkit';
import { olympiqApi } from './api';

export const store = configureStore({
  reducer: {
    [olympiqApi.reducerPath]: olympiqApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(olympiqApi.middleware),
});
