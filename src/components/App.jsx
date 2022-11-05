import React from 'react';
import { CssBaseline } from '@mui/material';
import { Route, Switch } from 'react-router-dom';

function App() {
  return (
    <div>
      <CssBaseline />
      <main>
        <Switch>
          <Route exact path="/movie/:id">
            <h1>MOVIES INFO</h1>
          </Route>
          <Route exact path="/actors/:id">
            <h1>Actor INFO</h1>
          </Route>
          <Route exact path="/movies">
            <h1>MOVIES</h1>
          </Route>
          <Route exact path="/">
            <h1>MOVIES HOME</h1>
          </Route>
          <Route exact path="/profile/:id">
            <h1>PROFILE</h1>
          </Route>
        </Switch>
      </main>
    </div>
  );
}

export default App;
