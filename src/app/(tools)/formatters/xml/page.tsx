import { XMLFormatterTool } from '../../../../components/Tools/XMLFormatter/XMLFormatterTool';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'XML Formatter - SleekTools',
  description:
    'Format and validate XML documents with customizable options. Free online XML formatter.',
};

export default function XMLFormatterPage() {
  return <XMLFormatterTool />;
}
