-- Commerce offers + unified CRM events (course correction)

ALTER TABLE tenants
  ADD COLUMN IF NOT EXISTS walk_in_enabled BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS tagline TEXT,
  ADD COLUMN IF NOT EXISTS hero_image_url TEXT,
  ADD COLUMN IF NOT EXISTS testimonial_quote TEXT,
  ADD COLUMN IF NOT EXISTS testimonial_author TEXT;

-- Expand sector vocabulary (existing CHECK not present; document via app types)
-- GYM | SALON | CLINIC | POOL | RETAIL | ARTISAN | DIGITAL | CONSULTING

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price_cents INT NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'ils',
  kind VARCHAR(20) NOT NULL DEFAULT 'PHYSICAL', -- PHYSICAL | DIGITAL | HANDCRAFT
  image_url TEXT,
  in_stock BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  duration_minutes INT NOT NULL DEFAULT 30,
  price_cents INT NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'ils',
  image_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  lead_id UUID REFERENCES lead_profiles(id) ON DELETE SET NULL,
  starts_at TIMESTAMPTZ NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'BOOKED', -- BOOKED | CANCELLED | COMPLETED
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES lead_profiles(id) ON DELETE SET NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  amount_cents INT NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'ils',
  status VARCHAR(20) NOT NULL DEFAULT 'PAID', -- CART | PAID | REFUNDED
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS crm_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES lead_profiles(id) ON DELETE SET NULL,
  event_type VARCHAR(50) NOT NULL,
  title TEXT,
  payload JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES lead_profiles(id) ON DELETE SET NULL,
  role VARCHAR(20) NOT NULL, -- user | assistant
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_tenant ON products(tenant_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_services_tenant ON services(tenant_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_crm_events_tenant_created ON crm_events(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_appointments_tenant_starts ON appointments(tenant_id, starts_at);
CREATE INDEX IF NOT EXISTS idx_orders_tenant_created ON orders(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_lead ON chat_messages(lead_id, created_at);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS products_access ON products;
CREATE POLICY products_access ON products FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS services_access ON services;
CREATE POLICY services_access ON services FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS appointments_access ON appointments;
CREATE POLICY appointments_access ON appointments FOR ALL USING (
  public.requesting_vat() IS NULL OR public.requesting_vat() = ''
  OR tenant_id IN (SELECT id FROM tenants WHERE vat_number = public.requesting_vat())
) WITH CHECK (true);

DROP POLICY IF EXISTS orders_access ON orders;
CREATE POLICY orders_access ON orders FOR ALL USING (
  public.requesting_vat() IS NULL OR public.requesting_vat() = ''
  OR tenant_id IN (SELECT id FROM tenants WHERE vat_number = public.requesting_vat())
) WITH CHECK (true);

DROP POLICY IF EXISTS crm_events_access ON crm_events;
CREATE POLICY crm_events_access ON crm_events FOR ALL USING (
  public.requesting_vat() IS NULL OR public.requesting_vat() = ''
  OR tenant_id IN (SELECT id FROM tenants WHERE vat_number = public.requesting_vat())
) WITH CHECK (true);

DROP POLICY IF EXISTS chat_messages_access ON chat_messages;
CREATE POLICY chat_messages_access ON chat_messages FOR ALL USING (
  public.requesting_vat() IS NULL OR public.requesting_vat() = ''
  OR tenant_id IN (SELECT id FROM tenants WHERE vat_number = public.requesting_vat())
) WITH CHECK (true);
