import { redirect } from "next/navigation";

export default async function BookPage({
  params,
}: {
  params: Promise<{ vat: string }>;
}) {
  const { vat } = await params;
  redirect(`/${vat}#services`);
}
