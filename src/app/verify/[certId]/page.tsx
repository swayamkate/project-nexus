import { CertificateValidationClient } from './CertificateValidationClient';

export function generateStaticParams() {
  // Certificate pages must be reached with an ID issued by the registry.
  // Do not prebuild demo credentials that look genuine.
  return [];
}

export default async function CertificateValidationPage({
  params,
}: {
  params: Promise<{ certId: string }>;
}) {
  const resolvedParams = await params;
  return <CertificateValidationClient certId={resolvedParams.certId} />;
}
