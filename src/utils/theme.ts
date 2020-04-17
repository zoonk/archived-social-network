import { createMuiTheme } from '@material-ui/core/styles';
import { blue, green, pink, red } from '@material-ui/core/colors';
import { enUS, ptBR } from '@material-ui/core/locale';
import { appLanguage } from './settings';

const getMaterialLanguage = () => {
  switch (appLanguage) {
    case 'en':
      return enUS;
    case 'pt':
      return ptBR;
    default:
      return enUS;
  }
};

export const postFont =
  'medium-content-serif-font, Georgia, Cambria, "Times New Roman", Times, serif';

// Create a theme instance.
export const theme = createMuiTheme(
  {
    palette: {
      primary: blue,
      secondary: pink,
      error: {
        main: red.A400,
      },
      background: {
        default: '#fff',
      },
      success: {
        contrastText: 'white',
        main: green[400],
      },
    },
  },
  getMaterialLanguage(),
);
