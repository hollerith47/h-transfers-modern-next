"use client";
import {useState, useEffect, ReactNode} from "react";
import {Banknote, X} from "lucide-react";
import TextFieldInput from "@/components/TextFieldInput";
import SelectTransactType from "@/components/SelectTransactType";
import SelectInput from "@/components/SelectInput";
import {countCommission} from "@/utils/countCommission";
import {TransactionFormSchema, TransactionInitialData} from "@/schema";
import type {z} from "zod";
import {currencyOptions} from "@/data";
import {useQuery} from "@tanstack/react-query";
import { ClientResponse} from "@/types";
import {getClients} from "@/app/actions";
import {useUser} from "@clerk/nextjs";

type TForm = z.infer<typeof TransactionFormSchema>;

type Props = {
    accountCurrency: string;
    initialData?: z.infer<typeof TransactionInitialData>;
    onSubmit: (data: TForm) => void;
    buttonLabel: string;
    modalTitle: string;
    modalId: string;
    buttonClassName?: string;
    children?: ReactNode;
};

export default function TransactionFormModal({accountCurrency,initialData,onSubmit,buttonLabel,modalTitle,modalId,buttonClassName, children}: Props) {
    const {user} = useUser();
    const [description, setDescription] = useState(initialData?.description ?? "");
    const [amount, setAmount] = useState(initialData ? String(initialData.amount) : "");
    const [paidAmount, setPaidAmount] = useState(initialData ? String(initialData.paidAmount ?? "") : "");
    const [paidCurrency, setPaidCurrency] = useState(initialData?.paidCurrency ?? "");
    const [transactType, setTransactType] = useState<TForm["type"]>(initialData?.type ?? "income");
    const email = user?.primaryEmailAddress?.emailAddress;

    const [showDropdown, setShowDropdown] = useState(false);
    const [clientQuery, setClientQuery] = useState("");
    const [clientId, setClientId] = useState<string | undefined>(
        initialData?.clientId
    );


    const {data: clients=  []} = useQuery<ClientResponse[], Error>({
        queryKey: ['clients', email],
        queryFn: async () => {
            if (!email) return [];
            try {
                return await getClients();
            } catch (error) {
                console.error("error while fetching accounts", error);
                throw error;
            }
        },
        enabled: !!initialData, // Important pour éviter un appel sans initialData
    });

    // Réinitialise quand initialData change (mode édition)
    useEffect(() => {
        if (initialData) {
            setDescription(initialData.description);
            setAmount(String(initialData.amount));
            setPaidAmount(String(initialData.paidAmount ?? ""));
            setPaidCurrency(initialData.paidCurrency ?? "");
            setTransactType(initialData.type);
        }
    }, [initialData, clients]);

    // — Filtrage « typeahead »
    const filteredClients = clients.filter((c) =>
        c.name.toLowerCase().includes(clientQuery.toLowerCase())
    );

    // Labels dynamiques
    const labelRec = "Montant recu du client*";
    const labelPay = "Montant payez au client*";
    const montantLabel =
        transactType === "outcome" ? labelPay : labelRec;
    const clientAmountLabel =
        transactType === "outcome" ? labelRec : labelPay;

    // Calculs “à la volée”
    const m = parseFloat(amount) || 0;
    const commission =
        transactType === "income"
            ? parseFloat(countCommission(m))
            : 0;
    const clientAmount =
        transactType === "income" ? m - commission : m;

    const breakDown = transactType === "income" && m > 0;

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
        // Valide & convertit
        const data = TransactionFormSchema.parse({
            description,
            amount: parseFloat(amount),
            commission,
            clientAmount,
            paidAmount: parseFloat(paidAmount) || 0,
            paidCurrency,
            type: transactType,
        });

        // On délègue tout à onSubmit (assumé renvoyer Promise)
        await onSubmit({...data, clientId});
        // Ferme le modal
        closeModal();
        setDescription("");
        setAmount("");
        setPaidAmount("")
        setPaidCurrency( "");
        setTransactType("income");
    };

    return (
        <>
            <button className={buttonClassName ? buttonClassName : "btn btn-primary flex items-center gap-2"}
                    onClick={openModal}>
                {buttonLabel} {children}
            </button>

            <dialog id={modalId} className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-soft btn-error absolute right-2 top-2">
                            <X/>
                        </button>
                    </form>

                    <h3 className="font-bold text-lg py-2">{modalTitle}</h3>
                    <div className="flex flex-col gap-3">
                        <SelectTransactType
                            value={transactType}
                            label="Type de transaction"
                            setValue={setTransactType}
                        >
                            {children /* ou icône dédiée */}
                        </SelectTransactType>

                        <TextFieldInput
                            value={amount}
                            label={montantLabel}
                            setValue={setAmount}
                        />

                        {breakDown && (
                            <div className="text-gray-500 flex justify-between -mt-2 mb-2">
                                <span>
                                  commission : {commission} {accountCurrency}
                                </span>
                                <span>
                                  client : {clientAmount} {accountCurrency}
                                </span>
                            </div>
                        )}

                        <TextFieldInput
                            value={paidAmount}
                            label={clientAmountLabel}
                            setValue={setPaidAmount}
                        />

                        <SelectInput
                            value={paidCurrency as string}
                            label="Sélectionner devise payée"
                            setValue={setPaidCurrency}
                            options={currencyOptions}
                        >
                            <Banknote />
                        </SelectInput>

                        <TextFieldInput
                            value={description as string}
                            label="Description*"
                            setValue={setDescription}
                        />
                        {initialData && (
                            <div className="relative">
                                <TextFieldInput
                                    value={clientQuery}
                                    label="Chercher un client"
                                    setValue={(val) => {
                                        setClientQuery(val);
                                        setClientId(undefined);
                                        setShowDropdown(true);
                                    }}
                                />
                                {showDropdown && clientQuery && filteredClients.length > 0 && (
                                    <ul className="absolute z-10 w-full max-h-40 overflow-auto bg-white border">
                                        {filteredClients.map((c) => (
                                            <li
                                                key={c.id}
                                                className="cursor-pointer px-2 py-1 hover:bg-gray-200 "
                                                onClick={() => {
                                                    setClientQuery(c.name);
                                                    setClientId(c.id);
                                                    setShowDropdown(false);
                                                }}
                                            >
                                                {c.name}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}
                        <button
                            onClick={handleSubmit}
                            className="btn btn-primary btn-bordered rounded-xl mt-2"
                        >
                            {initialData ? "Enregistrer les modifications" : "Créer une transaction"}
                        </button>
                    </div>
                </div>
            </dialog>
        </>
    );
}

