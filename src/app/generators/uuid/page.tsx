import { Metadata } from 'next';
import { UUIDGeneratorTool } from '../../../components/Tools/UUIDGenerator/UUIDGeneratorTool';

export const metadata: Metadata = {
  title: 'UUID Generator - SleekTools',
  description:
    'Free online UUID generator. Generate UUID v1, v4, and v5 with bulk generation support. Perfect for developers and database administrators.',
  keywords: [
    'UUID generator',
    'GUID generator',
    'UUID v4',
    'UUID v1',
    'UUID v5',
    'unique identifier',
    'random UUID',
    'bulk UUID generator',
    'online UUID tool',
    'free UUID generator',
  ],
  openGraph: {
    title: 'UUID Generator - SleekTools',
    description:
      'Free online UUID generator. Generate UUID v1, v4, and v5 with bulk generation support.',
    url: 'https://sleektools.vercel.app/generators/uuid',
  },
  alternates: {
    canonical: 'https://sleektools.vercel.app/generators/uuid',
  },
};

export default function UUIDGeneratorPage() {
  return <UUIDGeneratorTool />;
}
