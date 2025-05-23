import { useState, useMemo } from "react";
import type { Transaction } from "@/types";

export function useTransactionFilters(
    transactions: Transaction[]
) {
    const [filterType, setFilterType] = useState<"all"|"income"|"outcome">("all");
    const [filterStatus, setFilterStatus] = useState<"all"|"pending"|"completed">("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [filterDate, setFilterDate] = useState<string>(""); // "YYYY-MM-DD"

    const filtered = useMemo(() => {
        return transactions.filter((tx) => {
            const byType   = filterType === "all" || tx.type   === filterType;
            const byStatus = filterStatus === "all" || tx.status === filterStatus;
            const bySearch = tx.description
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

            const txDate = new Date(tx.createdAt)
                .toISOString()
                .split("T")[0];
            const byDate = !filterDate || txDate === filterDate;

            return byType && byStatus && bySearch && byDate;
        });
    }, [transactions, filterType, filterStatus, searchTerm, filterDate]);

    return {
        filtered,
        filterType,    setFilterType,
        filterStatus,  setFilterStatus,
        searchTerm,    setSearchTerm,
        filterDate,    setFilterDate,
    };
}
