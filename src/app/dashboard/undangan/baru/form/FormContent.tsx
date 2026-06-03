"use client";

import { useSearchParams } from "next/navigation";
import InvitationEditorForm from "@/components/dashboard/InvitationEditorForm";
import { DEFAULT_INVITATION_THEME_KEY } from "@/lib/default-theme";

export default function FormContent() {
    const searchParams = useSearchParams();
    const temaId = searchParams.get("tema") || DEFAULT_INVITATION_THEME_KEY;

    return (
        <InvitationEditorForm isCreateMode={true} themeId={temaId} />
    );
}
