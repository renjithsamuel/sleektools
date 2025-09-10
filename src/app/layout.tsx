'use client';
import './globals.css';
import { CssBaseline, Box } from '@mui/material';
import { ThemeProvider } from '../context/ThemeContext';
import { ThemeWrapper } from '../components/ThemeWrapper/ThemeWrapper';
import { ToolsNavbar } from '../components/NavBar/ToolsNavbar';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>SleekTools - Developer Tools Collection</title>
        <meta
          name="description"
          content="A comprehensive collection of developer tools for formatting, validation, conversion, and generation."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href="/logo.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: 'Poppins, sans-serif' }} suppressHydrationWarning={true}>
        <ThemeProvider>
          <ThemeWrapper>
            <CssBaseline />
            <Box
              sx={{
                minHeight: '100vh',
                bgcolor: 'background.default',
                transition: 'background-color 0.3s ease',
              }}
            >
              <ToolsNavbar />
              {children}
            </Box>
          </ThemeWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
