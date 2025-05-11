import AccountTransactions from "@/app/(auth)/manage/[accountId]/AccountTransactions";
import ContentLayout from "@/app/(auth)/content-layout";
import BackButton from "@/components/BackButton";


export const metadata = {
    title: "Gestion de compte",
}

export default async function Page(props: { params: Promise<{ accountId: string }> }) {
    const { accountId } = await props.params;

    return (
        <ContentLayout
            title="Manage Account"
            description="Apercu en details sur chaque comptes et ses transactions"
            action={<BackButton />}
        >
            <AccountTransactions accountId={accountId}/>
        </ContentLayout>
    );
}