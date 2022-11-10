import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const tmdbApiKey = process.env.REACT_APP_TMDB_KEY;
// https://api.themoviedb.org/3/movie/popular?api_key=<<api_key>>&language=en-US&page=1

export const tmdbApi = createApi({
  reducerPath: 'tmdbApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.themoviedb.org/3' }),
  endpoints: (builder) => ({
    // Get Movies by [Type]
    getMovies: builder.query({
      query: ({ page, genreIdOrCategoryName, searchQuery }) => {
        // get movies by search query
        if (searchQuery) {
          return `/search/movie?query=${searchQuery}&page=${page}&api_key=${tmdbApiKey}`;
        }

        // get movies by category
        if (
          genreIdOrCategoryName &&
          typeof genreIdOrCategoryName === 'string'
        ) {
          return `/movie/${genreIdOrCategoryName}?page=${page}&api_key=${tmdbApiKey}`;
        }

        // get movies by genre
        if (
          genreIdOrCategoryName &&
          typeof genreIdOrCategoryName === 'number'
        ) {
          return `/discover/movie?with_genres=${genreIdOrCategoryName}&page=${page}&api_key=${tmdbApiKey}`;
        }
        // get popular movies
        return `/movie/popular?page=${page}&api_key=${tmdbApiKey}`;
      },
    }),
    // Get Genres
    getGenres: builder.query({
      query: () => {
        return `/genre/movie/list?api_key=${tmdbApiKey}`;
      },
    }),
    // Get movie by ID
    getMovie: builder.query({
      query: (id) => {
        return `/movie/${id}?append_to_response=videos,credits&api_key=${tmdbApiKey}`;
      },
    }),
    // Get user specific recommendations
    getRecommendations: builder.query({
      query: ({ movieId, list }) => {
        return `/movie/${movieId}/${list}?api_key=${tmdbApiKey}`;
      },
    }),
    // Get actor information
    getActorDetails: builder.query({
      query: (id) => {
        return `/person/${id}?api_key=${tmdbApiKey}`;
      },
    }),
    // Get movies by actorId information
    getMoviesByActorId: builder.query({
      query: ({ id, page }) => {
        return `/discover/movie/?with_cast=${id}&page=${page}&api_key=${tmdbApiKey}`;
      },
    }),
    // Get user specific lists
    getList: builder.query({
      query: ({ listName, accountId, sessionId, page }) => {
        return `/account/${accountId}/${listName}?api_key=${tmdbApiKey}&session_id=${sessionId}&page=${page}`;
      },
    }),
  }),
});

export const {
  useGetMoviesQuery,
  useGetGenresQuery,
  useGetMovieQuery,
  useGetRecommendationsQuery,
  useGetActorDetailsQuery,
  useGetMoviesByActorIdQuery,
  useGetListQuery,
} = tmdbApi;
