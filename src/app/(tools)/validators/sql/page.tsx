import { SQLValidatorTool } from '../../../../components/Tools/SQLValidator/SQLValidatorTool';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SQL Validator - SleekTools',
  description:
    'Validate SQL syntax and get suggestions for improvement. Free online SQL validation tool.',
};

export default function SQLValidatorPage() {
  return <SQLValidatorTool />;
}
