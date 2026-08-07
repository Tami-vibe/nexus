import Link from "next/link";
import { notFound } from "next/navigation";
import { getTenantByVat } from "@/lib/tenants";

export default async function TenantLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ vat: string }>;
}) {
  const { vat } = await params;
  const tenant = await getTenantByVat(decodeURIComponent(vat));
  if (!tenant) notFound();

  return (
    <div>
      <header className="absolute inset-x-0 top-0 z-20">
        <div className="nx-container flex items-center justify-between py-5 text-white">
          <Link href={`/${tenant.vat_number}`} className="text-sm font-semibold tracking-wide">
            {tenant.business_name}
          </Link>
          <nav className="flex items-center gap-4 text-sm text-white/85">
            <a href="#products">Shop</a>
            <a href="#services">Book</a>
            {tenant.walk_in_enabled ? <a href="#walk-in">Live</a> : null}
            <Link
              href={`/merchant/dashboard?vat=${encodeURIComponent(tenant.vat_number)}`}
              className="rounded-full bg-white/15 px-3 py-1.5 backdrop-blur"
            >
              Merchant CRM
            </Link>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
