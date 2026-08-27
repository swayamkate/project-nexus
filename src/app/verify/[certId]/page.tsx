import { CertificateValidationClient } from './CertificateValidationClient';

export function generateStaticParams() {
  // Static export requires one generated path. This neutral path is always
  // rejected by the client lookup and cannot represent a credential.
  return [{ certId: 'invalid' }];
}

export default async function CertificateValidationPage({
  params,
}: {
  params: Promise<{ certId: string }>;
}) {
  const resolvedParams = await params;
  return <CertificateValidationClient certId={resolvedParams.certId} />;
}
