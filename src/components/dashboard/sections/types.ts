import { InvitationEditorInitialData } from "@/components/dashboard/InvitationEditorForm"

export type SectionFormProps = {
  data: Partial<InvitationEditorInitialData>
  onChange: (patch: Partial<InvitationEditorInitialData>) => void
}
