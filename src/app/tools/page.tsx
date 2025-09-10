import { Metadata } from 'next';
import { ToolsHomePage } from '../../containers/Home/ToolsHomePage';

export const metadata: Metadata = {
  title: 'All Developer Tools | SleekTools',
  description:
    'Comprehensive collection of professional developer tools including formatters, validators, converters, generators, and utilities. All tools in one place.',
  keywords: [
    'developer tools',
    'all tools',
    'programming tools',
    'code tools',
    'web development tools',
    'developer utilities',
    'online tools',
    'free developer tools',
  ],
  openGraph: {
    title: 'All Developer Tools | SleekTools',
    description:
      'Comprehensive collection of professional developer tools including formatters, validators, converters, generators, and utilities.',
    url: 'https://sleektools.vercel.app/tools',
  },
  alternates: {
    canonical: 'https://sleektools.vercel.app/tools',
  },
};

export default function ToolsPage() {
  return <ToolsHomePage />;
}
