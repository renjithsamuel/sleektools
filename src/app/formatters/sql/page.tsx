import { Metadata } from 'next';
import { SQLFormatterTool } from '../../../components/Tools/SQLFormatter/SQLFormatterTool';

export const metadata: Metadata = {
  title: 'SQL Formatter & Beautifier - SleekTools',
  description:
    'Free online SQL formatter and beautifier. Format, beautify, and organize SQL queries with proper indentation and syntax highlighting.',
  keywords: [
    'SQL formatter',
    'SQL beautifier',
    'format SQL',
    'SQL prettifier',
    'SQL syntax highlighter',
    'beautify SQL',
    'organize SQL',
    'SQL tool',
    'database query formatter',
  ],
  openGraph: {
    title: 'SQL Formatter & Beautifier - SleekTools',
    description:
      'Free online SQL formatter and beautifier. Format, beautify, and organize SQL queries with proper indentation.',
    url: 'https://sleektools.vercel.app/formatters/sql',
  },
  alternates: {
    canonical: 'https://sleektools.vercel.app/formatters/sql',
  },
};

export default function SQLFormatterPage() {
  return <SQLFormatterTool />;
}
