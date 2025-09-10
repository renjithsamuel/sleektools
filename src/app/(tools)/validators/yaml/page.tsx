import { YAMLValidatorTool } from '../../../../components/Tools/YAMLValidator/YAMLValidatorTool';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'YAML Validator - SleekTools',
  description: 'Validate YAML syntax and structure. Free online YAML validation tool.',
};

export default function YAMLValidatorPage() {
  return <YAMLValidatorTool />;
}
