"use client"
import {useDeleteAccount} from "@/hook/useAccount";
import {toast} from "sonner";
import {DeleteAccountPayload} from "@/types";
import {useRouter} from "next/navigation";
import UseUserRole from "@/hook/useUserRole";
import {useState} from "react";
import ConfirmDialog from "@/components/ConfirmDialog";


const DeleteAccountButton = ({accountId}: DeleteAccountPayload) => {
    const {isAdmin} = UseUserRole()
    const {mutateAsync, isPending} = useDeleteAccount();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const handleDeleteAccount = async () => {
        toast.promise(mutateAsync({accountId}), {
            loading: 'Deleting account...',
            success: 'Account deleted successfully!',
            error: 'Failed to delete account.',
        });
        router.push("/accounts");
    };

    if (!isAdmin) return null

    return (
        <>
            <button
                className="btn btn-error"
                disabled={isPending}
                onClick={() => setIsOpen(true)}
            >
                {isPending ? "Suppression…" : "Supprimer le compte"}
            </button>
            <ConfirmDialog
                isOpen={isOpen}
                title="Supprimer ce compte ?"
                description="Cette action est irréversible. Êtes-vous sûr ?"
                confirmLabel="Oui, supprimer"
                cancelLabel="Annuler"
                onConfirm={handleDeleteAccount}
                onCancel={() => setIsOpen(false)}
            />
        </>
    );
};

export default DeleteAccountButton;