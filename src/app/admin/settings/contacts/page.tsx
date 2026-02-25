import { getContacts } from "@/application/use-cases";
import { ContactsManager } from "@/components/admin/Contacts/ContactsManager";
export const dynamic = "force-dynamic";

export default async function ContactsPage() {
  const contacts = await getContacts();
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Contact Info</h1>
        <p className="text-gray-400 text-sm mt-1">
          Manage your contact methods shown on the portfolio
        </p>
      </div>
      <ContactsManager contacts={contacts} />
    </div>
  );
}
