import { getCertificates } from "@/application/use-cases";
import { CertificatesManager } from "@/components/admin/Certifications/CertificatesManager";
export const dynamic = "force-dynamic";

export default async function CertificatesPage() {
  const certificates = await getCertificates();
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Certificates</h1>
        <p className="text-gray-400 text-sm mt-1">
          Add your qualifications and certifications
        </p>
      </div>
      <CertificatesManager certificates={certificates} />
    </div>
  );
}
