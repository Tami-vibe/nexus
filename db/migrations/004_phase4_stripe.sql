-- Phase 4: Stripe Connect merchant linkage

ALTER TABLE tenants
  ADD COLUMN IF NOT EXISTS stripe_account_id VARCHAR(255),
  ADD COLUMN IF NOT EXISTS custom_domain VARCHAR(255);

CREATE UNIQUE INDEX IF NOT EXISTS tenants_custom_domain_uidx
  ON tenants (custom_domain)
  WHERE custom_domain IS NOT NULL;

CREATE TABLE IF NOT EXISTS payment_intents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  hold_id UUID REFERENCES capacity_holds(id),
  provider VARCHAR(20) NOT NULL DEFAULT 'mock',
  provider_ref VARCHAR(255),
  amount_cents INT NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'ils',
  status VARCHAR(30) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE payment_intents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS payment_intents_isolation ON payment_intents;
CREATE POLICY payment_intents_isolation ON payment_intents
  FOR ALL
  USING (
    public.requesting_vat() IS NULL OR public.requesting_vat() = ''
    OR tenant_id IN (SELECT id FROM tenants WHERE vat_number = public.requesting_vat())
  )
  WITH CHECK (
    public.requesting_vat() IS NULL OR public.requesting_vat() = ''
    OR tenant_id IN (SELECT id FROM tenants WHERE vat_number = public.requesting_vat())
  );
