import BackButton from "@/components/ui/BackButton";
import ContentLayout from "@/app/(auth)/content-layout";
import UsersContainer from "@/app/(auth)/settings/UsersContainer";

export const metadata = {
    title: "Settings",
}
export default function Page() {
    return (
        <ContentLayout
            title="Parametres"
            description="parametrage des comptes"
            action={<BackButton />}
        >
            <UsersContainer />
        </ContentLayout>
    );
}