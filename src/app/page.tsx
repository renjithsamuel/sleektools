import { ToolsHomePage } from '../containers/Home/ToolsHomePage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SleekTools - Professional Developer Tools',
  description:
    'Format, validate, convert, and generate with our comprehensive collection of developer tools.',
};

export default function Page() {
  return <ToolsHomePage />;
}
