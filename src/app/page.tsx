import { ToolsHomePage } from '../containers/Home/ToolsHomePage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SleekTools - Professional Developer Tools Collection',
  description:
    'Comprehensive collection of free developer tools for JSON/XML/SQL formatting, validation, base64 conversion, UUID generation, and more. Professional online tools for developers and programmers.',
  keywords: [
    'developer tools',
    'JSON formatter',
    'XML formatter',
    'SQL formatter',
    'code validator',
    'base64 converter',
    'UUID generator',
    'online tools',
    'programming tools',
    'sleektools',
  ],
  openGraph: {
    title: 'SleekTools - Professional Developer Tools Collection',
    description:
      'Comprehensive collection of free developer tools for JSON/XML/SQL formatting, validation, base64 conversion, UUID generation, and more.',
    url: 'https://sleektools.vercel.app',
    siteName: 'SleekTools',
    images: [
      {
        url: '/icon-192x192.svg',
        width: 192,
        height: 192,
        alt: 'SleekTools Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SleekTools - Professional Developer Tools Collection',
    description:
      'Comprehensive collection of free developer tools for JSON/XML/SQL formatting, validation, base64 conversion, UUID generation, and more.',
    images: ['/icon-192x192.svg'],
  },
  alternates: {
    canonical: 'https://sleektools.vercel.app',
  },
};

export default function Page() {
  return <ToolsHomePage />;
}
