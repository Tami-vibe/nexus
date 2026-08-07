-- Multi-location practice nodes for traveling professionals

ALTER TABLE practitioners
  ADD COLUMN IF NOT EXISTS traveling_json JSONB NOT NULL DEFAULT '{}'::jsonb;

COMMENT ON COLUMN practitioners.traveling_json IS
  'TravelingProfessional: locations[], activeLocationId — indexed for geo search by city';

CREATE INDEX IF NOT EXISTS idx_practitioners_traveling_cities
  ON practitioners USING GIN ((traveling_json -> 'locations'));
