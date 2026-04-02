"use client";

import { Suspense } from 'react';
import AdminThemeEditorForm from '../components/AdminThemeEditorForm';

export default function NewThemePage() {
    return (
        <Suspense fallback={<div className="flex justify-center py-20">Memuat...</div>}>
            <AdminThemeEditorForm />
        </Suspense>
    );
}
