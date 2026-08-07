import Link from "next/link";
import { formatMoney } from "@/lib/commerce/money";
import { BroadcastEngine } from "@/components/crm/BroadcastEngine";

export interface DashboardPayload {
  tenant: { vat_number: string; business_name: string; sector: string };
  leads: Array<{
    id: string;
    phone: string;
    intent_score: number;
    lifecycle_stage: string;
    last_engagement: string | Date;
  }>;
  events: Array<{
    id: string;
    event_type: string;
    title: string | null;
    created_at: string | Date;
  }>;
  orders: Array<{
    id: string;
    amount_cents: number;
    currency: string;
    product_name: string | null;
    phone: string | null;
    created_at: string | Date;
  }>;
  appointments: Array<{
    id: string;
    starts_at: string | Date;
    service_name: string | null;
    phone: string | null;
  }>;
  chats: Array<{
    id: string;
    role: string;
    content: string;
    phone: string | null;
    created_at: string | Date;
  }>;
}

function stageColumn(stage: string) {
  if (stage === "ACTIVE_MEMBER") return "customers";
  if (stage === "HOT_LEAD") return "hot";
  return "prospects";
}

function when(value: string | Date) {
  return new Date(value).toLocaleString();
}

export function MerchantDashboard({ data }: { data: DashboardPayload }) {
  const columns = {
    prospects: [] as DashboardPayload["leads"],
    hot: [] as DashboardPayload["leads"],
    customers: [] as DashboardPayload["leads"],
  };
  for (const lead of data.leads) {
    columns[stageColumn(lead.lifecycle_stage)].push(lead);
  }

  return (
    <div className="min-h-screen bg-[var(--paper)]">
      <header className="border-b border-[var(--line)] bg-white/80 backdrop-blur">
        <div className="nx-container flex flex-wrap items-center justify-between gap-4 py-5">
          <div>
            <p className="nx-eyebrow">Merchant CRM</p>
            <h1 className="text-2xl font-semibold">{data.tenant.business_name}</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/merchant/dashboard?vat=${encodeURIComponent(data.tenant.vat_number)}`}
              className="nx-btn nx-btn-ghost !py-2 text-sm"
            >
              Refresh
            </Link>
            <Link
              href={`/${data.tenant.vat_number}`}
              className="nx-btn nx-btn-primary !py-2 text-sm"
            >
              View storefront
            </Link>
          </div>
        </div>
      </header>

      <main className="nx-container space-y-8 py-8">
        <BroadcastEngine
          vat={data.tenant.vat_number}
          businessName={data.tenant.business_name}
          products={data.orders}
          appointments={data.appointments}
          hotLeadCount={columns.hot.length}
        />

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Hot leads", value: columns.hot.length },
            { label: "Recent purchases", value: data.orders.length },
            { label: "Upcoming appointments", value: data.appointments.length },
            { label: "Live events", value: data.events.length },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-3xl border border-[var(--line)] bg-white p-5"
            >
              <p className="text-sm text-[var(--muted)]">{stat.label}</p>
              <p className="mt-2 text-3xl font-semibold">{stat.value}</p>
            </div>
          ))}
        </section>

        <section>
          <h2 className="text-lg font-semibold">Lead pipeline</h2>
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            {(
              [
                ["prospects", "Prospects"],
                ["hot", "Hot leads"],
                ["customers", "Customers"],
              ] as const
            ).map(([key, label]) => (
              <div
                key={key}
                className="rounded-3xl border border-[var(--line)] bg-white/80 p-4"
              >
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                  {label}
                </p>
                <div className="space-y-3">
                  {columns[key].length === 0 ? (
                    <p className="rounded-2xl border border-dashed border-[var(--line)] p-4 text-sm text-[var(--muted)]">
                      Waiting for storefront activity
                    </p>
                  ) : (
                    columns[key].map((lead) => (
                      <article
                        key={lead.id}
                        className="rounded-2xl border border-[var(--line)] bg-white p-4"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-medium">{lead.phone}</p>
                          <span className="rounded-full bg-[var(--accent-soft)] px-2 py-0.5 text-xs font-bold text-[var(--accent)]">
                            {lead.intent_score}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-[var(--muted)]">
                          {lead.lifecycle_stage.replace(/_/g, " ")} ·{" "}
                          {when(lead.last_engagement)}
                        </p>
                      </article>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-[var(--line)] bg-white p-5">
            <h2 className="text-lg font-semibold">Recent purchases</h2>
            <ul className="mt-4 space-y-3">
              {data.orders.length === 0 ? (
                <li className="text-sm text-[var(--muted)]">No purchases yet</li>
              ) : (
                data.orders.map((order) => (
                  <li
                    key={order.id}
                    className="flex items-center justify-between gap-3 border-b border-[var(--line)] pb-3 text-sm last:border-0"
                  >
                    <div>
                      <p className="font-medium">
                        {order.product_name || "Order"}
                      </p>
                      <p className="text-[var(--muted)]">{order.phone}</p>
                    </div>
                    <p className="font-semibold">
                      {formatMoney(order.amount_cents, order.currency)}
                    </p>
                  </li>
                ))
              )}
            </ul>
          </div>

          <div className="rounded-3xl border border-[var(--line)] bg-white p-5">
            <h2 className="text-lg font-semibold">Upcoming appointments</h2>
            <ul className="mt-4 space-y-3">
              {data.appointments.length === 0 ? (
                <li className="text-sm text-[var(--muted)]">No bookings yet</li>
              ) : (
                data.appointments.map((appt) => (
                  <li
                    key={appt.id}
                    className="border-b border-[var(--line)] pb-3 text-sm last:border-0"
                  >
                    <p className="font-medium">{appt.service_name}</p>
                    <p className="text-[var(--muted)]">
                      {when(appt.starts_at)} · {appt.phone}
                    </p>
                  </li>
                ))
              )}
            </ul>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-[var(--line)] bg-white p-5">
            <h2 className="text-lg font-semibold">Live activity</h2>
            <ul className="mt-4 max-h-80 space-y-3 overflow-y-auto">
              {data.events.map((event) => (
                <li key={event.id} className="text-sm">
                  <p className="font-medium">
                    {event.title || event.event_type}
                  </p>
                  <p className="text-xs text-[var(--muted)]">
                    {event.event_type} · {when(event.created_at)}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-[var(--line)] bg-white p-5">
            <h2 className="text-lg font-semibold">Chat transcripts</h2>
            <ul className="mt-4 max-h-80 space-y-3 overflow-y-auto">
              {data.chats.length === 0 ? (
                <li className="text-sm text-[var(--muted)]">
                  Conversations appear as visitors talk to the AI agent.
                </li>
              ) : (
                data.chats.map((chat) => (
                  <li
                    key={chat.id}
                    className="rounded-2xl bg-[var(--paper)] p-3 text-sm"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                      {chat.role} · {chat.phone || "lead"}
                    </p>
                    <p className="mt-1">{chat.content}</p>
                  </li>
                ))
              )}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
