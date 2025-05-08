import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import { deleteAccountAPI } from "@/lib/api";
import {getAccountsByUser} from "@/app/actions";
import {useUser} from "@clerk/nextjs";
import { getTotalByType } from "@/utils/getTotalByType";
import {Account, DashboardEntry} from "@/types";
import {useMemo} from "react";

export function UseAccountCurrency(accountCurrency:  string) {
    // const accountCurrency = account.currency;
    const oppositeCurrency = accountCurrency === "USD" ? "RUB" : "USD";
    const isNotRubleAccount = accountCurrency !== "RUB";

    return {accountCurrency, oppositeCurrency, isNotRubleAccount}
}



export function useDeleteAccount() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: deleteAccountAPI,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["accounts"] });
        }
    })
}

export function useFetchAccounts() {
    const {user} = useUser();
    const email = user?.primaryEmailAddress?.emailAddress;
    return useQuery({
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
}

export function useAccountsWithStats(){
    const {data: accounts=[]} = useFetchAccounts();

    const withStats = (acct: Account): DashboardEntry => {
        const tCount = acct.transactions?.length || 0;
        const totalIncome = parseFloat(getTotalByType(acct.transactions, "income"));
        const totalOutcome = parseFloat(getTotalByType(acct.transactions, "outcome"));
        const startAmt = acct.amount ?? 0;
        const rawBal = startAmt + totalIncome - totalOutcome;
        const bal = parseFloat(rawBal.toFixed(2));
        const accountCurrency = acct.currency;

        return {
            account: acct,
            stats: {
                transactionCount: tCount,
                totalIncomeTransactions: totalIncome,
                totalOutcomeTransactions: totalOutcome,
                startingAmount: startAmt,
                rawBalance: rawBal,
                balance: bal,
                accountCurrency
            },
        };
    };

    const usdAccounts = useMemo<DashboardEntry[]>(
        () =>
            accounts
                .filter((a) => a.currency === "USD" && a.name !== "USDT")
                .map(withStats),
        [accounts]
    );
    const usdtAccounts = useMemo<DashboardEntry[]>(
        () => accounts.filter((a) => a.name === "USDT").map(withStats),
        [accounts]
    );
    const rubAccounts = useMemo<DashboardEntry[]>(
        () => accounts.filter((a) => a.currency === "RUB").map(withStats),
        [accounts]
    );
    const eurAccounts = useMemo<DashboardEntry[]>(
        () => accounts.filter((a) => a.currency === "EUR").map(withStats),
        [accounts]
    );

    return {usdAccounts, usdtAccounts, rubAccounts, eurAccounts};
}

export function useTotalGroupBalance(entries: DashboardEntry[]) {
    return useMemo(() => {
        return entries.reduce((sum, entry) => sum + entry.stats.balance, 0);
    }, [entries]);
}