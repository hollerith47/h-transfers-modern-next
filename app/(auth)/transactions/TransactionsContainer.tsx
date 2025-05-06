"use client"
import {useTransactions} from "@/hook/useTransaction";
import {useMemo, useState} from "react";
import Loader from "@/components/Loader";
import EmptyTransaction from "@/components/EmptyTransaction";
import TransactionsTable from "@/app/(auth)/transactions/TransactionsTable";

export default function TransactionsContainer() {
    const {data: txs=[], isLoading, isError} = useTransactions();

    const [filterType, setFilterType] = useState<"all"|"income"|"outcome">("all");
    const [filterStatus, setFilterStatus] = useState<"all"|"pending"|"completed">("all");
    const [searchTerm, setSearchTerm] = useState("");

    const filtered = useMemo(() => {
        return txs.filter((tx) => {
            const byType = filterType === "all" || tx.type === filterType;
            const byStatus = filterStatus === "all" || tx.status === filterStatus;
            const bySearch = tx.description
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
            return byType && byStatus && bySearch;
        });
    }, [txs, filterType, filterStatus, searchTerm]);

    if (isLoading) return <Loader fullScreen size="xl"/>;
    if (isError)   return <div className="p-4">Erreur de chargement.</div>;

    // console.log(txs)
    return (
        <div>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3 mb-4">
                <select
                    className="input input-bordered w-full md:w-48"
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
                    className="input input-bordered w-full md:w-48"
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
                    className="input input-bordered w-full md:w-64"
                    placeholder="Rechercher par description"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            {filtered.length > 0 ? (
                <>
                    <TransactionsTable transactions={filtered}/>
                </>
            ) : (
                <EmptyTransaction/>
            )}
        </div>
    );
}