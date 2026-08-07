-- Practitioner / team roster under each merchant storefront

CREATE TABLE IF NOT EXISTS practitioners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  slug VARCHAR(80) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  credential VARCHAR(255) NOT NULL,
  title VARCHAR(120),
  specialties TEXT[] NOT NULL DEFAULT '{}',
  bio TEXT,
  certifications TEXT[] NOT NULL DEFAULT '{}',
  headshot_url TEXT,
  video_url TEXT,
  rating NUMERIC(2,1),
  review_count INT NOT NULL DEFAULT 0,
  client_count INT NOT NULL DEFAULT 0,
  client_label VARCHAR(40) NOT NULL DEFAULT 'Patients',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (tenant_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_practitioners_tenant ON practitioners(tenant_id, sort_order);

ALTER TABLE practitioners ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS practitioners_access ON practitioners;
CREATE POLICY practitioners_access ON practitioners FOR ALL USING (
  current_setting('app.current_tenant_id', true) IS NULL
  OR tenant_id::text = current_setting('app.current_tenant_id', true)
);
