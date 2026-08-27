import { CertificateValidationClient } from './CertificateValidationClient';

export function generateStaticParams() {
  return [
    { certId: 'CERT-2026-849201' },
    { certId: 'MSSDS-2026-A101' },
    { certId: 'TRN-2026-001' },
  ];
}

export default async function CertificateValidationPage({
  params,
}: {
  params: Promise<{ certId: string }>;
}) {
  const resolvedParams = await params;
  return <CertificateValidationClient certId={resolvedParams.certId} />;
}
