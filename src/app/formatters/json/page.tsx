import { Metadata } from 'next';
import { JSONFormatterTool } from '../../../components/Tools/JSONFormatter/JSONFormatterTool';

export const metadata: Metadata = {
  title: 'JSON Formatter & Validator - SleekTools',
  description:
    'Free online JSON formatter and validator. Format, validate, and beautify JSON data with syntax highlighting. Supports minification and error detection.',
  keywords: [
    'JSON formatter',
    'JSON validator',
    'JSON beautifier',
    'JSON minifier',
    'format JSON',
    'validate JSON',
    'JSON syntax highlighter',
    'online JSON tool',
    'free JSON formatter',
  ],
  openGraph: {
    title: 'JSON Formatter & Validator - SleekTools',
    description:
      'Free online JSON formatter and validator. Format, validate, and beautify JSON data with syntax highlighting.',
    url: 'https://sleektools.vercel.app/formatters/json',
  },
  alternates: {
    canonical: 'https://sleektools.vercel.app/formatters/json',
  },
};

export default function JSONFormatterPage() {
  return <JSONFormatterTool />;
}
