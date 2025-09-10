import { Metadata } from 'next';
import { ToolsHomePage } from '../../containers/Home/ToolsHomePage';

export const metadata: Metadata = {
  title: 'Validators - Code Validation Tools | SleekTools',
  description:
    'Comprehensive code validators for JSON, XML, YAML, JWT, and more. Validate syntax, structure, and format with detailed error reporting.',
  keywords: [
    'code validator',
    'JSON validator',
    'XML validator',
    'YAML validator',
    'JWT validator',
    'syntax validator',
    'validate code',
    'check syntax',
    'validation tools',
  ],
  openGraph: {
    title: 'Validators - Code Validation Tools | SleekTools',
    description:
      'Comprehensive code validators for JSON, XML, YAML, JWT, and more. Validate syntax, structure, and format.',
    url: 'https://sleektools.vercel.app/validators',
  },
  alternates: {
    canonical: 'https://sleektools.vercel.app/validators',
  },
};

export default function ValidatorsPage() {
  return <ToolsHomePage initialCategory="validators" />;
}
