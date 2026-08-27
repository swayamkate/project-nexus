INSERT INTO public.trainee_enrollments (
  id, trainee_id, program_id, enrolled_date, completed_date, certified_date, certificate_id, status, grade
) VALUES (
  gen_random_uuid(),
  '8db21243-0294-4d8f-b6fd-a77ee675de65',
  'c6a0d3e0-d319-469c-8878-eaef0463de26',
  '2025-10-15',
  '2026-01-20',
  '2026-01-22',
  'CERT-2026-849201',
  'certified',
  'A+'
) ON CONFLICT DO NOTHING;
