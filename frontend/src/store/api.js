import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const olympiqApi = createApi({
  reducerPath: 'olympiqApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/api/' }),
  endpoints: (builder) => ({
    getCountries: builder.query({
      query: () => 'countries',
    }),
    getMedals: builder.query({
      query: () => 'medals',
    }),
    getSocioData: builder.query({
      query: () => 'socio',
    }),
    getMedalTrends: builder.query({
      query: () => 'trends',
    }),
  }),
});

export const {
  useGetCountriesQuery,
  useGetMedalsQuery,
  useGetSocioDataQuery,
  useGetMedalTrendsQuery,
} = olympiqApi;
