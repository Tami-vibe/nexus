-- Government / professional license verification for practitioners

ALTER TABLE practitioners
  ADD COLUMN IF NOT EXISTS licenses_json JSONB NOT NULL DEFAULT '[]'::jsonb;

COMMENT ON COLUMN practitioners.licenses_json IS
  'Array of CredentialLicense: authorityName, licenseNumber, jurisdiction, status, lastVerifiedAt, officialRegistryUrl';
