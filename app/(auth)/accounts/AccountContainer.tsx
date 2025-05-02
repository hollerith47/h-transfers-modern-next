'use client';
import {useQuery} from '@tanstack/react-query';
import {useUser} from "@clerk/nextjs";
import {getAccountsByUser} from "@/app/actions";
import Link from "next/link";
import AccountItem from "@/components/AccountItem";
import Loader from "@/components/Loader";
import {Inbox} from "lucide-react";
import {useMemo, useState} from "react";

const CURRENCIES = [
    {value: "all", label: "Tous"},
    {value: "USD", label: "Dollar (USD)"},
    {value: "RUB", label: "Rouble (RUB)"},
];

export default function AccountContainer() {
    const {user} = useUser();
    const email = user?.primaryEmailAddress?.emailAddress;
    const [searchTerm, setSearchTerm] = useState("");

    const {
        data: accounts = [],
        isLoading,
        isError,
    } = useQuery({
        queryKey: ['accounts', email],
        queryFn: async () => {
            if (!email) return [];
            // const toastId = toast.loading('Fetching accounts...');
            try {
                // toast.success('Accounts fetched successfully!', { id: toastId });
                return await getAccountsByUser({email});
            } catch (error) {
                console.error("error while fetching accounts", error);
                // toast.error('Failed to fetch accounts.', { id: toastId });
                throw error;
            }
        },
        enabled: !!email, // Important pour éviter un appel sans email
    });

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
        return <Loader fullScreen size="xl" colorClass="text-primary"/>;
    }

    if (isError) {
        // TODO:: faire de composant pour l'erreur
        return <div>Failed to load accounts.</div>;
    }

    console.log(accounts)

    return (
        <>
            {/* Contrôle de filtre */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4">
                {/* Filtrer par type */}
                <select
                    className="input input-bordered w-full md:w-48"
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
                    className="input input-bordered w-full md:w-64"
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
