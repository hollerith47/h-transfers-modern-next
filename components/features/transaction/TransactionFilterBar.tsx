"use client";
import React from "react";
import {TxFilterStatus, TxFilterType} from "@/types";


type Props = {
    filterType: string;
    setFilterType: React.Dispatch<React.SetStateAction<TxFilterType>>;
    filterStatus: string;
    setFilterStatus: React.Dispatch<React.SetStateAction<TxFilterStatus>>;
    searchTerm: string;
    setSearchTerm: (v: string) => void;
    filterDate: string;
    setFilterDate: (v: string) => void;
    onRefresh: () => void;
    isFetching: boolean;
};

export function TransactionFilterBar({filterType,  setFilterType, filterStatus, setFilterStatus, searchTerm,  setSearchTerm, filterDate, setFilterDate, onRefresh,     isFetching,}: Props) {
    return (
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4">
            <select
                className="input input-sm md:input-md input-bordered w-full md:w-48"
                value={filterType}
                onChange={e => setFilterType(e.target.value as TxFilterType)}
            >
                <option value="all">Tous les types</option>
                <option value="income">Entrées</option>
                <option value="outcome">Sorties</option>
            </select>

            <select
                className="input input-sm md:input-md input-bordered w-full md:w-48"
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value as TxFilterStatus)}
            >
                <option value="all">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="completed">Terminée</option>
            </select>

            <input
                type="text"
                className="input input-sm md:input-md input-bordered w-full md:w-64"
                placeholder="Recherche par description"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />

            <input
                type="date"
                lang="fr"
                className="input input-sm md:input-md input-bordered w-full md:w-48"
                value={filterDate}
                onChange={e => setFilterDate(e.target.value)}
            />

            <button
                className="btn btn-sm md:btn-md btn-outline btn-primary normal-case whitespace-nowrap w-full md:w-32"
                onClick={onRefresh}
                disabled={isFetching}
            >
                {isFetching ? "Chargement…" : "Rafraîchir"}
            </button>
        </div>
    );
}
