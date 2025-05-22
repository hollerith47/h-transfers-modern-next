import UseUserRole from "@/hook/useUserRole";
import {useState} from "react";
import {toast} from "sonner";
import ConfirmDialog from "@/components/ConfirmDialog";
import {useDeleteTransaction} from "@/hook/useTransaction";

type Props = {
    accountId: string,
    transactionId: string
}
export default function DeleteTransactionButton({transactionId, accountId}: Props) {
    const {isAdmin} = UseUserRole();
    const {mutateAsync, isPending} = useDeleteTransaction();
    const [isOpen, setIsOpen] = useState(false);
    const handleDelete = () => {
        toast.promise(
            mutateAsync({ transactionId, accountId }),
            {
                loading: "Suppression…",
                success: "Transaction supprimée !",
                error:   "Échec de la suppression.",
            }
        );
    };

    if (!isAdmin) return null;

    return (
        <>
            <button
                disabled={isPending}
                onClick={() => setIsOpen(true)}
                className="btn btn-xs md:btn-sm btn-error">
                Supprimer
            </button>
            <ConfirmDialog
                isOpen={isOpen}
                title="Supprimer la transaction?"
                description="Cette action est irréversible. Êtes-vous sûr ?"
                confirmLabel="Oui, supprimer"
                cancelLabel="Annuler"
                onConfirm={handleDelete}
                onCancel={() => setIsOpen(false)}
            />
        </>
    );
}