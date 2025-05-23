"use client"
import {useTransactions} from "@/hook/useTransaction";
import {useMemo, useState} from "react";
import TransactionsTable from "@/app/(auth)/transactions/TransactionsTable";
import Loader from "@/components/ui/Loader";
import EmptyTransaction from "@/components/ui/EmptyTransaction";

export default function TransactionsContainer() {
    const {data: txs=[], isLoading, isError , isFetching, refetch} = useTransactions();

    const [filterType, setFilterType] = useState<"all"|"income"|"outcome">("all");
    const [filterStatus, setFilterStatus] = useState<"all"|"pending"|"completed">("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [filterDate, setFilterDate] = useState<string>(""); // YYYY-MM-DD

    const filtered = useMemo(() => {
        return txs.filter((tx) => {
            const byType = filterType === "all" || tx.type === filterType;
            const byStatus = filterStatus === "all" || tx.status === filterStatus;
            const bySearch = tx.description
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

            // Filtre par date : on compare la partie YYYY-MM-DD
            const txDate = new Date(tx.createdAt)
                .toISOString()
                .split("T")[0];
            const matchesDate = !filterDate || txDate === filterDate;
            return byType && byStatus && bySearch && matchesDate;
        });
    }, [txs, filterType, filterStatus, searchTerm, filterDate]);

    if (isLoading) return <Loader fullScreen />;
    if (isError)   return <div className="p-4">Erreur de chargement.</div>;

    // console.log(txs)
    return (
        <div>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3 mb-4">
                <select
                    className="input input-sm md:input-md input-bordered w-full md:w-48"
                    value={filterType}
                    onChange={(e) =>
                        setFilterType(e.target.value as "all" | "income" | "outcome")
                    }
                >
                    <option value="all">Tous les types</option>
                    <option value="income">Entrées</option>
                    <option value="outcome">Sorties</option>
                </select>

                <select
                    className="input input-sm md:input-md input-bordered w-full md:w-48"
                    value={filterStatus}
                    onChange={(e) =>
                        setFilterStatus(e.target.value as "all" | "pending" | "completed")
                    }
                >
                    <option value="all">Tous les statuts</option>
                    <option value="pending">En attente</option>
                    <option value="completed">Terminée</option>
                </select>
                <input
                    type="text"
                    className="input input-sm md:input-md input-bordered w-full md:w-64"
                    placeholder="Rechercher par description"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="grid grid-cols-2 gap-4 w-full md:w-auto ">
                    {/* Filtre par date */}
                    <input
                        type="date"
                        lang="fr"
                        placeholder=""
                        className="input input-sm md:input-md input-bordered input-bordered w-full md:w-48"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                    />

                    {/* Nouveau bouton Rafraîchir */}
                    <button
                        className="btn btn-sm md:btn-md btn-outline btn-primary normal-case whitespace-nowrap w-full md:w-32"
                        onClick={() => refetch()}
                        disabled={isFetching}
                    >
                        {isFetching ? "Chargement…" : "Rafraîchir"}
                    </button>
                </div>
            </div>
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