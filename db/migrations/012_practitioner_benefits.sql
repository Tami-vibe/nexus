-- Insurance networks, intro-pass vouchers, accessibility flags

ALTER TABLE practitioners
  ADD COLUMN IF NOT EXISTS benefits_json JSONB NOT NULL DEFAULT '{}'::jsonb;

COMMENT ON COLUMN practitioners.benefits_json IS
  '{ insuranceNetworks: InsuranceNetwork[], introPasses: IntroPassCoupon[], hasWheelchairAccess: boolean }';
