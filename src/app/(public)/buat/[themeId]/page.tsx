import { Suspense } from 'react';
import BuatClient from './BuatClient';

export const metadata = {
  title: 'Isi Data Undangan | undang.io',
  description: 'Proses pembuatan undangan real-time.',
};

interface SplitePageProps {
  params: Promise<{ themeId: string }>;
}

export default async function SplitePage({ params }: SplitePageProps) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-surface-lowest-stitch"><div className="w-12 h-12 border-4 border-primary-stitch border-t-transparent rounded-full animate-spin"></div></div>}>
      <BuatClient themeId={resolvedParams.themeId} />
    </Suspense>
  );
}
