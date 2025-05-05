import TransactionsContainer from "@/app/(auth)/transactions/TransactionsContainer";
import ContentLayout from "@/app/(auth)/content-layout";

export const metadata = {
    title: "Transactions",
}

export default function Page() {
    return (
        <ContentLayout
            title="Toutes les Transactions"
            description="Tableau de toutes les transactions"
        >
            <TransactionsContainer />
        </ContentLayout>

    );
}