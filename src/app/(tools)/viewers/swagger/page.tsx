import { SwaggerViewerTool } from '../../../../components/Tools/SwaggerViewer/SwaggerViewerTool';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Swagger/OpenAPI Viewer - SleekTools',
  description:
    'Parse and visualize Swagger/OpenAPI specifications. Free online API documentation viewer.',
};

export default function SwaggerViewerPage() {
  return <SwaggerViewerTool />;
}
