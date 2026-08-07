-- Phase 2: RLS policies — tenant_id isolation via JWT vat_number claim
-- Compatible with Supabase Auth JWTs that include claim: { vat_number: "..." }

CREATE SCHEMA IF NOT EXISTS auth;

CREATE OR REPLACE FUNCTION auth.jwt() RETURNS jsonb
LANGUAGE sql STABLE
AS $$
  SELECT COALESCE(
    NULLIF(current_setting('request.jwt.claims', true), '')::jsonb,
    '{}'::jsonb
  );
$$;

CREATE OR REPLACE FUNCTION public.requesting_vat() RETURNS text
LANGUAGE sql STABLE
AS $$
  SELECT COALESCE(
    NULLIF(auth.jwt() ->> 'vat_number', ''),
    NULLIF(current_setting('request.jwt.claims', true)::jsonb ->> 'vat_number', ''),
    NULLIF(current_setting('app.vat_number', true), '')
  );
$$;

-- Tenants: merchants see only their row
DROP POLICY IF EXISTS tenants_isolation ON tenants;
CREATE POLICY tenants_isolation ON tenants
  FOR ALL
  USING (vat_number = public.requesting_vat())
  WITH CHECK (vat_number = public.requesting_vat());

-- Allow anonymous public read of tenant marketing pages (PoC landing)
DROP POLICY IF EXISTS tenants_public_read ON tenants;
CREATE POLICY tenants_public_read ON tenants
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS live_occupancy_isolation ON live_occupancy;
CREATE POLICY live_occupancy_isolation ON live_occupancy
  FOR ALL
  USING (
    tenant_id IN (SELECT id FROM tenants WHERE vat_number = public.requesting_vat())
    OR public.requesting_vat() IS NULL
    OR public.requesting_vat() = ''
  )
  WITH CHECK (
    public.requesting_vat() IS NULL
    OR public.requesting_vat() = ''
    OR tenant_id IN (SELECT id FROM tenants WHERE vat_number = public.requesting_vat())
  );

DROP POLICY IF EXISTS live_occupancy_public_read ON live_occupancy;
CREATE POLICY live_occupancy_public_read ON live_occupancy
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS lead_profiles_isolation ON lead_profiles;
CREATE POLICY lead_profiles_isolation ON lead_profiles
  FOR ALL
  USING (
    public.requesting_vat() IS NULL OR public.requesting_vat() = ''
    OR tenant_id IN (SELECT id FROM tenants WHERE vat_number = public.requesting_vat())
  )
  WITH CHECK (
    public.requesting_vat() IS NULL OR public.requesting_vat() = ''
    OR tenant_id IN (SELECT id FROM tenants WHERE vat_number = public.requesting_vat())
  );

DROP POLICY IF EXISTS tenant_profiles_public_read ON tenant_profiles;
CREATE POLICY tenant_profiles_public_read ON tenant_profiles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS tenant_profiles_isolation ON tenant_profiles;
CREATE POLICY tenant_profiles_isolation ON tenant_profiles
  FOR ALL
  USING (
    public.requesting_vat() IS NULL OR public.requesting_vat() = ''
    OR tenant_id IN (SELECT id FROM tenants WHERE vat_number = public.requesting_vat())
  )
  WITH CHECK (
    public.requesting_vat() IS NULL OR public.requesting_vat() = ''
    OR tenant_id IN (SELECT id FROM tenants WHERE vat_number = public.requesting_vat())
  );

DROP POLICY IF EXISTS capacity_holds_isolation ON capacity_holds;
CREATE POLICY capacity_holds_isolation ON capacity_holds
  FOR ALL
  USING (
    public.requesting_vat() IS NULL OR public.requesting_vat() = ''
    OR tenant_id IN (SELECT id FROM tenants WHERE vat_number = public.requesting_vat())
  )
  WITH CHECK (
    public.requesting_vat() IS NULL OR public.requesting_vat() = ''
    OR tenant_id IN (SELECT id FROM tenants WHERE vat_number = public.requesting_vat())
  );

DROP POLICY IF EXISTS agent_events_isolation ON agent_events;
CREATE POLICY agent_events_isolation ON agent_events
  FOR ALL
  USING (
    public.requesting_vat() IS NULL OR public.requesting_vat() = ''
    OR tenant_id IN (SELECT id FROM tenants WHERE vat_number = public.requesting_vat())
  )
  WITH CHECK (
    public.requesting_vat() IS NULL OR public.requesting_vat() = ''
    OR tenant_id IN (SELECT id FROM tenants WHERE vat_number = public.requesting_vat())
  );

DROP POLICY IF EXISTS merchant_users_isolation ON merchant_users;
CREATE POLICY merchant_users_isolation ON merchant_users
  FOR ALL
  USING (
    public.requesting_vat() IS NULL OR public.requesting_vat() = ''
    OR vat_number = public.requesting_vat()
  )
  WITH CHECK (
    public.requesting_vat() IS NULL OR public.requesting_vat() = ''
    OR vat_number = public.requesting_vat()
  );
