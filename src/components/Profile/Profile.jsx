import React, { useEffect } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { ExitToApp } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { useGetListQuery } from '../../services/TMDB';
import { userSelector } from '../../features/auth';
import RatedCards from '../RatedCards/RatedCards';

const Profile = () => {
  const { user } = useSelector(userSelector);

  const {
    data: favoriteMovies,
    isFetching: isFetchingFavoriteMovies,
    error: errorFavoriteMovies,
    refetch: refetchFavoriteMovies,
  } = useGetListQuery({
    listName: 'favorite/movies',
    accountId: user.id,
    sessionId: localStorage.getItem('session_id'),
    page: 1,
  });

  const {
    data: watchlistedMovies,
    isFetching: isFetchingWatchlistedMovies,
    error: errorWatchlistedMovies,
    refetch: refetchWatchlistedMovies,
  } = useGetListQuery({
    listName: 'watchlist/movies',
    accountId: user.id,
    sessionId: localStorage.getItem('session_id'),
    page: 1,
  });

  useEffect(() => {
    refetchFavoriteMovies();
    refetchWatchlistedMovies();
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  if (isFetchingFavoriteMovies || isFetchingWatchlistedMovies) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress size="4rem" />
      </Box>
    );
  }

  if (errorFavoriteMovies || errorWatchlistedMovies) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" mt="20px">
        <Link to="/" variant="h4">
          Something has go wrong
        </Link>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h4" gutterBottom>
          My Profile
        </Typography>
        <Button color="inherit" onClick={logout}>
          Logout &nbsp; <ExitToApp />
        </Button>
      </Box>
      {!favoriteMovies?.results?.length &&
      !watchlistedMovies?.results?.length ? (
        <Typography variant="h5">
          Add favorites or watchlist some movies to see them here!
        </Typography>
      ) : (
        <Box>
          {favoriteMovies?.results?.length ? (
            <RatedCards title="Favorite Movies" data={favoriteMovies} />
          ) : (
            <></>
          )}
          {watchlistedMovies?.results?.length ? (
            <RatedCards title="Watchlisted Movies" data={watchlistedMovies} />
          ) : (
            <></>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Profile;
