import { Metadata } from 'next';
import { ToolsHomePage } from '../../containers/Home/ToolsHomePage';

export const metadata: Metadata = {
  title: 'Utilities - Developer Tools | SleekTools',
  description:
    'Collection of essential developer utilities including text comparison, code editors, file converters, and more. Professional tools for everyday development tasks.',
  keywords: [
    'developer utilities',
    'text compare',
    'code editor',
    'file converter',
    'utility tools',
    'developer tools',
    'programming utilities',
    'online utilities',
  ],
  openGraph: {
    title: 'Utilities - Developer Tools | SleekTools',
    description:
      'Collection of essential developer utilities including text comparison, code editors, file converters, and more.',
    url: 'https://sleektools.vercel.app/utilities',
  },
  alternates: {
    canonical: 'https://sleektools.vercel.app/utilities',
  },
};

export default function UtilitiesPage() {
  return <ToolsHomePage initialCategory="utilities" />;
}
