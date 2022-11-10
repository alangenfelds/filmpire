import React, { useState, useEffect } from 'react';
import {
  Box,
  Modal,
  Typography,
  Button,
  ButtonGroup,
  Grid,
  CircularProgress,
  // useMediaQuery,
  Rating,
} from '@mui/material';
import {
  Movie as MovieIcon,
  Theaters,
  Language,
  PlusOne,
  Favorite,
  FavoriteBorderOutlined,
  Remove,
  ArrowBack,
} from '@mui/icons-material';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import { selectGenreOrCategory } from '../../features/currentGenreOrCategory';
import { userSelector } from '../../features/auth';
import {
  useGetMovieQuery,
  useGetRecommendationsQuery,
  useGetListQuery,
} from '../../services/TMDB';
import genreIcons from '../../assets/genres';
import { MovieList } from '../index';
import useStyles from './styles';

const MovieInformation = () => {
  const { id } = useParams();
  const classes = useStyles();
  // const isMobile = useMediaQuery('(max-width:600px)');
  const dispatch = useDispatch();

  const { user } = useSelector(userSelector);

  const [open, setOpen] = useState(false);
  const [isMovieFavorited, setIsMovieFavorited] = useState(false);
  const [isMovieWatchlisted, setIsMovieWatchlisted] = useState(false);

  const { data: movie, isFetching, error } = useGetMovieQuery(id);
  const {
    data: favoriteMovies,
    isFetching: isFetchingFavoriteMovies,
    error: errorFavoriteMovies,
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
  } = useGetListQuery({
    listName: 'watchlist/movies',
    accountId: user.id,
    sessionId: localStorage.getItem('session_id'),
    page: 1,
  });

  const {
    data: recommendations,
    isFetching: isFetchingRecommendations,
    error: recommendationsError,
  } = useGetRecommendationsQuery({
    movieId: id,
    list: 'recommendations',
  });

  useEffect(() => {
    setIsMovieFavorited(
      !!favoriteMovies?.results?.find((item) => item?.id === movie?.id)
    );
  }, [favoriteMovies, movie]);

  useEffect(() => {
    setIsMovieWatchlisted(
      !!watchlistedMovies?.results?.find((item) => item?.id === movie?.id)
    );
  }, [watchlistedMovies, movie]);

  const addToFavorites = async () => {
    await axios.post(
      `https://api.themoviedb.org/3/account/${user.id}/favorite?api_key=${
        process.env.REACT_APP_TMDB_KEY
      }&session_id=${localStorage.getItem('session_id')}`,
      { media_type: 'movie', media_id: id, favorite: !isMovieFavorited }
    );

    setIsMovieFavorited((prev) => !prev);
  };
  const addToWatchlist = async () => {
    await axios.post(
      `https://api.themoviedb.org/3/account/${user.id}/watchlist?api_key=${
        process.env.REACT_APP_TMDB_KEY
      }&session_id=${localStorage.getItem('session_id')}`,
      { media_type: 'movie', media_id: id, watchlist: !isMovieWatchlisted }
    );

    setIsMovieWatchlisted((prev) => !prev);
  };

  if (
    isFetching ||
    isFetchingRecommendations ||
    isFetchingFavoriteMovies ||
    isFetchingWatchlistedMovies
  ) {
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

  if (
    error ||
    recommendationsError ||
    errorFavoriteMovies ||
    errorWatchlistedMovies
  ) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" mt="20px">
        <Link to="/" variant="h4">
          Please Login first
        </Link>
      </Box>
    );
  }

  return (
    <Grid container className={classes.containerSpaceAround}>
      <Grid
        item
        sm={12}
        lg={4}
        style={{
          display: 'flex',
          marginBottom: '30px',
          justifyContent: 'center',
        }}
      >
        <img
          src={`https://image.tmdb.org/t/p/w500/${movie?.poster_path}`}
          className={classes.poster}
          alt={movie?.title}
        />
      </Grid>
      <Grid item container direction="column" lg={7}>
        <Typography variant="h3" align="center" gutterBottom>
          {movie?.title} ({movie?.release_date?.split('-')[0]})
        </Typography>
        <Typography variant="h5" align="center" gutterBottom>
          {movie?.tagline}
        </Typography>

        <Grid item className={classes.containerSpaceAround}>
          <Box display="flex" align="center">
            <Rating readOnly value={movie?.vote_average / 2} />
            <Typography
              variant="subtitle1"
              gutterBottom
              style={{ marginLeft: '10px' }}
            >
              {movie?.vote_average} / 10
            </Typography>
          </Box>
          <Typography variant="h6" align="center" gutterBottom>
            {movie?.runtime} min
            {movie?.spoken_languages.length > 0
              ? ` | Language: ${movie?.spoken_languages[0].name}`
              : ''}
          </Typography>
        </Grid>
        <Grid item className={classes.genresContainer}>
          {movie?.genres?.map((genre, idx) => (
            <Link
              key={idx}
              className={classes.link}
              to="/"
              onClick={() => {
                dispatch(selectGenreOrCategory(genre?.id));
              }}
            >
              <img
                src={genreIcons[genre.name.toLowerCase()]}
                alt="category"
                className={classes.genreImage}
                height={30}
              />
              <Typography color="textPrimary" variant="subtitle1">
                {genre?.name}
              </Typography>
            </Link>
          ))}
        </Grid>
        <Typography
          variant="h5"
          gutterBottom
          style={{
            marginTop: '10px',
          }}
        >
          Overview
        </Typography>
        <Typography
          style={{
            marginBottom: '2rem',
          }}
        >
          {movie?.overview}
        </Typography>
        <Typography variant="h5" gutterBottom>
          Top Cast
        </Typography>
        <Grid item container spacing={2}>
          {movie?.credits?.cast?.map(
            (character, idx) =>
              character?.profile_path && (
                <Grid
                  key={idx}
                  item
                  xs={4}
                  md={2}
                  component={Link}
                  to={`/actors/${character?.id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w500/${character.profile_path}`}
                    className={classes.castImage}
                    alt={character.name}
                  />
                  <Typography color="textPrimary">{character?.name}</Typography>
                  <Typography color="textSecondary">
                    {character?.character.split('/')[0]}
                  </Typography>
                </Grid>
              )
          )}
        </Grid>
        <Grid container item style={{ marginTop: '2rem' }}>
          <div className={classes.buttonsContainer}>
            <Grid item xs={12} sm={6} className={classes.buttonsContainer}>
              <ButtonGroup size="medium" variant="outlined">
                <Button
                  target="_blank"
                  rel="noopener noreferer"
                  href={movie?.homepage}
                  endIcon={<Language />}
                >
                  Website
                </Button>
                <Button
                  target="_blank"
                  rel="noopener noreferer"
                  href={`https://www.imdb.com/title/${movie?.imdb_id}`}
                  endIcon={<MovieIcon />}
                >
                  IMDB
                </Button>
                {movie?.videos?.results?.length ? (
                  <Button
                    onClick={() => {
                      setOpen(true);
                    }}
                    endIcon={<Theaters />}
                  >
                    Trailer
                  </Button>
                ) : (
                  <></>
                )}
              </ButtonGroup>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.buttonsContainer}>
              <ButtonGroup size="medium" variant="outlined">
                <Button
                  onClick={addToFavorites}
                  endIcon={
                    isMovieFavorited ? <FavoriteBorderOutlined /> : <Favorite />
                  }
                >
                  {isMovieFavorited ? 'Unfavorite' : 'Favorite'}
                </Button>
                <Button
                  onClick={addToWatchlist}
                  endIcon={isMovieWatchlisted ? <Remove /> : <PlusOne />}
                >
                  Watchlist
                </Button>
                <Button
                  endIcon={<ArrowBack />}
                  sx={{ borderColor: 'primary.main' }}
                >
                  <Typography
                    component={Link}
                    to="/"
                    color="inherit"
                    variant="subtitle2"
                    style={{ textDecoration: 'none' }}
                  >
                    Back
                  </Typography>
                </Button>
              </ButtonGroup>
            </Grid>
          </div>
        </Grid>
      </Grid>
      <Box marginTop="5rem" width="100%">
        <Typography variant="h3" gutterBottom align="center">
          You might also like
        </Typography>
        {recommendations ? (
          <MovieList movies={recommendations} numberOfMovies={12} />
        ) : (
          <Box>Sorry, nothing was found.</Box>
        )}
      </Box>
      {movie?.videos?.results?.length && (
        <Modal
          closeAfterTransition
          className={classes.modal}
          open={open}
          onClose={() => setOpen(false)}
        >
          <iframe
            autoPlay
            className={classes.video}
            frameBorder="0"
            title="Trailer"
            src={`https://www.youtube.com/embed/${movie?.videos?.results[0].key}`}
            allow="autoplay"
          />
        </Modal>
      )}
    </Grid>
  );
};

export default MovieInformation;
