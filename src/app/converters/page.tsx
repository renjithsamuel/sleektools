import { Metadata } from 'next';
import { ToolsHomePage } from '../../containers/Home/ToolsHomePage';

export const metadata: Metadata = {
  title: 'Converters - Data Conversion Tools | SleekTools',
  description:
    'Powerful data converters for Base64, timestamps, encoding, and format transformations. Convert between different data formats effortlessly.',
  keywords: [
    'data converter',
    'base64 converter',
    'timestamp converter',
    'encoding converter',
    'format converter',
    'data transformation',
    'convert data',
    'encoding tools',
  ],
  openGraph: {
    title: 'Converters - Data Conversion Tools | SleekTools',
    description:
      'Powerful data converters for Base64, timestamps, encoding, and format transformations.',
    url: 'https://sleektools.vercel.app/converters',
  },
  alternates: {
    canonical: 'https://sleektools.vercel.app/converters',
  },
};

export default function ConvertersPage() {
  return <ToolsHomePage initialCategory="converters" />;
}
