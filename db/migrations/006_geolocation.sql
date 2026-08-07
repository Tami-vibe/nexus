-- Merchant geolocation for proximity + maps

ALTER TABLE tenant_profiles
  ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;

UPDATE tenant_profiles SET
  latitude = 32.0644, longitude = 34.7749
WHERE tenant_id = '11111111-1111-1111-1111-111111111111'; -- Iron Forge / Rothschild

UPDATE tenant_profiles SET
  latitude = 32.0782, longitude = 34.7745
WHERE tenant_id = '22222222-2222-2222-2222-222222222222'; -- Lumen / Dizengoff

UPDATE tenant_profiles SET
  latitude = 32.0809, longitude = 34.7682
WHERE tenant_id = '33333333-3333-3333-3333-333333333333'; -- Harbor / HaYarkon

UPDATE tenant_profiles SET
  latitude = 32.0565, longitude = 34.7688
WHERE tenant_id = '44444444-4444-4444-4444-444444444444'; -- Neri / Florentin

UPDATE tenant_profiles SET
  latitude = 32.0853, longitude = 34.7818
WHERE tenant_id = '55555555-5555-5555-5555-555555555555'; -- Northline / central TLV
