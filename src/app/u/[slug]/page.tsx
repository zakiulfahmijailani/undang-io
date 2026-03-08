import { redirect } from 'next/navigation';

export default async function PublicInvitationPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    redirect(`/invite/${params.slug}`);
}
