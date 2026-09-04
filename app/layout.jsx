import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

const SITE_URL = 'https://navadishe.vercel.app';
const TITLE = 'Nava Dishe — Annual Mega-Scholarship & Talent Recognition Exam';
const DESCRIPTION =
  'A free, statewide scholarship and talent recognition exam for Class 10–12 students across Karnataka. ₹1 Crore in total rewards, zero entry fee.';
const OG_IMAGE = `${SITE_URL}/images/pillar-english.jpg`;

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: 'Nava Dishe by News First — a free, statewide scholarship and talent recognition exam for Class 10–12 students across Karnataka. ₹1 Crore in total rewards.',
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
    images: [{ url: OG_IMAGE, width: 1200, height: 800, alt: 'Students taking the Nava Dishe scholarship exam' }],
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
  themeColor: '#1F4FD8',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable}`}>
      <body>{children}</body>
    </html>
  );
}
