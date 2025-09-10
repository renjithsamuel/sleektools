import './globals.css';
import { CssBaseline, Box } from '@mui/material';
import { ThemeProvider } from '../context/ThemeContext';
import { ThemeWrapper } from '../components/ThemeWrapper/ThemeWrapper';
import { ToolsNavbar } from '../components/NavBar/ToolsNavbar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SleekTools - Developer Tools Collection',
  description:
    'A comprehensive collection of developer tools for formatting, validation, conversion, and generation.',
  viewport: 'width=device-width, initial-scale=1',
  icons: {
    icon: [
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
      },
      {
        url: '/favicon-16x16.svg',
        type: 'image/svg+xml',
        sizes: '16x16',
      },
    ],
    apple: [
      {
        url: '/icon-192x192.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
      },
    ],
    shortcut: '/favicon.svg',
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/site.webmanifest',
  other: {
    'theme-color': '#1976d2',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/svg+xml" sizes="16x16" href="/favicon-16x16.svg" />
        <link rel="icon" type="image/svg+xml" sizes="48x48" href="/favicon-48x48.svg" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icon-192x192.svg" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#1976d2" />
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
