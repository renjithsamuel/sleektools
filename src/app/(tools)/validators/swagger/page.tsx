import { SwaggerViewerTool } from '../../../../components/Tools/SwaggerViewer/SwaggerViewerTool';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Swagger Viewer - SleekTools',
  description:
    'View and validate OpenAPI/Swagger specifications online. Parse and visualize API documentation.',
  keywords: 'swagger viewer, OpenAPI validator, API documentation, swagger parser',
};

export default function SwaggerViewerPage() {
  return <SwaggerViewerTool />;
}
