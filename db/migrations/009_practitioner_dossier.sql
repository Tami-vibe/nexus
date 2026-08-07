-- Rich professional dossier for complete practitioner Yellow Pages profiles

ALTER TABLE practitioners
  ADD COLUMN IF NOT EXISTS dossier_json JSONB NOT NULL DEFAULT '{}'::jsonb;

COMMENT ON COLUMN practitioners.dossier_json IS
  'PractitionerDossier: bioHeader, careerHistory, subSpecialties, languagesSpoken, educationHistory';
