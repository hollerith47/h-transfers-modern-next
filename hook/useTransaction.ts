import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {DeleteTransaction} from "@/app/actions";
import {useAuth, useUser} from "@clerk/nextjs";
import {Transaction} from "@/types";

type DeleteTxVariables = {
    transactionId: string;
    accountId:     string;
};
export function useDeleteTransaction() {
    const qc = useQueryClient();
    return useMutation<void, Error, DeleteTxVariables>({
        mutationFn: DeleteTransaction,
        onSuccess: (_data, variables) => {
            qc.invalidateQueries({ queryKey: ["account", variables.accountId] });
        }
    })
}

export function useTransactions(){
    const {user} = useUser();

    return useQuery<Transaction[], Error>({
        queryKey: ["all-transactions"],
        queryFn: async () => {
            const email = user?.primaryEmailAddress?.emailAddress;
            const res = await fetch('/api/transactions', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({email}),
            });
            if (!res.ok){
                const err = await res.json().catch((error) => error);
                throw new Error(err?.error || res.statusText);
            }
            return res.json()
        },
    })
}