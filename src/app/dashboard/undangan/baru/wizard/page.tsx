import { Suspense } from "react";
import FormContent from "@/app/dashboard/undangan/baru/form/FormContent";

export default function NewInvitationWizardPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center">Memuat editor undangan...</div>}>
      <FormContent />
    </Suspense>
  );
}
