import { LoremIpsumGenerator } from '../../../../components/Tools/LoremGenerator/LoremIpsumGenerator';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lorem Ipsum Generator - SleekTools',
  description:
    'Generate placeholder text in multiple styles including classic Lorem Ipsum, Hipster, Pirate, and Zombie themes.',
  keywords: 'lorem ipsum generator, placeholder text, dummy text, filler text',
};

export default function LoremGeneratorPage() {
  return <LoremIpsumGenerator />;
}
