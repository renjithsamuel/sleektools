import { Metadata } from 'next';
import { Base64Tool } from '../../../components/Tools/Base64/Base64Tool';

export const metadata: Metadata = {
  title: 'Base64 Encoder & Decoder - SleekTools',
  description:
    'Free online Base64 encoder and decoder. Convert text to Base64 and decode Base64 to text. Supports file encoding and bulk operations.',
  keywords: [
    'base64 encoder',
    'base64 decoder',
    'base64 converter',
    'encode base64',
    'decode base64',
    'base64 tool',
    'online base64',
    'free base64 converter',
    'text to base64',
    'base64 to text',
  ],
  openGraph: {
    title: 'Base64 Encoder & Decoder - SleekTools',
    description:
      'Free online Base64 encoder and decoder. Convert text to Base64 and decode Base64 to text.',
    url: 'https://sleektools.vercel.app/converters/base64',
  },
  alternates: {
    canonical: 'https://sleektools.vercel.app/converters/base64',
  },
};

export default function Base64Page() {
  return <Base64Tool />;
}
