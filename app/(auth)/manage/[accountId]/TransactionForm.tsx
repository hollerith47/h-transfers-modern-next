"use client";
import {ArrowLeftRight} from "lucide-react";
import {toast} from "sonner";
import {AddTransactionSchema} from "@/schema";
import {z} from "zod";
import {Account} from "@/types";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {createTransaction} from "@/app/actions";
import {getTotalByType} from "@/utils/getTotalByType";
import {useRouter} from "next/navigation";
import TransactionFormModal from "@/components/features/transaction/TransactionFormModal";

type Props = {
    account: Account;
};

export default function TransactionForm({account}: Props) {
    const queryClient = useQueryClient();
    const router = useRouter();
    const createTx = useMutation({
        mutationFn: (data: z.infer<typeof AddTransactionSchema>) => createTransaction(data),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["account", account.id]});
            queryClient.invalidateQueries({queryKey: ["all-transactions"]});
            router.refresh();
        },
    });

    const handleCreateTransaction = (data: z.infer<typeof AddTransactionSchema>) => {
        if (data.type === "outcome") {
            const totalIn = parseFloat(getTotalByType(account.transactions, "income"));
            const totalOut = parseFloat(getTotalByType(account.transactions, "outcome"));
            const available = (account.amount ?? 0) + totalIn - totalOut;
            if (data.amount > available) {
                toast.error("Not enough funds");
                return
            }
        }

        return toast.promise(
            createTx.mutateAsync(data),
            {
                loading: "Creating transaction...",
                success: "Transaction created! successfully!",
                error: (error) => error instanceof Error ? error.message : "Failed to create transaction."
            }
        );
    };

    return (
        <>
            <div key={account.id}>
                <TransactionFormModal
                    accountCurrency={account.currency}
                    buttonLabel="Créer Transaction"
                    modalTitle="Nouvelle transaction"
                    modalId="modal-create-tx"
                    onSubmit={(formData) =>
                        handleCreateTransaction({...formData, accountId: account.id, emoji: account.emoji!})
                    }
                >
                    <ArrowLeftRight/>
                </TransactionFormModal>
            </div>
        </>
    );
}