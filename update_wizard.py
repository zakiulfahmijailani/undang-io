import re
import sys

filepath = 'src/app/(public)/buat-undangan/_components/buat-undangan-content.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Import InvitationEditorForm and InvitationEditorInitialData
if 'import InvitationEditorForm' not in content:
    content = content.replace(
        'import { LivePreviewWorkspace } from "@/components/preview/LivePreviewWorkspace";',
        'import { LivePreviewWorkspace } from "@/components/preview/LivePreviewWorkspace";\nimport InvitationEditorForm, { type InvitationEditorInitialData } from "@/components/dashboard/InvitationEditorForm";'
    )

# 2. Replace InvitationForm with Partial<InvitationEditorInitialData>
content = re.sub(
    r'type InvitationForm = \{.*?\n\};',
    '',
    content,
    flags=re.DOTALL
)

content = re.sub(
    r'const defaultForm: InvitationForm = \{.*?\n\};',
    '''const defaultForm: Partial<InvitationEditorInitialData> = {
  groom_full_name: "",
  groom_nickname: "",
  bride_full_name: "",
  bride_nickname: "",
};''',
    content,
    flags=re.DOTALL
)

content = content.replace('const [form, setForm] = useState<InvitationForm>(defaultForm);', 'const [form, setForm] = useState<Partial<InvitationEditorInitialData>>(defaultForm);')

# 3. Update useEffect and draft reading
draft_replacement = '''
    if (groomFromUrl || brideFromUrl) {
      setForm((previous) => ({
        ...previous,
        groom_full_name: groomFromUrl || previous.groom_full_name,
        groom_nickname: groomFromUrl || previous.groom_nickname,
        bride_full_name: brideFromUrl || previous.bride_full_name,
        bride_nickname: brideFromUrl || previous.bride_nickname,
      }));
    }

    try {
      const raw = sessionStorage.getItem("undang_draft");
      if (raw) {
        const draft = JSON.parse(raw) as any;
        setForm((previous) => ({
          ...previous,
          ...draft,
        }));
        if (draft.themeId) {
          const draftTheme = themeOptions.find((theme) => theme.id === draft.themeId || theme.slug === draft.themeId);
          if (draftTheme) setSelectedThemeId(draftTheme.id);
        }
        sessionStorage.removeItem("undang_draft");
      }
    } catch (error) {
      console.error("[buat-undangan] Failed to read draft:", error);
    }
'''
content = re.sub(
    r'    if \(groomFromUrl \|\| brideFromUrl\) \{.*?\} catch \(error\) \{\s*console\.error\("\[buat-undangan\] Failed to read draft:", error\);\s*\}',
    draft_replacement.strip(),
    content,
    flags=re.DOTALL
)

# 4. Remove `function update` as it's no longer used
content = re.sub(r'  function update\(key: keyof InvitationForm, value: string\) \{\s*setForm\(\(previous\) => \(\{ \.\.\.previous, \[key\]: value \}\)\);\s*\}', '', content)

# 5. Fix generateSlug usages
content = content.replace('form.groomNickname || form.groomFullName', 'form.groom_nickname || form.groom_full_name')
content = content.replace('form.brideNickname || form.brideFullName', 'form.bride_nickname || form.bride_full_name')
content = content.replace('form.groomNickname', 'form.groom_nickname')
content = content.replace('form.brideNickname', 'form.bride_nickname')


# 6. Replace Step 2 with InvitationEditorForm
step2_pattern = r'      \{step === 2 \? \(\s*<LivePreviewWorkspace.*?preview=\{\s*<InvitationPreviewShell.*?\/>\s*\}\s*\/>\s*\) : null\}'
step2_replacement = '''      {step === 2 ? (
        <div className="min-h-[calc(100dvh-4rem)]">
          <InvitationEditorForm
            initialData={form}
            themeId={selectedThemeId}
            themeKey={selectedTheme?.slug}
            wizardMode={true}
            onWizardNext={(data) => {
              setForm(data);
              setStep(3);
            }}
          />
        </div>
      ) : null}'''
content = re.sub(step2_pattern, step2_replacement, content, flags=re.DOTALL)


with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated buat-undangan-content.tsx")
