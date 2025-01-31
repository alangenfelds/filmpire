import React from 'react';
import { Box, Typography } from '@mui/material';

import Movie from '../Movie/Movie';

import useStyles from './styles';

const RatedCards = ({ title, data }) => {
  const classes = useStyles();

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        {title}
      </Typography>
      <Box display="flex" flexWrap="wrap" className={classes.container}>
        {data?.results?.map((movie, idx) => (
          <Movie key={movie.id} movie={movie} idx={idx} />
        ))}
      </Box>
    </Box>
  );
};

export default RatedCards;
