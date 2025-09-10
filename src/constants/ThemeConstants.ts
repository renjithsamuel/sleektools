const lightThemeValues = {
  border: {
    borderRadius: '8px',
    borderRadiusHigh: '12px',
    borderRadiusLow: '4px',
    defaultborder: '1px solid #E0E0E0',
    thickborder: '2px solid #0c2465',
    defaultborderGrey: '1px solid #E0E0E0',
    defaultborderGreyThick: '2px solid #E0E0E0',
  },
  color: {
    // Applied Materials Color Scheme
    primaryBlue: '#0c2465', // Main brand blue
    secondaryBlue: '#1e3799', // Darker blue
    accentBlue: '#4a69bd', // Interactive elements
    backgroundGray: '#f8f9fa', // Page background
    contentBackground: '#ffffff', // Message/card backgrounds
    textPrimary: '#2d3436', // Main text
    textSecondary: '#636e72', // Secondary text
    borderLight: '#dfe6e9', // Borders and dividers

    // Chat Specific
    userMessageBackground: '#0c2465',
    userMessageText: '#ffffff',
    botMessageBackground: '#f1f2f6',
    botMessageText: '#2d3436',
  },
  font: {
    fontWeightThick: '700',
    fontWeightLightThick: '600',
    fontSizeXLarge: '1.25rem',
    fontSizeLarge: '1.125rem',
    fontSizeSmall: '0.875rem',
    fontSizeMedium: '1rem',
  },
  shadow: {
    boxShadowLight: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    boxShadowHeavy: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    boxShadowAttatched: '0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    boxShadowboxy: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  },
  spacing: (...values: number[]) => values.map(value => `${value * 8}px`).join(' '),
  transition: {
    defaultTansition: '0.2s ease all',
  },
  animation: {
    slideUp: 'slide-up 0.3s ease',
  },
};

export const themeValues = lightThemeValues;
