-- Phase 3: GDPR consent audit trail (local storage rules companion)

CREATE TABLE IF NOT EXISTS consent_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_key VARCHAR(64) NOT NULL, -- hashed phone or anonymous id
  analytics BOOLEAN NOT NULL DEFAULT false,
  marketing BOOLEAN NOT NULL DEFAULT false,
  source VARCHAR(40) NOT NULL DEFAULT 'web',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE consent_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS consent_events_service ON consent_events;
CREATE POLICY consent_events_service ON consent_events
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE TABLE IF NOT EXISTS probe_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  probe_hash VARCHAR(64) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE probe_signals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS probe_signals_isolation ON probe_signals;
CREATE POLICY probe_signals_isolation ON probe_signals
  FOR ALL
  USING (
    public.requesting_vat() IS NULL OR public.requesting_vat() = ''
    OR tenant_id IN (SELECT id FROM tenants WHERE vat_number = public.requesting_vat())
  )
  WITH CHECK (true);
