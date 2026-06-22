import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DRIP - Wear Your World',
  description: 'A curated, editorial-quality digital fashion destination.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

