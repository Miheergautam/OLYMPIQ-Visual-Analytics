import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const olympiqApi = createApi({
  reducerPath: 'olympiqApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:8000/api' }),
  endpoints: (builder) => ({
    // ----- Medals -----
    getMedals: builder.query({
      query: () => 'medals',
    }),
    getMedalYears: builder.query({
      query: () => 'medals/years',
    }),
    getMedalsByYear: builder.query({
      query: (year) => `medals/year/${year}`,
    }),
    getAggregateMedals: builder.query({
      query: () => 'medals/aggregate',
    }),
    getMedalTrend: builder.query({
      query: (country) => `medals/trend/${country}`,
    }),
    getTopCountriesByYear: builder.query({
      query: ({ year, top_n = 10 }) => `medals/top/${year}?top_n=${top_n}`,
    }),
    getMedalsByCountry: builder.query({
      query: (country) => `medals/${country}`,
    }),

    // ----- GDP -----
    getAllGDP: builder.query({
      query: () => 'gdp',
    }),
    getGDPByCountry: builder.query({
      query: (country) => `gdp/${country}`,
    }),
    getGDPByYear: builder.query({
      query: (year) => `gdp/year/${year}`,
    }),
    getGDPTrend: builder.query({
      query: (country) => `gdp/trend/${country}`,
    }),
    getTopGDPCountries: builder.query({
      query: ({ year, top_n = 10 }) => `gdp/top/${year}?top_n=${top_n}`,
    }),
  }),
});

export const {
  // Medals
  useGetMedalsQuery,
  useGetMedalYearsQuery,
  useGetMedalsByYearQuery,
  useGetAggregateMedalsQuery,
  useGetMedalTrendQuery,
  useGetTopCountriesByYearQuery,
  useGetMedalsByCountryQuery,

  // GDP
  useGetAllGDPQuery,
  useGetGDPByCountryQuery,
  useGetGDPByYearQuery,
  useGetGDPTrendQuery,
  useGetTopGDPCountriesQuery,
} = olympiqApi;
