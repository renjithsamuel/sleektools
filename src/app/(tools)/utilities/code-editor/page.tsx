import { OnlineCodeEditor } from '../../../../components/Tools/CodeEditor/OnlineCodeEditor';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Online Code Editor - SleekTools',
  description:
    'Professional online code editor with syntax highlighting, multiple languages, code execution, and snippet saving.',
  keywords:
    'code editor, online IDE, syntax highlighting, code execution, programming, Monaco editor',
};

export default function CodeEditorPage() {
  return <OnlineCodeEditor />;
}
