import { TimestampConverterTool } from '../../../../components/Tools/TimestampConverter/TimestampConverterTool';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Timestamp Converter - SleekTools',
  description:
    'Convert between Unix timestamps and human-readable dates. Free online timestamp converter tool.',
};

export default function TimestampConverterPage() {
  return <TimestampConverterTool />;
}
