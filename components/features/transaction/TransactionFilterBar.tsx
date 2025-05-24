"use client";
import React, {useEffect, useState} from "react";
import {TxFilterStatus, TxFilterType} from "@/types";


export type TransactionFilterBarProps = {
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

export function TransactionFilterBar({
                                         filterType,
                                         setFilterType,
                                         filterStatus,
                                         setFilterStatus,
                                         searchTerm,
                                         setSearchTerm,
                                         filterDate,
                                         setFilterDate,
                                         onRefresh,
                                         isFetching,
                                     }: TransactionFilterBarProps) {
    const [isDateMode, setIsDateMode] = useState(false);
    // si on a un filterDate déjà, forcer le mode date
    useEffect(() => {
        if (filterDate) setIsDateMode(true);
    }, [filterDate]);

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

            <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                <label htmlFor="choice" className="btn btn-sm btn-outline btn-secondary md:hidden btn-bordered w-full">Recherche par date:</label>
                <input
                    id="choice"
                    type={isDateMode ? "date" : "text"}
                    pattern="\d{2}/\d{2}/\d{4}"
                    placeholder="Choisir une date:"
                    value={isDateMode ? filterDate : ""}
                    onFocus={() => setIsDateMode(true)}
                    className="input input-sm md:input-md input-bordered w-full"
                    onBlur={() => {
                        // si on sort sans date, repasser en text pour placeholder
                        if (!filterDate) setIsDateMode(false);
                    }}
                    onChange={e => setFilterDate(e.target.value)}
                />

                <button
                    className="btn hidden md:block btn-sm md:btn-md btn-outline btn-primary normal-case whitespace-nowrap w-full"
                    onClick={onRefresh}
                    disabled={isFetching}
                >
                    {isFetching ? "Chargement…" : "Rafraîchir"}
                </button>
            </div>
        </div>
    );
}
