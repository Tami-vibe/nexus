-- Phase 1 core schema (Master Plan §4 + PoC extensions)

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Multi-Tenant Business Registry
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vat_number VARCHAR(50) UNIQUE NOT NULL,
    business_name VARCHAR(255) NOT NULL,
    sector VARCHAR(50) NOT NULL, -- 'GYM', 'SALON', 'CLINIC', 'POOL'
    max_capacity INT NOT NULL DEFAULT 20,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

-- 2. Ambient Capacity & Live State
CREATE TABLE IF NOT EXISTS live_occupancy (
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    current_occupancy INT NOT NULL DEFAULT 0,
    last_signal_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    signal_source VARCHAR(50) DEFAULT 'POS_WEBHOOK', -- 'POS_WEBHOOK', 'WIFI_PROBE', 'ML_PREDICTIVE'
    PRIMARY KEY (tenant_id)
);

ALTER TABLE live_occupancy ENABLE ROW LEVEL SECURITY;

-- 3. Lead Velocity & CRM Profile
CREATE TABLE IF NOT EXISTS lead_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    phone VARCHAR(20) NOT NULL,
    intent_score INT DEFAULT 0, -- 0-100 calculated by AI Agent
    lifecycle_stage VARCHAR(30) DEFAULT 'PROSPECT', -- 'PROSPECT', 'HOT_LEAD', 'ACTIVE_MEMBER'
    last_engagement TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (tenant_id, phone)
);

ALTER TABLE lead_profiles ENABLE ROW LEVEL SECURITY;

-- Page content for SSR / Schema.org
CREATE TABLE IF NOT EXISTS tenant_profiles (
  tenant_id UUID PRIMARY KEY REFERENCES tenants(id) ON DELETE CASCADE,
  description TEXT,
  address TEXT,
  city TEXT,
  phone VARCHAR(30),
  website TEXT,
  hours_json JSONB NOT NULL DEFAULT '{}',
  image_url TEXT,
  rating NUMERIC(2,1),
  review_count INT DEFAULT 0
);

ALTER TABLE tenant_profiles ENABLE ROW LEVEL SECURITY;

-- Durable hold trail (Redis is live source of truth)
CREATE TABLE IF NOT EXISTS capacity_holds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES lead_profiles(id),
  status VARCHAR(20) NOT NULL DEFAULT 'HELD', -- HELD | CONFIRMED | EXPIRED | RELEASED
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE capacity_holds ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS agent_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES lead_profiles(id),
  event_type VARCHAR(50) NOT NULL,
  payload JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE agent_events ENABLE ROW LEVEL SECURITY;

-- Phase 2 seam: merchant auth mapping (populated when Auth lands)
CREATE TABLE IF NOT EXISTS merchant_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID UNIQUE,
  vat_number VARCHAR(50) NOT NULL REFERENCES tenants(vat_number),
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE merchant_users ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_capacity_holds_tenant_status
  ON capacity_holds (tenant_id, status);

CREATE INDEX IF NOT EXISTS idx_agent_events_tenant_created
  ON agent_events (tenant_id, created_at DESC);
