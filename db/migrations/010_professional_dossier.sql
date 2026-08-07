-- Multi-industry professional dossier (artisan, trainer, legal, educator, medical)

ALTER TABLE practitioners
  ADD COLUMN IF NOT EXISTS professional_json JSONB NOT NULL DEFAULT '{}'::jsonb;

COMMENT ON COLUMN practitioners.professional_json IS
  'MultiProfessionalDossier: category, vatTaxId, accreditationBadge, specialties, careerHistory, deliverablesSummary';
