import { UUIDGeneratorTool } from '../../../../components/Tools/UUIDGenerator/UUIDGeneratorTool';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Password Generator - SleekTools',
  description:
    'Generate secure passwords with customizable length, character sets, and complexity options. Free online password generator tool.',
  keywords:
    'password generator, secure password, random password, strong password, password creator',
};

export default function PasswordGeneratorPage() {
  return <UUIDGeneratorTool />;
}
