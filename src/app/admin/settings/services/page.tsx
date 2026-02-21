import { getServices } from "@/application/use-cases";
import { ServicesManager } from "@/components/admin/ServicesManager";
export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Services</h1>
        <p className="text-gray-400 text-sm mt-1">What you offer to clients</p>
      </div>
      <ServicesManager services={services} />
    </div>
  );
}
