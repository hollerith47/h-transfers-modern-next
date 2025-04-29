"use client";
import { useState, useEffect, ReactNode } from "react";
import { X, User as UserIcon, Mail, Phone } from "lucide-react";
import TextFieldInput from "@/components/TextFieldInput";
import type {ClientResponse} from "@/types";
import {AddClientSchema} from "@/schema";
import {z} from "zod";

type Props = {
    initialClient?: ClientResponse;
    onSubmit: (data: z.infer<typeof AddClientSchema>) => void;
    buttonLabel: string;
    modalTitle: string;
    modalId: string;
    buttonClassName?: string;
    children?: ReactNode;
};

export default function ClientFormModal({initialClient,onSubmit,buttonLabel,modalTitle,modalId,buttonClassName, children}: Props) {
    const [name, setName] = useState(initialClient?.name ?? "");
    const [email, setEmail] = useState(initialClient?.email ?? "");
    const [phone, setPhone] = useState(initialClient?.phone ?? "");

    // Réinitialise les champs si on passe un autre initialClient
    useEffect(() => {
        setName(initialClient?.name ?? "");
        setEmail(initialClient?.email ?? "");
        setPhone(initialClient?.phone ?? "");
    }, [initialClient]);

    const openModal = () => {
        const dlg = document.getElementById(modalId);
        if (dlg instanceof HTMLDialogElement) {
            dlg.showModal();
        }
    };
    const closeModal = () => {
        const dlg = document.getElementById(modalId);
        if (dlg instanceof HTMLDialogElement) {
            dlg.close();
        }
    };

    const handleSubmit = async () => {
        try {
            await onSubmit({ name, email, phone });
            closeModal();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <button className={buttonClassName ? buttonClassName : "btn btn-primary flex items-center gap-2"} onClick={openModal}>
                {buttonLabel} {children}
            </button>

            <dialog id={modalId} className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-soft btn-error absolute right-2 top-2">
                            <X />
                        </button>
                    </form>

                    <h3 className="font-bold text-lg py-2">{modalTitle}</h3>
                    <div className="flex flex-col gap-3">
                        <TextFieldInput
                            value={name}
                            label="Nom du client"
                            setValue={setName}
                        >
                            <UserIcon />
                        </TextFieldInput>
                        <TextFieldInput
                            value={email}
                            label="Email (optionnel)"
                            setValue={setEmail}
                        >
                            <Mail />
                        </TextFieldInput>
                        <TextFieldInput
                            value={phone}
                            label="Téléphone (optionnel)"
                            setValue={setPhone}
                        >
                            <Phone />
                        </TextFieldInput>

                        <button
                            onClick={handleSubmit}
                            className="btn btn-primary btn-bordered rounded-xl mt-4"
                        >
                            {initialClient ? "Enregistrer" : "Ajouter"}
                        </button>
                    </div>
                </div>
            </dialog>
        </>
    );
}
