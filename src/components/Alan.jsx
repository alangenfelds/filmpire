import { useEffect, useContext } from 'react';
import alanBtn from '@alan-ai/alan-sdk-web';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { ColorModeContext } from '../utils/ToggleColorMode';
import { fetchToken } from '../utils';
import {
  selectGenreOrCategory,
  searchMovie,
} from '../features/currentGenreOrCategory';

const useAlanAi = () => {
  const { setMode } = useContext(ColorModeContext);

  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    alanBtn({
      key: process.env.REACT_APP_ALAN_API_KEY,
      onCommand: (commandData) => {
        if (commandData.command === 'changeMode') {
          // Call the client code that will react to the received command
          if (commandData.mode === 'light') {
            setMode('light');
          } else {
            setMode('dark');
          }
        } else if (commandData.command === 'login') {
          fetchToken();
        } else if (commandData.command === 'logout') {
          localStorage.clear();
          history.push('/');
        } else if (commandData.command === 'chooseGenre') {
          const foundGenre = commandData.genres.find(
            (g) =>
              g.name.toLowerCase() === commandData.genreOrcategory.toLowerCase()
          );

          if (foundGenre) {
            history.push('/');
            dispatch(selectGenreOrCategory(foundGenre.id));
          } else {
            const parsedCategory = commandData.genreOrcategory.startsWith('top')
              ? 'top_rated'
              : commandData.genreOrcategory;
            history.push('/');
            dispatch(selectGenreOrCategory(parsedCategory));
          }
        } else if (commandData.command === 'search') {
          dispatch(searchMovie(commandData.query));
        }
      },
    });
  }, []);
};

export default useAlanAi;
