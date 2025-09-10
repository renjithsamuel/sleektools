import './globals.css';
import { CssBaseline, Box } from '@mui/material';
import { ThemeProvider } from '../context/ThemeContext';
import { ThemeWrapper } from '../components/ThemeWrapper/ThemeWrapper';
import { ToolsNavbar } from '../components/NavBar/ToolsNavbar';
import { GoogleAnalytics } from '../components/Analytics/GoogleAnalytics';
import type { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://sleektools.vercel.app'),
  title: {
    default: 'SleekTools - Professional Developer Tools Collection',
    template: '%s | SleekTools - Developer Tools',
  },
  description:
    'Comprehensive collection of professional developer tools for JSON/XML formatting, validation, base64 conversion, UUID generation, and more. Free online tools for developers.',
  keywords: [
    'developer tools',
    'JSON formatter',
    'XML formatter',
    'SQL formatter',
    'code validator',
    'base64 converter',
    'UUID generator',
    'online tools',
    'web development',
    'programming tools',
    'code formatter',
    'text utilities',
    'developer utilities',
    'sleektools',
    'free developer tools',
  ],
  authors: [{ name: 'SleekTools Team' }],
  creator: 'SleekTools',
  publisher: 'SleekTools',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://sleektools.vercel.app',
    title: 'SleekTools - Professional Developer Tools Collection',
    description:
      'Comprehensive collection of professional developer tools for JSON/XML/SQL formatting, validation, base64 conversion, UUID generation, and more. Free online tools for developers.',
    siteName: 'SleekTools',
    images: [
      {
        url: '/icon-192x192.svg',
        width: 192,
        height: 192,
        alt: 'SleekTools Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SleekTools - Professional Developer Tools Collection',
    description:
      'Comprehensive collection of professional developer tools for JSON/XML/SQL formatting, validation, base64 conversion, UUID generation, and more.',
    images: ['/icon-192x192.svg'],
    creator: '@sleektools',
  },
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
  manifest: '/site.webmanifest',
  alternates: {
    canonical: 'https://sleektools.vercel.app',
  },
  other: {
    'theme-color': '#1976d2',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'format-detection': 'telephone=no',
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'SleekTools',
              description:
                'Comprehensive collection of professional developer tools for JSON/XML/SQL formatting, validation, base64 conversion, UUID generation, and more. Free online tools for developers.',
              url: 'https://sleektools.vercel.app',
              applicationCategory: 'DeveloperApplication',
              operatingSystem: 'Web Browser',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              creator: {
                '@type': 'Organization',
                name: 'SleekTools',
              },
              featureList: [
                'JSON Formatter and Validator',
                'XML Formatter and Validator',
                'SQL Formatter',
                'Base64 Encoder/Decoder',
                'UUID Generator',
                'Code Validators',
                'Text Utilities',
                'Developer Tools',
              ],
              screenshot: 'https://sleektools.vercel.app/icon-192x192.svg',
            }),
          }}
        />
      </head>
      <body style={{ fontFamily: 'Poppins, sans-serif' }} suppressHydrationWarning={true}>
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
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
