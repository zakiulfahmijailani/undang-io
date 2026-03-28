import { Suspense } from 'react';
import BuatClient from './BuatClient';

export const metadata = {
  title: 'Buat Undangan | undang.io',
  description: 'Buat undangan digital pernikahan Anda dalam hitungan menit.',
};

export default function BuatPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-surface-lowest-stitch"><div className="w-12 h-12 border-4 border-primary-stitch border-t-transparent rounded-full animate-spin"></div></div>}>
      <BuatClient />
    </Suspense>
  );
}
