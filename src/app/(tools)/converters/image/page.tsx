import { ImageCompressorTool } from '../../../../components/Tools/ImageCompressor/ImageCompressorTool';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Image Compressor - SleekTools',
  description: 'Compress and optimize images online. Reduce file size while maintaining quality.',
  keywords: 'image compressor, image optimization, compress images, reduce file size',
};

export default function ImageCompressorPage() {
  return <ImageCompressorTool />;
}
