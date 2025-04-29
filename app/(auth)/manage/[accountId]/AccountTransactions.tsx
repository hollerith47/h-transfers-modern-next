"use client";
import {toast} from "sonner";
import {useQuery} from "@tanstack/react-query";
import {getTransactionsByAccountId} from "@/app/actions";
import AccountItem from "@/components/AccountItem";
import { Inbox} from "lucide-react";
import TransactionsTable from "@/app/(auth)/manage/[accountId]/TransactionsTable";
import TransactionForm from "@/app/(auth)/manage/[accountId]/TransactionForm";

type Props = {
    accountId: string;
}

export default function AccountTransactions({accountId}: Props) {

    const {
        data: account,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["account", accountId],
        queryFn: async () => {
            if (!accountId) return;
            try {
                return await getTransactionsByAccountId({accountId});
            } catch (error) {
                console.error("error while fetching account", error);
                toast.error("Failed to fetch account data.");
                throw error;
            }
        }
    });

    if (isLoading) return <div>Loading account…</div>;
    if (isError || !account) return <div>Error loading account.</div>;
    const devise = account.currency === "USD" ? "$" : "₽";

    // console.log({account})
    return (
        <>
            <div className="md:flex w-full justify-between">
                <div className="md:w-2/3">
                    <AccountItem account={account}/>
                </div>
                <TransactionForm account={account} />
            </div>
            {account?.transactions && account?.transactions.length > 0 ?
                (
                    <TransactionsTable
                        transactions={account.transactions}
                        devise={devise}
                        account={account}
                    />
                )
                : (
                    <div className="flex flex-col items-center justify-center p-8 text-gray-500">
                        <Inbox strokeWidth={1.5} className="w-12 h-12 mb-4"/>
                        <p className="text-lg">Aucune transaction disponible</p>
                    </div>
                )}
        </>
    );
}