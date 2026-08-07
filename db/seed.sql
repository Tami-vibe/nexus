-- Demo merchants spanning products, services, and walk-ins
INSERT INTO tenants (
  id, vat_number, business_name, sector, max_capacity, walk_in_enabled,
  tagline, hero_image_url, testimonial_quote, testimonial_author
) VALUES
(
  '11111111-1111-1111-1111-111111111111',
  'IL-GYM-001',
  'Iron Forge Gym',
  'GYM',
  40,
  true,
  'Strength without the wait.',
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=2000&q=80',
  'I stopped guessing if the floor was packed. One tap and I''m in.',
  'Maya K.'
),
(
  '22222222-2222-2222-2222-222222222222',
  'IL-SALON-001',
  'Lumen Hair Studio',
  'SALON',
  8,
  true,
  'Color that feels intentional.',
  'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=2000&q=80',
  'Booking used to mean three voice notes. Now it''s thirty seconds.',
  'Noa R.'
),
(
  '33333333-3333-3333-3333-333333333333',
  'IL-CLINIC-001',
  'Harbor Wellness Clinic',
  'CLINIC',
  12,
  false,
  'Same-day care, zero lobby limbo.',
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=2000&q=80',
  'I booked a consult between meetings. No phone tree.',
  'Yael M.'
),
(
  '44444444-4444-4444-4444-444444444444',
  'IL-ARTISAN-001',
  'Atelier Neri Ceramics',
  'ARTISAN',
  0,
  false,
  'Handmade forms for daily rituals.',
  'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=2000&q=80',
  'The mug I ordered felt like it was made for my kitchen, not a catalog.',
  'Eli P.'
),
(
  '55555555-5555-5555-5555-555555555555',
  'IL-DIGITAL-001',
  'Northline Counsel',
  'CONSULTING',
  0,
  false,
  'Strategy counsel without the theatre.',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80',
  'Clear options in one hour. No billable fog.',
  'Sara L.'
)
ON CONFLICT (vat_number) DO UPDATE SET
  business_name = EXCLUDED.business_name,
  sector = EXCLUDED.sector,
  max_capacity = EXCLUDED.max_capacity,
  walk_in_enabled = EXCLUDED.walk_in_enabled,
  tagline = EXCLUDED.tagline,
  hero_image_url = EXCLUDED.hero_image_url,
  testimonial_quote = EXCLUDED.testimonial_quote,
  testimonial_author = EXCLUDED.testimonial_author;

INSERT INTO tenant_profiles (
  tenant_id, description, address, city, phone, website, hours_json, image_url, rating, review_count, latitude, longitude
) VALUES
(
  '11111111-1111-1111-1111-111111111111',
  'Coaching, open floor, and recovery — with live capacity so you never walk into a wall of people.',
  '14 Rothschild Blvd', 'Tel Aviv', '+972-3-555-0101', 'https://example.com/iron-forge',
  '{"mon":"06:00-23:00","tue":"06:00-23:00","wed":"06:00-23:00","thu":"06:00-23:00","fri":"06:00-18:00","sat":"08:00-14:00","sun":"08:00-20:00"}'::jsonb,
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80', 4.8, 214,
  32.0644, 34.7749
),
(
  '22222222-2222-2222-2222-222222222222',
  'Precision cuts and lived-in color in a calm, appointment-first studio — walk-ins when chairs open.',
  '9 Dizengoff St', 'Tel Aviv', '+972-3-555-0202', 'https://example.com/lumen',
  '{"mon":"09:00-19:00","tue":"09:00-19:00","wed":"09:00-19:00","thu":"09:00-20:00","fri":"09:00-14:00","sat":"closed","sun":"10:00-18:00"}'::jsonb,
  'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80', 4.9, 128,
  32.0782, 34.7745
),
(
  '33333333-3333-3333-3333-333333333333',
  'Preventive care and same-day consults with a booking flow that respects your time.',
  '22 HaYarkon St', 'Tel Aviv', '+972-3-555-0303', 'https://example.com/harbor',
  '{"mon":"08:00-18:00","tue":"08:00-18:00","wed":"08:00-18:00","thu":"08:00-18:00","fri":"08:00-13:00","sat":"closed","sun":"closed"}'::jsonb,
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80', 4.7, 96,
  32.0809, 34.7682
),
(
  '44444444-4444-4444-4444-444444444444',
  'Small-batch ceramics: pourers, bowls, and custom commissions for homes that care about touch.',
  '3 Florentin Alley', 'Tel Aviv', '+972-3-555-0404', 'https://example.com/neri',
  '{"mon":"10:00-18:00","tue":"10:00-18:00","wed":"10:00-18:00","thu":"10:00-18:00","fri":"10:00-14:00","sat":"11:00-16:00","sun":"closed"}'::jsonb,
  'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=80', 4.9, 67,
  32.0565, 34.7688
),
(
  '55555555-5555-5555-5555-555555555555',
  'Commercial strategy counsel and founder-side advisory — confidential by default.',
  'Remote', 'Tel Aviv', '+972-3-555-0505', 'https://example.com/northline',
  '{"mon":"09:00-18:00","tue":"09:00-18:00","wed":"09:00-18:00","thu":"09:00-18:00","fri":"09:00-14:00","sat":"closed","sun":"closed"}'::jsonb,
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80', 5.0, 42,
  32.0853, 34.7818
)
ON CONFLICT (tenant_id) DO UPDATE SET
  description = EXCLUDED.description,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  hours_json = EXCLUDED.hours_json,
  image_url = EXCLUDED.image_url,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude;

INSERT INTO live_occupancy (tenant_id, current_occupancy, last_signal_timestamp, signal_source)
VALUES
  ('11111111-1111-1111-1111-111111111111', 28, NOW(), 'POS_WEBHOOK'),
  ('22222222-2222-2222-2222-222222222222', 5, NOW(), 'WIFI_PROBE'),
  ('33333333-3333-3333-3333-333333333333', 0, NOW() - INTERVAL '30 minutes', 'POS_WEBHOOK')
ON CONFLICT (tenant_id) DO UPDATE SET
  current_occupancy = EXCLUDED.current_occupancy,
  last_signal_timestamp = EXCLUDED.last_signal_timestamp,
  signal_source = EXCLUDED.signal_source;

DELETE FROM products WHERE tenant_id IN (
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  '33333333-3333-3333-3333-333333333333',
  '44444444-4444-4444-4444-444444444444',
  '55555555-5555-5555-5555-555555555555'
);

INSERT INTO products (tenant_id, name, description, price_cents, kind, image_url, sort_order) VALUES
('11111111-1111-1111-1111-111111111111', 'Day Pass', 'Full floor + recovery lounge access.', 8900, 'DIGITAL', 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80', 1),
('11111111-1111-1111-1111-111111111111', 'Forge Tee', 'Heavyweight cotton, charcoal.', 14900, 'PHYSICAL', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80', 2),
('22222222-2222-2222-2222-222222222222', 'Silk Ritual Kit', 'At-home gloss oil + brush.', 21900, 'PHYSICAL', 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc0?auto=format&fit=crop&w=900&q=80', 1),
('22222222-2222-2222-2222-222222222222', 'Gift Card', 'Digital studio credit.', 30000, 'DIGITAL', 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=900&q=80', 2),
('33333333-3333-3333-3333-333333333333', 'Wellness Primer', 'Digital intake + recovery plan PDF.', 4900, 'DIGITAL', 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80', 1),
('44444444-4444-4444-4444-444444444444', 'Stoneware Pourer', 'Speckled glaze, 280ml.', 18000, 'HANDCRAFT', 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=900&q=80', 1),
('44444444-4444-4444-4444-444444444444', 'Morning Bowl Set', 'Pair of hand-thrown bowls.', 26000, 'HANDCRAFT', 'https://images.unsplash.com/photo-1578749556568-bc2c40e63b53?auto=format&fit=crop&w=900&q=80', 2),
('55555555-5555-5555-5555-555555555555', 'Launch Brand Kit', 'Logo system, type, and 12 templates.', 89000, 'DIGITAL', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=900&q=80', 1),
('55555555-5555-5555-5555-555555555555', 'Async Creative Sprint', '5-day direction pack delivered online.', 240000, 'DIGITAL', 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&w=900&q=80', 2);

DELETE FROM services WHERE tenant_id IN (
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  '33333333-3333-3333-3333-333333333333',
  '44444444-4444-4444-4444-444444444444',
  '55555555-5555-5555-5555-555555555555'
);

INSERT INTO services (tenant_id, name, description, duration_minutes, price_cents, image_url, sort_order) VALUES
('11111111-1111-1111-1111-111111111111', 'Form Coaching', '45-min technique session.', 45, 22000, 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=900&q=80', 1),
('22222222-2222-2222-2222-222222222222', 'Signature Cut', 'Consultation + precision cut.', 60, 28000, 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=900&q=80', 1),
('22222222-2222-2222-2222-222222222222', 'Lived-In Color', 'Custom color with gloss finish.', 120, 78000, 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=900&q=80', 2),
('33333333-3333-3333-3333-333333333333', 'Same-Day Consult', 'Physician consult, video or in-clinic.', 30, 35000, 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&w=900&q=80', 1),
('33333333-3333-3333-3333-333333333333', 'Physio Intake', 'Movement assessment + plan.', 50, 42000, 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=900&q=80', 2),
('44444444-4444-4444-4444-444444444444', 'Custom Commission', 'Design consult for a bespoke piece.', 40, 15000, 'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?auto=format&fit=crop&w=900&q=80', 1),
('55555555-5555-5555-5555-555555555555', 'Strategy Call', '90-min brand direction workshop.', 90, 120000, 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80', 1);

DELETE FROM practitioners WHERE tenant_id IN (
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  '33333333-3333-3333-3333-333333333333',
  '44444444-4444-4444-4444-444444444444',
  '55555555-5555-5555-5555-555555555555'
);

INSERT INTO practitioners (
  tenant_id, slug, full_name, credential, title, specialties, bio, certifications,
  licenses_json, dossier_json, headshot_url, video_url, rating, review_count, client_count, client_label, sort_order
) VALUES
(
  '33333333-3333-3333-3333-333333333333', 'amir-saeed',
  'Dr. Amir Saeed', 'Attending Physician / Specialist MD', 'Internal & Preventive Medicine Specialist',
  ARRAY['Preventive Care','Same-Day Consults','Metabolic Health'],
  'Amir focuses on clear, unhurried consults — same-day when capacity allows, with care plans patients actually finish.',
  ARRAY['MD, Tel Aviv University','Board Certified Internal Medicine','ACLS'],
  '[
    {
      "authorityName": "Israel Ministry of Health",
      "licenseNumber": "1-48291",
      "jurisdiction": "National (Israel)",
      "status": "VERIFIED",
      "lastVerifiedAt": "2026-07-18T09:00:00.000Z",
      "officialRegistryUrl": "https://practitioners.health.gov.il/"
    }
  ]'::jsonb,
  '{
    "bioHeader": "I practice medicine the way I would want for my own family: unhurried listening first, then a clear plan you can finish. Same-day capacity when the clinic allows — always with follow-through, never with theatre.",
    "careerHistory": [
      {"role": "Attending Physician, Internal Medicine", "institution": "Harbor Wellness Clinic", "years": "2021 — Present"},
      {"role": "Internal Medicine Residency", "institution": "Ichilov (Tel Aviv Sourasky)", "years": "2017 — 2021"},
      {"role": "Clinical Fellow, Preventive Medicine", "institution": "Sheba Medical Center", "years": "2016 — 2017"}
    ],
    "subSpecialties": ["Metabolic syndrome", "Hypertension management", "Executive physicals", "Travel medicine", "Lifestyle medicine"],
    "languagesSpoken": ["English", "Hebrew", "Arabic"],
    "educationHistory": [
      {"degree": "MD", "institution": "Tel Aviv University Sackler Faculty of Medicine", "year": "2016"},
      {"degree": "Board Certification, Internal Medicine", "institution": "Israel Medical Association", "year": "2021"},
      {"degree": "ACLS Provider", "institution": "American Heart Association", "year": "2024"}
    ]
  }'::jsonb,
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
  4.9, 96, 120, 'Patients', 1
),
(
  '33333333-3333-3333-3333-333333333333', 'noa-klein',
  'Dr. Noa Klein', 'Licensed Senior Physiotherapist', 'Sports & Post-Op Physiotherapy Specialist',
  ARRAY['Movement Assessment','Sports Rehab','Post-Op Recovery'],
  'Noa rebuilds confidence through measurable progress — intake to return-to-activity without clinic theatre.',
  ARRAY['Doctor of Physical Therapy (DPT)','Certified Strength & Conditioning Specialist (CSCS)','Dry Needling Therapy (Musculoskeletal Pain)'],
  '[
    {
      "authorityName": "Israel Ministry of Health",
      "licenseNumber": "PT-22901",
      "jurisdiction": "National (Israel)",
      "status": "VERIFIED",
      "lastVerifiedAt": "2026-07-12T11:30:00.000Z",
      "officialRegistryUrl": "https://practitioners.health.gov.il/"
    }
  ]'::jsonb,
  '{
    "bioHeader": "Recovery should feel like progress you can measure — not vague encouragement. I map every plan from intake to return-to-activity, so you always know the next mile marker.",
    "careerHistory": [
      {"role": "Physiotherapy Lead", "institution": "Harbor Wellness Clinic", "years": "2022 — Present"},
      {"role": "Sports Rehab Specialist", "institution": "Wingate Institute Clinic", "years": "2019 — 2022"},
      {"role": "Post-Op Rotation", "institution": "Assuta Medical Center", "years": "2018 — 2019"}
    ],
    "subSpecialties": ["ACL return-to-play", "Shoulder instability", "Running gait", "Dry needling", "Post-surgical mobility"],
    "languagesSpoken": ["Hebrew", "English"],
    "educationHistory": [
      {"degree": "Doctor of Physical Therapy (DPT)", "institution": "University of Haifa", "year": "2018"},
      {"degree": "Certified Strength & Conditioning Specialist (CSCS)", "institution": "NSCA", "year": "2020"},
      {"degree": "Dry Needling Therapy (Musculoskeletal Pain)", "institution": "Israel Physiotherapy Society", "year": "2021"}
    ]
  }'::jsonb,
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80',
  4.8, 74, 210, 'Patients', 2
),
(
  '11111111-1111-1111-1111-111111111111', 'maya-cohen',
  'Maya Cohen', 'Certified Strength Coach', 'Strength & Performance Specialist',
  ARRAY['Strength','Form Coaching','Recovery'],
  'Maya runs open-floor coaching with live capacity awareness so every session feels personal, never packed.',
  ARRAY['CSCS','Precision Nutrition L1'],
  '[
    {
      "authorityName": "NSCA (CSCS)",
      "licenseNumber": "CSCS-884120",
      "jurisdiction": "International / USA registry",
      "status": "VERIFIED",
      "lastVerifiedAt": "2026-06-01T08:00:00.000Z",
      "officialRegistryUrl": "https://www.nsca.com/certification/cscs/"
    }
  ]'::jsonb,
  '{
    "bioHeader": "Strength training works when coaching is present — not when the floor is packed. I keep sessions personal with live capacity awareness and form that compounds over months.",
    "careerHistory": [
      {"role": "Head Coach", "institution": "Iron Forge Gym", "years": "2020 — Present"},
      {"role": "Performance Coach", "institution": "Private athletes, Tel Aviv", "years": "2017 — 2020"}
    ],
    "subSpecialties": ["Olympic lifts foundations", "Hypertrophy blocks", "Mobility for desk athletes", "Return-from-injury strength"],
    "languagesSpoken": ["Hebrew", "English"],
    "educationHistory": [
      {"degree": "Certified Strength & Conditioning Specialist (CSCS)", "institution": "NSCA", "year": "2017"},
      {"degree": "Precision Nutrition L1", "institution": "Precision Nutrition", "year": "2019"}
    ]
  }'::jsonb,
  'https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&w=900&q=80',
  NULL, 4.9, 128, 340, 'Athletes', 1
),
(
  '22222222-2222-2222-2222-222222222222', 'lina-bar',
  'Lina Bar', 'Senior Color Artist', 'Lived-In Color & Precision Cut Specialist',
  ARRAY['Lived-In Color','Precision Cuts','Gloss Rituals'],
  'Lina designs cuts that grow out clean — appointment-first, walk-ins when chairs open.',
  ARRAY['L''Oréal Professionnel','Advanced Color Correction'],
  '[]'::jsonb,
  '{
    "bioHeader": "Great color should grow out gracefully. I design cuts and tones for the life you actually live — appointment-first, walk-ins when a chair opens.",
    "careerHistory": [
      {"role": "Color Director", "institution": "Lumen Hair Studio", "years": "2019 — Present"},
      {"role": "Senior Stylist", "institution": "L''Oréal Professionnel Partner Salon", "years": "2015 — 2019"}
    ],
    "subSpecialties": ["Lived-in balayage", "Gray blending", "Precision bob", "Gloss rituals", "Color correction"],
    "languagesSpoken": ["Hebrew", "English", "French"],
    "educationHistory": [
      {"degree": "Advanced Color Correction", "institution": "L''Oréal Professionnel Academy", "year": "2018"},
      {"degree": "Master Colorist Program", "institution": "Wella Professionals", "year": "2016"}
    ]
  }'::jsonb,
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80',
  NULL, 5.0, 86, 190, 'Clients', 1
),
(
  '44444444-4444-4444-4444-444444444444', 'neri-alon',
  'Neri Alon', 'Studio Lead', 'Ceramic Artist & Commission Specialist',
  ARRAY['Stoneware','Commissions','Tableware'],
  'Neri throws small-batch forms for daily rituals — commissions start with a short consult.',
  ARRAY['Bezalel Academy','Studio Residency Florence'],
  '[]'::jsonb,
  '{
    "bioHeader": "I throw small-batch stoneware for the rituals of daily life — cups, bowls, and commissioned pieces that feel personal from the first consult.",
    "careerHistory": [
      {"role": "Studio Lead", "institution": "Clay & Ember Studio", "years": "2018 — Present"},
      {"role": "Artist in Residence", "institution": "Florence Ceramics Atelier", "years": "2016 — 2017"}
    ],
    "subSpecialties": ["Functional tableware", "Custom commissions", "Glaze development", "Wheel-thrown stoneware"],
    "languagesSpoken": ["Hebrew", "English", "Italian"],
    "educationHistory": [
      {"degree": "BFA Ceramics", "institution": "Bezalel Academy of Arts and Design", "year": "2015"},
      {"degree": "Studio Residency", "institution": "Florence Ceramics Atelier", "year": "2017"}
    ]
  }'::jsonb,
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80',
  NULL, 4.9, 67, 95, 'Collectors', 1
),
(
  '55555555-5555-5555-5555-555555555555', 'jordan-lee',
  'Jordan Lee', 'Licensed Attorney', 'Commercial & Founder Strategy Counsel',
  ARRAY['M&A Strategy','Commercial Contracts','Founder Counsel'],
  'Jordan delivers founder-side strategy counsel without billable fog — confidential, decisive, calendar-first.',
  ARRAY['Israel Bar Association','LL.M. Commercial Law','Former Big Law Associate'],
  '[
    {
      "authorityName": "Israel Bar Association",
      "licenseNumber": "IBA-77421",
      "jurisdiction": "National (Israel)",
      "status": "VERIFIED",
      "lastVerifiedAt": "2026-07-10T08:00:00.000Z",
      "officialRegistryUrl": "https://www.israelbar.org.il/"
    }
  ]'::jsonb,
  '{
    "bioHeader": "I give founders clear options in one sitting — commercial risk framed in plain language, confidentiality by default, and a path you can act on the same week.",
    "careerHistory": [
      {"role": "Principal Counsel", "institution": "Northline Counsel", "years": "2022 — Present"},
      {"role": "Associate, Corporate", "institution": "International Big Law (Tel Aviv)", "years": "2017 — 2022"}
    ],
    "subSpecialties": ["M&A strategy memos", "SAFE / SPA review", "Vendor contracts", "Founder dispute navigation"],
    "languagesSpoken": ["English", "Hebrew"],
    "educationHistory": [
      {"degree": "LL.B.", "institution": "Hebrew University of Jerusalem", "year": "2015"},
      {"degree": "LL.M. Commercial Law", "institution": "Tel Aviv University", "year": "2017"},
      {"degree": "Israel Bar Admission", "institution": "Israel Bar Association", "year": "2016"}
    ]
  }'::jsonb,
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=80',
  NULL, 5.0, 42, 60, 'Clients', 1
);

-- Multi-industry professional bento payloads
UPDATE practitioners SET professional_json = '{
  "category": "medical",
  "vatTaxId": "IL-CLINIC-001",
  "accreditationBadge": {
    "title": "Israel Ministry of Health",
    "registrationNumber": "1-48291",
    "verificationUrl": "https://practitioners.health.gov.il/"
  },
  "specialties": ["Preventive Care", "Same-Day Consults", "Metabolic Health"],
  "careerHistory": [
    {"role": "Attending Physician, Internal Medicine", "institution": "Harbor Wellness Clinic", "years": "2021 — Present"},
    {"role": "Internal Medicine Residency", "institution": "Ichilov (Tel Aviv Sourasky)", "years": "2017 — 2021"}
  ],
  "deliverablesSummary": ["30-min same-day consult", "Metabolic care plan", "Executive physical"]
}'::jsonb WHERE slug = 'amir-saeed';

UPDATE practitioners SET professional_json = '{
  "category": "medical",
  "vatTaxId": "IL-CLINIC-001",
  "accreditationBadge": {
    "title": "Israel Ministry of Health",
    "registrationNumber": "PT-22901",
    "verificationUrl": "https://practitioners.health.gov.il/"
  },
  "specialties": ["Movement Assessment", "Sports Rehab", "Post-Op Recovery"],
  "careerHistory": [
    {"role": "Physiotherapy Lead", "institution": "Harbor Wellness Clinic", "years": "2022 — Present"},
    {"role": "Sports Rehab Specialist", "institution": "Wingate Institute Clinic", "years": "2019 — 2022"}
  ],
  "deliverablesSummary": ["Physio intake + plan", "Return-to-play protocol", "Post-op mobility block"]
}'::jsonb WHERE slug = 'noa-klein';

UPDATE practitioners SET professional_json = '{
  "category": "trainer",
  "vatTaxId": "IL-GYM-001",
  "accreditationBadge": {
    "title": "NSCA Certified",
    "registrationNumber": "CSCS-884120",
    "verificationUrl": "https://www.nsca.com/certification/cscs/"
  },
  "specialties": ["Strength", "Form Coaching", "Recovery"],
  "careerHistory": [
    {"role": "Head Coach", "institution": "Iron Forge Gym", "years": "2020 — Present"},
    {"role": "Performance Coach", "institution": "Private athletes, Tel Aviv", "years": "2017 — 2020"}
  ],
  "deliverablesSummary": ["45-min form coaching", "Hypertrophy block design", "Trial intro session"]
}'::jsonb WHERE slug = 'maya-cohen';

UPDATE practitioners SET professional_json = '{
  "category": "artisan",
  "vatTaxId": "IL-SALON-001",
  "accreditationBadge": {
    "title": "L''Oréal Professionnel Partner Artist",
    "registrationNumber": "LP-IL-9021",
    "verificationUrl": "https://www.lorealprofessionnel.com/"
  },
  "specialties": ["Lived-In Color", "Precision Cuts", "Gloss Rituals"],
  "careerHistory": [
    {"role": "Color Director", "institution": "Lumen Hair Studio", "years": "2019 — Present"},
    {"role": "Senior Stylist", "institution": "L''Oréal Professionnel Partner Salon", "years": "2015 — 2019"}
  ],
  "deliverablesSummary": ["Lived-in balayage", "Precision cut + finish", "Color correction consult"]
}'::jsonb WHERE slug = 'lina-bar';

UPDATE practitioners SET professional_json = '{
  "category": "artisan",
  "vatTaxId": "IL-ARTISAN-001",
  "accreditationBadge": {
    "title": "Albo Artigiani / Camera di Commercio (Florence residency)",
    "registrationNumber": "ART-FI-4418",
    "verificationUrl": "https://www.camcom.it/"
  },
  "specialties": ["Stoneware", "Commissions", "Tableware"],
  "careerHistory": [
    {"role": "Studio Lead", "institution": "Atelier Neri Ceramics", "years": "2018 — Present"},
    {"role": "Artist in Residence", "institution": "Florence Ceramics Atelier", "years": "2016 — 2017"}
  ],
  "deliverablesSummary": ["Custom walnut-glaze tableware", "Commission consult", "Workshop visit"]
}'::jsonb WHERE slug = 'neri-alon';

UPDATE practitioners SET professional_json = '{
  "category": "legal",
  "vatTaxId": "IL-DIGITAL-001",
  "accreditationBadge": {
    "title": "Israel Bar Association",
    "registrationNumber": "IBA-77421",
    "verificationUrl": "https://www.israelbar.org.il/"
  },
  "specialties": ["M&A Strategy", "Commercial Contracts", "Founder Counsel"],
  "careerHistory": [
    {"role": "Principal Counsel", "institution": "Northline Counsel", "years": "2022 — Present"},
    {"role": "Associate, Corporate", "institution": "International Big Law (Tel Aviv)", "years": "2017 — 2022"}
  ],
  "deliverablesSummary": ["45-Min M&A Strategy", "SPA / SAFE review", "District court commercial matters", "Confidential founder consult"]
}'::jsonb WHERE slug = 'jordan-lee';

-- Multi-location practice nodes (traveling professionals)
UPDATE practitioners SET traveling_json = '{
  "activeLocationId": "tlv-harbor",
  "locations": [
    {
      "id": "tlv-harbor",
      "name": "Harbor Wellness Clinic",
      "address": "22 HaYarkon St",
      "city": "Tel Aviv",
      "scheduleDays": ["Mon", "Tue"],
      "nextOpenSlot": "Mon 09:00 AM",
      "distanceKm": 1.2,
      "latitude": 32.0809,
      "longitude": 34.7682,
      "emoji": "🏥"
    },
    {
      "id": "herzliya-north",
      "name": "Herzliya North Suite",
      "address": "8 HaNofim St",
      "city": "Herzliya",
      "scheduleDays": ["Wed"],
      "nextOpenSlot": "Wed 10:30 AM",
      "distanceKm": 14.5,
      "latitude": 32.164,
      "longitude": 34.844,
      "emoji": "🏢"
    },
    {
      "id": "haifa-bay",
      "name": "Haifa Bay Consult",
      "address": "12 Hanamal St",
      "city": "Haifa",
      "scheduleDays": ["Thu", "Fri"],
      "nextOpenSlot": "Thu 11:00 AM",
      "distanceKm": 92.0,
      "latitude": 32.819,
      "longitude": 34.998,
      "emoji": "🌊"
    }
  ]
}'::jsonb WHERE slug = 'amir-saeed';

UPDATE practitioners SET traveling_json = '{
  "activeLocationId": "tlv-harbor-pt",
  "locations": [
    {
      "id": "tlv-harbor-pt",
      "name": "Harbor Physio Floor",
      "address": "22 HaYarkon St",
      "city": "Tel Aviv",
      "scheduleDays": ["Mon", "Wed", "Fri"],
      "nextOpenSlot": "Mon 09:00 AM",
      "latitude": 32.0809,
      "longitude": 34.7682,
      "emoji": "🏥"
    },
    {
      "id": "ramat-gan-pt",
      "name": "Ramat Gan Sports Lab",
      "address": "3 Jabotinsky Rd",
      "city": "Ramat Gan",
      "scheduleDays": ["Tue", "Thu"],
      "nextOpenSlot": "Tue 14:00 PM",
      "latitude": 32.083,
      "longitude": 34.81,
      "emoji": "🏋️"
    }
  ]
}'::jsonb WHERE slug = 'noa-klein';

UPDATE practitioners SET traveling_json = '{
  "activeLocationId": "forge-tlv",
  "locations": [
    {
      "id": "forge-tlv",
      "name": "Iron Forge Gym",
      "address": "14 Rothschild Blvd",
      "city": "Tel Aviv",
      "scheduleDays": ["Mon", "Tue", "Wed", "Thu", "Fri"],
      "nextOpenSlot": "Mon 06:30 AM",
      "latitude": 32.0644,
      "longitude": 34.7749,
      "emoji": "🏋️"
    },
    {
      "id": "forge-jaffa",
      "name": "Jaffa Open Floor",
      "address": "5 Kedem St",
      "city": "Jaffa",
      "scheduleDays": ["Sat"],
      "nextOpenSlot": "Sat 08:00 AM",
      "latitude": 32.053,
      "longitude": 34.752,
      "emoji": "🌊"
    }
  ]
}'::jsonb WHERE slug = 'maya-cohen';

UPDATE practitioners SET traveling_json = '{
  "activeLocationId": "tlv-counsel",
  "locations": [
    {
      "id": "tlv-counsel",
      "name": "Northline Counsel TLV",
      "address": "Rothschild Tower",
      "city": "Tel Aviv",
      "scheduleDays": ["Mon", "Tue"],
      "nextOpenSlot": "Mon 09:00 AM",
      "latitude": 32.064,
      "longitude": 34.775,
      "emoji": "⚖️"
    },
    {
      "id": "jlm-counsel",
      "name": "Jerusalem Chambers",
      "address": "1 Agron St",
      "city": "Jerusalem",
      "scheduleDays": ["Wed"],
      "nextOpenSlot": "Wed 11:00 AM",
      "latitude": 31.776,
      "longitude": 35.22,
      "emoji": "🏢"
    },
    {
      "id": "haifa-counsel",
      "name": "Haifa Port Advisory",
      "address": "Palm Beach Hotel District",
      "city": "Haifa",
      "scheduleDays": ["Thu", "Fri"],
      "nextOpenSlot": "Thu 10:00 AM",
      "latitude": 32.83,
      "longitude": 34.97,
      "emoji": "🌊"
    }
  ]
}'::jsonb WHERE slug = 'jordan-lee';

-- Insurance networks, intro passes, accessibility (Yellow Pages benefits)
UPDATE practitioners SET benefits_json = '{
  "hasWheelchairAccess": true,
  "insuranceNetworks": [
    {"providerName": "Generali", "directBilling": true},
    {"providerName": "Allianz", "directBilling": true},
    {"providerName": "Clalit", "directBilling": false},
    {"providerName": "Maccabi", "directBilling": false}
  ],
  "introPasses": [
    {
      "id": "amir-metabolic-intro",
      "title": "First-Visit Metabolic & Preventive Consultation Rate",
      "originalPrice": 35000,
      "discountPrice": 18000,
      "currency": "ils",
      "remainingQuantity": 4,
      "validDays": ["Mon", "Tue"],
      "refundGuaranteeNote": "100% Refund Guarantee if clinical evaluation determines non-candidacy"
    }
  ]
}'::jsonb WHERE slug = 'amir-saeed';

UPDATE practitioners SET benefits_json = '{
  "hasWheelchairAccess": true,
  "insuranceNetworks": [
    {"providerName": "Clalit", "directBilling": true},
    {"providerName": "Maccabi", "directBilling": true},
    {"providerName": "Unipol", "directBilling": false}
  ],
  "introPasses": [
    {
      "id": "noa-gait-intro",
      "title": "First-Visit Gait Analysis & Physiotherapy Rate",
      "originalPrice": 32000,
      "discountPrice": 18000,
      "currency": "ils",
      "remainingQuantity": 4,
      "validDays": ["Mon", "Wed"],
      "refundGuaranteeNote": "100% Refund Guarantee if clinical evaluation determines non-candidacy"
    }
  ]
}'::jsonb WHERE slug = 'noa-klein';

UPDATE practitioners SET benefits_json = '{
  "hasWheelchairAccess": true,
  "insuranceNetworks": [],
  "introPasses": [
    {
      "id": "maya-trial-intro",
      "title": "First-Visit Form Coaching Session Rate",
      "originalPrice": 25000,
      "discountPrice": 9900,
      "currency": "ils",
      "remainingQuantity": 6,
      "validDays": ["Sat"],
      "refundGuaranteeNote": "100% Refund Guarantee if coaching evaluation determines non-candidacy"
    }
  ]
}'::jsonb WHERE slug = 'maya-cohen';

UPDATE practitioners SET benefits_json = '{
  "hasWheelchairAccess": false,
  "insuranceNetworks": [],
  "introPasses": [
    {
      "id": "jordan-ma-intro",
      "title": "First-Visit Founder Strategy Consultation Rate",
      "originalPrice": 120000,
      "discountPrice": 45000,
      "currency": "ils",
      "remainingQuantity": 3,
      "validDays": ["Wed"],
      "refundGuaranteeNote": "100% Refund Guarantee if counsel evaluation determines non-candidacy"
    }
  ]
}'::jsonb WHERE slug = 'jordan-lee';