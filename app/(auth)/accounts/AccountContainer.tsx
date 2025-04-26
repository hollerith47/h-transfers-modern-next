'use client';

import { toast } from 'sonner';
import {useUser} from "@clerk/nextjs";
import {getAccountsByUser} from "@/app/actions";
import {useEffect, useState} from "react";
import {Account} from "@/types";
import Link from "next/link";
import AccountItem from "@/components/AccountItem";

export default function AccountContainer() {
    const {user} = useUser();
    const [accounts, setAccounts] = useState<Account[]>([]);
    const fetchAccounts = async () => {
        if (user?.primaryEmailAddress?.emailAddress) {
            try {
                const toastId = toast.loading('Fetching accounts...');
                const userAccounts = await getAccountsByUser({
                    email: user.primaryEmailAddress.emailAddress,
                });
                setAccounts(userAccounts);
                toast.success('Accounts fetched successfully!', { id: toastId });
            } catch (error) {
                console.error("error while fetching accounts", error);
                toast.error('Failed to fetch accounts.');
            }
        }
    }

    useEffect(() => {
        fetchAccounts();
    }, [user?.primaryEmailAddress?.emailAddress]);

    console.log(accounts)

    return (
        <ul className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 mt-5">
            {accounts.map(account => (
                <Link href={""} key={account.id}>
                    <AccountItem account={account} />
                </Link>
            ))}
        </ul>
    );
}