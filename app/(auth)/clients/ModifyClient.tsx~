import {z} from "zod";
import {AddClientSchema, UpdateClientSchema} from "@/schema";
import ClientFormModal from "@/components/ClientFormModal";
import { ClientResponse} from "@/types";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {AddClient} from "@/app/actions";
import {toast} from "sonner";
import {useUser} from "@clerk/nextjs";

type Props = {
    client: ClientResponse
};
export default function ModifyClient({client}: Props) {
    const {user} = useUser();
    const queryClient = useQueryClient();

    const updateClientMutation = useMutation(
        {
            // TODO:: on peut modifier le client tjr avec AddClient
            mutationFn: async (data: z.infer<typeof AddClientSchema>) => AddClient(data),
            onSuccess: () => {
                queryClient.invalidateQueries({queryKey: ['clients', user?.primaryEmailAddress?.emailAddress]});
            },
        }
    );
    const handleCreateClient = (data: z.infer<typeof UpdateClientSchema>) => {
        return toast.promise(
            updateClientMutation.mutateAsync(data),
            {
                loading: "Creating client...",
                success: "Client created successfully!",
                error: (error)=> error instanceof Error ? error.message : "Failed to modify client."
            }
        );
    };

    return (
        <ClientFormModal
            initialClient={client}
            modalId={`modal-edit-client-${client.id}`}
            buttonLabel="Modifier"
            buttonClassName="btn btn-sm btn-success flex items-center gap-2"
            modalTitle="Modifier le client"
            onSubmit={(data: z.infer<typeof AddClientSchema>) => handleCreateClient({...data, id: client.id})}
        />
    );
}