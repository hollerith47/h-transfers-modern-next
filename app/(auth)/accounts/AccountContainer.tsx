'use client';
import {useQuery} from '@tanstack/react-query';
import {useUser} from "@clerk/nextjs";
import {getAccountsByUser} from "@/app/actions";
import Link from "next/link";
import AccountItem from "@/components/AccountItem";

export default function AccountContainer() {
    const {user} = useUser();
    const email = user?.primaryEmailAddress?.emailAddress;
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

    if (isLoading) {
        // TODO:: faire de composant pour loader pour le chargement
        return <div>Loading accounts...</div>;
    }

    if (isError) {
        // TODO:: faire de composant pour l'erreur
        return <div>Failed to load accounts.</div>;
    }

    console.log(accounts)

    return (
        <ul className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 mt-5">
            {accounts.map(account => (
                <Link href={`/manage/${account.id}`} key={account.id}>
                    <AccountItem account={account} />
                </Link>
            ))}
        </ul>
    );
}