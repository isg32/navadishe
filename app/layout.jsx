import { Fraunces, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-mono',
  display: 'swap',
});

const SITE_URL = 'https://navadishe.vercel.app';
const TITLE = "Nava Dishe — Karnataka's Annual Mega Scholarship & Talent Recognition Exam";
const DESCRIPTION =
  'A free, statewide talent recognition examination for Class 10, 11 and 12 students across all 31 districts of Karnataka. Prizes worth ₹1 Crore, zero registration fee. Presented by News First.';
const OG_IMAGE = `${SITE_URL}/images/banner.png`;

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  authors: [{ name: 'News First' }],
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
  icons: { icon: '/images/01_NavaDishe_emblem_icon.png' },
  openGraph: {
    type: 'website',
    siteName: 'Nava Dishe',
    locale: 'en_IN',
    url: SITE_URL,
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: OG_IMAGE, width: 1024, height: 1536, alt: 'Nava Dishe — Karnataka students' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#16324A',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
