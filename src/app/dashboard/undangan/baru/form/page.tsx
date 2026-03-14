import { Suspense } from "react";
import FormContent from "./FormContent";

export default function NewInvitationFormPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Memuat...</div>}>
      <FormContent />
    </Suspense>
  );
}
