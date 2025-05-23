import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Bleu Material UI par défaut
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#9c27b0', // Violet
      light: '#ba68c8',
      dark: '#7b1fa2',
      contrastText: '#ffffff',
    },
    success: {
      main: '#2e7d32', // Vert
      light: '#4caf50',
      dark: '#1b5e20',
    },
    error: {
      main: '#d32f2f', // Rouge
      light: '#ef5350',
      dark: '#c62828',
    },
    warning: {
      main: '#ed6c02', // Orange
      light: '#ff9800',
      dark: '#e65100',
    },
    info: {
      main: '#0288d1', // Bleu clair
      light: '#03a9f4',
      dark: '#01579b',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: [
      '"Roboto"',
      '"Helvetica"',
      '"Arial"',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
    button: {
      textTransform: 'none', // Désactive la capitalisation automatique des boutons
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Bordures plus arrondies
          padding: '8px 16px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12, // Bordures plus arrondies pour les Paper
          boxShadow: '0px 3px 10px rgba(0, 0, 0, 0.08)', // Ombre plus douce
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        fullWidth: true,
      },
    },
  },
});

export default theme;