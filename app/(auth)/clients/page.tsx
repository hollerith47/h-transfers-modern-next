import ContentLayout from "@/app/(auth)/content-layout";
import ClientForm from "@/app/(auth)/clients/ClientForm";
import ClientTables from "@/app/(auth)/clients/ClientTables";

export default function Page() {
    return (
        <ContentLayout
            title="Clients"
            description="Listes de tout les clients actifs"
            action={<ClientForm />}
        >
            <ClientTables />
        </ContentLayout>
    );
}