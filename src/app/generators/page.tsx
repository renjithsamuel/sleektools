import { Metadata } from 'next';
import { ToolsHomePage } from '../../containers/Home/ToolsHomePage';

export const metadata: Metadata = {
  title: 'Generators - Code Generation Tools | SleekTools',
  description:
    'Professional code and data generators including UUID, passwords, test data, and more. Generate secure and random data for development.',
  keywords: [
    'code generator',
    'UUID generator',
    'password generator',
    'test data generator',
    'random generator',
    'generate UUID',
    'generate data',
    'developer generators',
  ],
  openGraph: {
    title: 'Generators - Code Generation Tools | SleekTools',
    description:
      'Professional code and data generators including UUID, passwords, test data, and more.',
    url: 'https://sleektools.vercel.app/generators',
  },
  alternates: {
    canonical: 'https://sleektools.vercel.app/generators',
  },
};

export default function GeneratorsPage() {
  return <ToolsHomePage initialCategory="generators" />;
}
