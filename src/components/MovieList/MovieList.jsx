import React from 'react';
import { Grid } from '@mui/material';

import useStyles from './styles';
import Movie from '../Movie/Movie';

const MovieList = ({ movies, numberOfMovies, excludeFirst }) => {
  const classes = useStyles();
  const startfrom = excludeFirst ? 1 : 0;

  return (
    <Grid container className={classes.moviesContainer}>
      {movies?.results?.slice(startfrom, numberOfMovies).map((movie, idx) => (
        <Movie key={idx} movie={movie} idx={idx} />
      ))}
    </Grid>
  );
};

export default MovieList;
