"use client";
import {useUser} from "@clerk/nextjs";
import { UserIcon } from "lucide-react";
import {AddClient} from "@/app/actions";
import {toast} from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {z} from "zod";
import {AddClientSchema} from "@/schema";
import ClientFormModal from "@/components/features/client/ClientFormModal";

export default function ClientForm() {
    const { user } = useUser();
    const queryClient = useQueryClient();

    const createMutation = useMutation(
        {
            mutationFn: async(data: z.infer<typeof AddClientSchema>) => AddClient(data),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['clients', user?.primaryEmailAddress?.emailAddress] });
            },
        }
    );
    const handleCreateClient = (data: z.infer<typeof AddClientSchema>) => {
        return toast.promise(
            createMutation.mutateAsync(data),
            {
                loading: "Creating client...",
                success: "Client created successfully!",
                error: (error)=> error instanceof Error ? error.message : "Failed to create client."
            }
        );
    };

    return (
        <>
            <ClientFormModal
                modalId="modal-create-client"
                buttonLabel="Ajouter Nouveau Client"
                modalTitle="Ajouter le nouveau client"
                onSubmit={(data: z.infer<typeof AddClientSchema>) => handleCreateClient(data)}
            >
                <UserIcon />
            </ClientFormModal>
        </>
    );
}