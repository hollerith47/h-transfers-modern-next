'use client';
import Link from "next/link";
import {Inbox} from "lucide-react";
import {useMemo, useState} from "react";
import {useFetchAccounts} from "@/hook/useAccount";
import Loader from "@/components/ui/Loader";
import AccountItem from "@/components/features/account/AccountItem";

const CURRENCIES = [
    {value: "all", label: "Tous"},
    {value: "USD", label: "Dollar (USD)"},
    {value: "RUB", label: "Rouble (RUB)"},
];

export default function AccountContainer() {
    const [searchTerm, setSearchTerm] = useState("");
    const {data: accounts = [], isLoading, isError} = useFetchAccounts();

    // Filtre par devise
    const [filterCurrency, setFilterCurrency] = useState<"all" | "USD" | "RUB">(
        "all"
    );

    const filteredAccounts = useMemo(() => {
        return accounts
            .filter((acct) =>
                filterCurrency === "all" ? true : acct.currency === filterCurrency
            )
            .filter((acct) =>
                acct.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
    }, [accounts, filterCurrency, searchTerm]);

    if (isLoading) {
        // return <Loading />;
        return <Loader fullScreen colorClass="text-primary"/>;
    }

    if (isError) {
        // TODO:: faire de composant pour l'erreur
        return <div>Failed to load accounts.</div>;
    }

    // console.log(accounts)

    return (
        <>
            {/* Contrôle de filtre */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4">
                {/* Filtrer par type */}
                <select
                    className="input input-sm md:input-md input-bordered w-full md:w-48"
                    value={filterCurrency}
                    onChange={(e) =>
                        setFilterCurrency(e.target.value as "all" | "USD" | "RUB")
                    }
                >
                    {CURRENCIES.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>

                {/* Recherche par description */}
                <input
                    type="text"
                    className="input input-sm md:input-md input-bordered w-full md:w-64"
                    placeholder="Rechercher par nom du compte"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {filteredAccounts.length > 0 ? (
                <ul className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 mt-5">
                    {filteredAccounts.map((account) => (
                        <Link href={`/manage/${account.id}`} key={account.id}>
                            <AccountItem account={account}/>
                        </Link>
                    ))}
                </ul>
            ) : (
                <div className="flex flex-col w-full items-center justify-center p-8 text-gray-500">
                    <Inbox strokeWidth={1.5} className="w-12 h-12 mb-4"/>
                    <p className="text-lg">Aucun compte disponible</p>
                </div>
            )}
        </>
    )
}
