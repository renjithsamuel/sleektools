import { ImageCompressorTool } from '../../../../components/Tools/ImageCompressor/ImageCompressorTool';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Image Compressor - SleekTools',
  description:
    'Compress images to reduce file sizes while maintaining quality. Free online image compression tool.',
};

export default function ImageCompressorPage() {
  return <ImageCompressorTool />;
}
