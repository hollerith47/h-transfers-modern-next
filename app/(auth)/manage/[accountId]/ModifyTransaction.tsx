"use client"
import {z} from "zod";
import {Account, Transaction} from "@/types";
import TransactionFormModal from "@/components/TransactionFormModal";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {UpdateTransactionSchema} from "@/schema";
import { updateTransaction} from "@/app/actions";
import {toast} from "sonner";
import UseUserRole from "@/hook/useUserRole";

type Props = {
    transaction: Transaction,
    account: Account
};

export default function ModifyTransaction({transaction, account}: Props) {
    const queryClient = useQueryClient();
    const {isAdmin} = UseUserRole();

    // console.log(isAdmin)

    const updateTx = useMutation({
        // updateTransaction
        mutationFn: (data: z.infer<typeof UpdateTransactionSchema>) => updateTransaction(data),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["account", account.id]});
        },
    });

    const handleUpdateTransaction = (data: z.infer<typeof UpdateTransactionSchema>) => {
        return toast.promise(
            updateTx.mutateAsync(data),
            {
                loading: "Creating transaction...",
                success: "Transaction created! successfully!",
                error: (error)=> error instanceof Error ? error.message : "Failed to create transaction."
            }
        );
    };

    return (
        <div key={transaction.id}>
            <TransactionFormModal
                key={transaction.id}
                accountCurrency={account.currency}
                initialData={{
                    description: transaction.description,
                    amount: transaction.amount,
                    clientAmount: transaction.clientAmount ?? 0,
                    clientId: transaction.clientId ?? undefined,
                    commission: transaction.commission ?? 0,
                    paidAmount: transaction.paidAmount ?? 0,
                    paidCurrency: transaction.paidCurrency ?? "",
                    type: transaction.type,
                    status: transaction.status ?? "pending"
                }}
                buttonClassName="btn btn-xs md:btn-sm btn-success"
                buttonLabel="Modifier"
                modalTitle="Modifier transaction"
                modalId={`modal-edit-tx-${transaction.id}`}
                onSubmit={(data) => handleUpdateTransaction({...data, id: transaction.id, isAdmin})}
            />
        </div>
    );
}