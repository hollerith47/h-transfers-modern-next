import AccountForm from "@/app/(auth)/accounts/AccountForm";
import ContentLayout from "@/app/(auth)/content-layout";
import AccountContainer from "@/app/(auth)/accounts/AccountContainer";

export const metadata = {
    title: "Accounts",
}
export default function Page() {


    return (
        <ContentLayout title="Accounts" description="Listes de tout les comptes actifs">
            <AccountForm/>
            <AccountContainer />
        </ContentLayout>
    );
}