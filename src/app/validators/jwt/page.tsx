import { Metadata } from 'next';
import { JWTDecoderTool } from '../../../components/Tools/JWTDecoder/JWTDecoderTool';

export const metadata: Metadata = {
  title: 'JWT Decoder & Validator - SleekTools',
  description:
    'Free online JWT (JSON Web Token) decoder and validator. Decode JWT headers, payloads, and verify signatures. Debug and analyze JWT tokens safely.',
  keywords: [
    'JWT decoder',
    'JWT validator',
    'JSON Web Token',
    'decode JWT',
    'JWT debugger',
    'token decoder',
    'JWT parser',
    'validate JWT',
    'JWT analyzer',
    'JWT tool',
  ],
  openGraph: {
    title: 'JWT Decoder & Validator - SleekTools',
    description:
      'Free online JWT (JSON Web Token) decoder and validator. Decode JWT headers, payloads, and verify signatures.',
    url: 'https://sleektools.vercel.app/validators/jwt',
  },
  alternates: {
    canonical: 'https://sleektools.vercel.app/validators/jwt',
  },
};

export default function JWTDecoderPage() {
  return <JWTDecoderTool />;
}
