import {useMutation, useQueryClient} from "@tanstack/react-query";
import {DeleteTransaction} from "@/app/actions";

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