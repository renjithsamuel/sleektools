import { CSSFormatterTool } from '../../../../components/Tools/CSSFormatter/CSSFormatterTool';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CSS Formatter - SleekTools',
  description: 'Format and beautify CSS code with customizable indentation and styling options.',
  keywords: 'CSS formatter, CSS beautifier, code formatter, CSS indentation',
};

export default function CSSFormatterPage() {
  return <CSSFormatterTool />;
}
