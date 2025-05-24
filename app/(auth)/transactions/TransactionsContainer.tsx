"use client"
import {useTransactions} from "@/hook/useTransaction";
import TransactionsTable from "@/app/(auth)/transactions/TransactionsTable";
import Loader from "@/components/ui/Loader";
import EmptyTransaction from "@/components/ui/EmptyTransaction";
import {useTransactionFilters} from "@/hook/useTransactionFilters";
import {FilterBarContainer} from "@/components/ui/FilterBarContainer";

export default function TransactionsContainer() {
    const {data: txs=[], isLoading, isError , isFetching, refetch} = useTransactions();

    const {
        filtered,
        filterType, setFilterType,
        filterStatus, setFilterStatus,
        searchTerm,   setSearchTerm,
        filterDate,   setFilterDate,
    } = useTransactionFilters(txs);

    if (isLoading) return <Loader fullScreen />;
    if (isError)   return <div className="p-4">Erreur de chargement.</div>;

    // console.log(txs)
    return (
        <div>
            <FilterBarContainer
                filterType={filterType}
                filterStatus={filterStatus}
                filterDate={filterDate}
                setFilterType={setFilterType}
                setFilterStatus={setFilterStatus}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                setFilterDate={setFilterDate}
                onRefresh={() => refetch()}
                isFetching={isFetching}
            />
            {filtered.length > 0 ? (
                <>
                    <TransactionsTable transactions={filtered}/>
                </>
            ) : (
                <EmptyTransaction />
            )}
        </div>
    );
}