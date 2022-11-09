import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
// import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';

import App from './components/App';
// import theme from './theme';
import store from './app/store';

import ToggleColorModeProvider from './utils/ToggleColorMode';

import './index.css';

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      {/* <ThemeProvider theme={theme}> */}
      <ToggleColorModeProvider>
        <CssBaseline />
        <App />
      </ToggleColorModeProvider>
      {/* </ThemeProvider> */}
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
