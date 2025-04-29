import ContentLayout from "@/app/(auth)/content-layout";
import ClientTables from "@/app/(auth)/clients/ClientTables";
import ClientForm from "@/app/(auth)/clients/ClientForm";

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