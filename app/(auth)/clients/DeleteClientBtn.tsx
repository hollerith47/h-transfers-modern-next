import {useMutation, useQueryClient} from "@tanstack/react-query";
import {z} from "zod";
import {DeleteClientSchema} from "@/schema";
import {DeleteClient} from "@/app/actions";
import {toast} from "sonner";
import {useUser} from "@clerk/nextjs";

type Props = {
    clientId: string;
}

export default function DeleteClientBtn({clientId}: Props) {
    const {user} = useUser();
    const queryClient = useQueryClient();

    const deleteClientMutation = useMutation(
        {
            mutationFn: async(data: z.infer<typeof DeleteClientSchema>) => DeleteClient(data),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['clients', user?.primaryEmailAddress?.emailAddress] });
            },
        }
    );

    const handleDeleteTransaction = async (clientId: string) => {
        const confirmDelete = confirm('Are you sure you want to delete this client?');
        if (confirmDelete) {
            return toast.promise(
                deleteClientMutation.mutateAsync({clientId}),
                {
                    loading: "Deleting client...",
                    success: "Client deleted successfully!",
                    error: (error)=> error instanceof Error ? error.message : "Failed to delete client."
                }
            );
        }
    }
    return (
        <button
            className="btn btn-xs md:btn-sm btn-error"
            onClick={() => handleDeleteTransaction(clientId)}
        >
            Supprimer
        </button>
    );
}