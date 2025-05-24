"use client";
import {toast} from "sonner";
import {useQuery} from "@tanstack/react-query";
import {getTransactionsByAccountId} from "@/app/actions";
import AccountTransactionsTable from "@/app/(auth)/manage/[accountId]/AccountTransactionsTable";
import TransactionForm from "@/app/(auth)/manage/[accountId]/TransactionForm";
import DeleteAccountButton from "@/app/(auth)/manage/[accountId]/DeleteAccountButton";
import UpdateAccountInfo from "@/app/(auth)/manage/[accountId]/UpdateAccountInfo";
import Loader from "@/components/ui/Loader";
import AccountItem from "@/components/features/account/AccountItem";
import EmptyTransaction from "@/components/ui/EmptyTransaction";
import {useTransactionFilters} from "@/hook/useTransactionFilters";
import {FilterBarContainer} from "@/components/ui/FilterBarContainer";

type Props = {
    accountId: string;
};

export default function AccountTransactions({accountId}: Props) {
    const {data: account, isLoading, isError, refetch, isFetching} = useQuery({
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
        },
    });

    const transactions = account?.transactions ?? [];


    const {
        filtered:filteredTransactions,
        filterType, setFilterType,
        filterStatus, setFilterStatus,
        searchTerm,   setSearchTerm,
        filterDate,   setFilterDate,
    } = useTransactionFilters(transactions);

    if (isLoading) return <Loader fullScreen/>;
    if (isError || !account) return <div>Error loading account.</div>;

    // console.log(filteredTransactions)

    return (
        <>
            <div className="md:flex w-full justify-between mb-4">
                <div className="md:w-2/3">
                    <AccountItem account={account}/>
                </div>
                {/*<div className="flex md:justify-between flex-col gap-2 mt-4 md:mt-0">*/}
                <div className="flex justify-between md:justify-start md:flex-col gap-2 mt-4 md:mt-0">
                    <TransactionForm account={account}/>
                    <UpdateAccountInfo account={account}/>
                    <div className="hidden md:block">
                        <DeleteAccountButton accountId={account.id}/>
                    </div>
                </div>
            </div>

            {/* Bar de recherche */}
            <FilterBarContainer
                filterType    ={filterType}
                setFilterType ={setFilterType}
                filterStatus  ={filterStatus}
                setFilterStatus={setFilterStatus}
                searchTerm    ={searchTerm}
                setSearchTerm ={setSearchTerm}
                filterDate    ={filterDate}
                setFilterDate ={setFilterDate}
                onRefresh     ={() => refetch()}
                isFetching    ={isFetching}
            />
            {
                filteredTransactions.length > 0 ? (
                    <AccountTransactionsTable
                        transactions={filteredTransactions}
                        account={account}
                    />
                ) : (
                    <EmptyTransaction/>
                )
            }
        </>
    );
}
