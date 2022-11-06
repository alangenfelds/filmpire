import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { Actors, MovieInformation, Movies, Navbar, Profile } from '.';
import useStyles from './styles';

function App() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Navbar />
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Switch>
          <Route exact path="/movie/:id">
            <MovieInformation />
          </Route>
          <Route exact path="/actors/:id">
            <Actors />
          </Route>
          <Route exact path="/">
            <Movies />
          </Route>
          <Route exact path="/profile/:id">
            <Profile />
          </Route>
        </Switch>
      </main>
    </div>
  );
}

export default App;
