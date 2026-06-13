import { redirect } from "next/navigation";

export default async function ClaimedGuestSessionEditPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/buat-undangan?resume=${encodeURIComponent(slug)}`);
}
