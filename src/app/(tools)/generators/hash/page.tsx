import { UUIDGeneratorTool } from '../../../../components/Tools/UUIDGenerator/UUIDGeneratorTool';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hash Generator - SleekTools',
  description:
    'Generate MD5, SHA1, SHA256, SHA512 hashes for any text input. Free online hash generator and checksum tool.',
  keywords: 'hash generator, MD5, SHA1, SHA256, SHA512, checksum, hash calculator, crypto hash',
};

export default function HashGeneratorPage() {
  return <UUIDGeneratorTool />;
}
