// import {Account} from "@/types";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import { deleteAccountAPI } from "@/lib/api";
import {getAccountsByUser} from "@/app/actions";
import {useUser} from "@clerk/nextjs";

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