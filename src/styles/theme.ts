import { ThemeOptions, createTheme, responsiveFontSizes } from '@mui/material/styles';

// Type extensions for custom palette
declare module '@mui/material/styles' {
  interface Palette {
    gradient: {
      primary: string;
      secondary: string;
      accent: string;
      success: string;
      luxury: string;
    };
  }
  interface PaletteOptions {
    gradient?: {
      primary: string;
      secondary: string;
      accent: string;
      success: string;
      luxury: string;
    };
  }
}

const luxuryThemeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#6366f1', // Modern indigo
      light: '#818cf8',
      dark: '#4f46e5',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ec4899', // Vibrant pink
      light: '#f472b6',
      dark: '#db2777',
      contrastText: '#ffffff',
    },
    success: {
      main: '#10b981', // Emerald green
      light: '#34d399',
      dark: '#059669',
    },
    warning: {
      main: '#f59e0b', // Amber
      light: '#fbbf24',
      dark: '#d97706',
    },
    error: {
      main: '#ef4444', // Red
      light: '#f87171',
      dark: '#dc2626',
    },
    info: {
      main: '#3b82f6', // Blue
      light: '#60a5fa',
      dark: '#2563eb',
    },
    background: {
      default: '#fafbfc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1f2937',
      secondary: '#6b7280',
    },
    gradient: {
      primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      accent: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      success: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      luxury: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '3.5rem',
      fontWeight: 800,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2.75rem',
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '2.25rem',
      fontWeight: 700,
      lineHeight: 1.4,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontSize: '1.875rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.875rem',
          padding: '10px 24px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
            background: 'rgba(102, 126, 234, 0.04)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: '1px solid rgba(0, 0, 0, 0.08)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          },
        },
        elevation3: {
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#667eea',
                borderWidth: 2,
              },
            },
            '&.Mui-focused': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#667eea',
                borderWidth: 2,
                boxShadow: '0 0 0 4px rgba(102, 126, 234, 0.1)',
              },
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
          fontSize: '0.75rem',
        },
        colorPrimary: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
        },
        colorSuccess: {
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          color: 'white',
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          maxWidth: '100% !important',
          '@media (min-width: 600px)': {
            maxWidth: '100% !important',
          },
          '@media (min-width: 960px)': {
            maxWidth: '1200px !important',
          },
          '@media (min-width: 1280px)': {
            maxWidth: '1400px !important',
          },
        },
      },
    },
    MuiGrid: {
      styleOverrides: {
        root: {
          '&.MuiGrid-container': {
            margin: 0,
            width: '100%',
          },
          '&.MuiGrid-item': {
            paddingLeft: 0,
            paddingTop: 0,
            '@media (max-width: 600px)': {
              padding: '8px',
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          border: '1px solid rgba(0, 0, 0, 0.08)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px) scale(1.02)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: '0 2px 20px rgba(0, 0, 0, 0.08)',
        },
      },
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0 2px 8px rgba(0, 0, 0, 0.06)',
    '0 4px 12px rgba(0, 0, 0, 0.08)',
    '0 4px 20px rgba(0, 0, 0, 0.08)',
    '0 6px 24px rgba(0, 0, 0, 0.1)',
    '0 8px 32px rgba(0, 0, 0, 0.12)',
    '0 12px 40px rgba(0, 0, 0, 0.15)',
    '0 16px 48px rgba(0, 0, 0, 0.18)',
    '0 20px 56px rgba(0, 0, 0, 0.2)',
    '0 24px 64px rgba(0, 0, 0, 0.22)',
    '0 28px 72px rgba(0, 0, 0, 0.24)',
    '0 32px 80px rgba(0, 0, 0, 0.26)',
    '0 36px 88px rgba(0, 0, 0, 0.28)',
    '0 40px 96px rgba(0, 0, 0, 0.3)',
    '0 44px 104px rgba(0, 0, 0, 0.32)',
    '0 48px 112px rgba(0, 0, 0, 0.34)',
    '0 52px 120px rgba(0, 0, 0, 0.36)',
    '0 56px 128px rgba(0, 0, 0, 0.38)',
    '0 60px 136px rgba(0, 0, 0, 0.4)',
    '0 64px 144px rgba(0, 0, 0, 0.42)',
    '0 68px 152px rgba(0, 0, 0, 0.44)',
    '0 72px 160px rgba(0, 0, 0, 0.46)',
    '0 76px 168px rgba(0, 0, 0, 0.48)',
    '0 80px 176px rgba(0, 0, 0, 0.5)',
    '0 84px 184px rgba(0, 0, 0, 0.52)',
  ],
};

export const lightTheme = responsiveFontSizes(createTheme(luxuryThemeOptions));

export const darkTheme = responsiveFontSizes(
  createTheme({
    ...luxuryThemeOptions,
    palette: {
      ...luxuryThemeOptions.palette,
      mode: 'dark',
      background: {
        default: '#0f1419',
        paper: '#1a1f2e',
      },
      text: {
        primary: '#f8fafc', // Higher contrast white
        secondary: '#cbd5e1', // Higher contrast secondary text
      },
      primary: {
        main: '#818cf8', // Lighter indigo for better contrast
        light: '#a5b4fc',
        dark: '#6366f1',
        contrastText: '#000000',
      },
      secondary: {
        main: '#f472b6', // Lighter pink for better contrast
        light: '#f9a8d4',
        dark: '#ec4899',
        contrastText: '#000000',
      },
      success: {
        main: '#34d399', // Lighter emerald for better contrast
        light: '#6ee7b7',
        dark: '#10b981',
        contrastText: '#000000',
      },
      warning: {
        main: '#fbbf24', // Lighter amber for better contrast
        light: '#fcd34d',
        dark: '#f59e0b',
        contrastText: '#000000',
      },
      error: {
        main: '#f87171', // Lighter red for better contrast
        light: '#fca5a5',
        dark: '#ef4444',
        contrastText: '#000000',
      },
      info: {
        main: '#60a5fa', // Lighter blue for better contrast
        light: '#93c5fd',
        dark: '#3b82f6',
        contrastText: '#000000',
      },
    },
    components: {
      ...luxuryThemeOptions.components,
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: 'rgba(26, 31, 46, 0.8)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 2px 20px rgba(0, 0, 0, 0.3)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            border: '1px solid rgba(255, 255, 255, 0.08)',
            transition: 'all 0.2s ease-in-out',
            backgroundColor: '#1a1f2e',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            },
          },
          elevation3: {
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 12,
              transition: 'all 0.2s ease-in-out',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.2)',
              },
              '&:hover': {
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#818cf8',
                  borderWidth: 2,
                },
              },
              '&.Mui-focused': {
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#818cf8',
                  borderWidth: 2,
                  boxShadow: '0 0 0 4px rgba(129, 140, 248, 0.1)',
                },
              },
            },
            '& .MuiInputLabel-root': {
              color: '#cbd5e1',
              '&.Mui-focused': {
                color: '#818cf8',
              },
            },
          },
        },
      },
    },
  })
);

// Export default theme
const theme = lightTheme;
export default theme;
