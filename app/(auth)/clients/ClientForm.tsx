"use client";
import { useState} from "react";
import {useUser} from "@clerk/nextjs";
import {  Mail, Phone, UserIcon, X} from "lucide-react";
import TextFieldInput from "@/components/TextFieldInput";
import {AddClient} from "@/app/actions";
import {toast} from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function ClientForm() {
    const {user} = useUser();
    const queryClient = useQueryClient();

    const [clientName, setClientName] = useState('');
    const [clientEmail, setClientEmail] = useState('');
    const [clientPhone, setClientPhone] = useState('');
    // const [clientBankCardNumber, setClientBankCardNumber] = useState('');

    const mutation = useMutation({
        mutationFn: async () => {
            return AddClient({
                email: clientEmail,
                name: clientName,
                phone: clientPhone
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clients', user?.primaryEmailAddress?.emailAddress] });
            const modal = document.getElementById("my_modal_5") as HTMLDialogElement;
            if (modal) {
                modal.close();
                setClientName("");
                setClientEmail("")
                setClientPhone("");
                // setClientBankCardNumber("");
            }
        },
        onError: () => {
            toast.error('Failed to create account.');
        }
    });

    const handleCreateClient = async () => {
        console.log({clientName, clientEmail, clientPhone});
        toast.promise(mutation.mutateAsync(), {
            loading: 'Creating client...',
            success: 'Client created successfully!',
            error: 'Failed to create account.',
        });
    };

    return (
        <>
            <button className="btn btn-primary flex items-center gap-2"
                    onClick={() => (document.getElementById('my_modal_5') as HTMLDialogElement).showModal()}>
                Ajouter Nouveau Client <UserIcon  />
            </button>
            <dialog id="my_modal_5" className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-soft btn-error absolute right-2 top-2">
                            <X/>
                        </button>
                    </form>
                    <h3 className="font-bold text-lg">Ajouter le nouveau client</h3>
                    <p className="py-4">Ajouter le detail du client</p>
                    <div className="w-full flex flex-col">
                        <TextFieldInput
                            value={clientName}
                            label="Client name"
                            setValue={setClientName}
                        >
                            <UserIcon />
                        </TextFieldInput>
                        <TextFieldInput
                            value={clientEmail}
                            label="Client Email (optional)"
                            setValue={setClientEmail}
                        >
                            <Mail />
                        </TextFieldInput>
                        <TextFieldInput
                            value={clientPhone}
                            label="Client phone number (optional)"
                            setValue={setClientPhone}
                        >
                            <Phone />
                        </TextFieldInput>
                        {/*<TextFieldInput*/}
                        {/*    value={clientBankCardNumber}*/}
                        {/*    label="Numero de compte (optional)"*/}
                        {/*    setValue={setClientBankCardNumber}*/}
                        {/*>*/}
                        {/*    <CreditCard />*/}
                        {/*</TextFieldInput>*/}

                        <button
                            onClick={handleCreateClient}
                            className="btn btn-primary btn-bordered rounded-xl"
                        >
                            Ajouter le client
                        </button>
                    </div>
                </div>
            </dialog>
        </>
    );
}