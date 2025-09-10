import { Metadata } from 'next';
import { ToolsHomePage } from '../../containers/Home/ToolsHomePage';

export const metadata: Metadata = {
  title: 'Formatters - Code Formatting Tools | SleekTools',
  description:
    'Professional code formatters for JSON, XML, SQL, HTML, CSS, and more. Format and beautify your code with syntax highlighting and validation.',
  keywords: [
    'code formatter',
    'JSON formatter',
    'XML formatter',
    'SQL formatter',
    'HTML formatter',
    'CSS formatter',
    'code beautifier',
    'format code',
    'prettify code',
  ],
  openGraph: {
    title: 'Formatters - Code Formatting Tools | SleekTools',
    description:
      'Professional code formatters for JSON, XML, SQL, HTML, CSS, and more. Format and beautify your code with syntax highlighting.',
    url: 'https://sleektools.vercel.app/formatters',
  },
  alternates: {
    canonical: 'https://sleektools.vercel.app/formatters',
  },
};

export default function FormattersPage() {
  return <ToolsHomePage initialCategory="formatters" />;
}
