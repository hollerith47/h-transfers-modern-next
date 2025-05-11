"use client";
import {useState, useEffect, ReactNode, useMemo} from "react";
import { SquarePen, X} from "lucide-react";
import TextFieldInput from "@/components/TextFieldInput";
import SelectTransactType from "@/components/SelectTransactType";
import SelectInput from "@/components/SelectInput";
import {countCommission, fixeAmount} from "@/utils/countCommission";
import {TransactionFormSchema, TransactionInitialData} from "@/schema";
import type {z} from "zod";
import {transactStatusOptions} from "@/data";
import {TransactionStatus} from "@/types";
import {convertCurrency} from "@/utils/convertCurrency";
import UseUserRole from "@/hook/useUserRole";
import ReferenceGenerator from "@/components/ReferenceGenerator";
import {useFetchClients} from "@/hook/useClient";
import {buildClientNameMap, getClientName} from "@/utils/ClientUtils";

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

export default function TransactionFormModal({accountCurrency,initialData,onSubmit,buttonLabel,modalTitle,modalId,buttonClassName,children}: Props) {
    const {isAdmin} = UseUserRole();
    const [description, setDescription] = useState(initialData?.description ?? "");
    const [amount, setAmount] = useState(initialData ? String(initialData.amount) : "");
    const [paidAmount, setPaidAmount] = useState(initialData ? String(initialData.paidAmount ?? "") : "");
    const [transactType, setTransactType] = useState<TForm["type"]>(initialData?.type ?? "income");
    const [transactStatus, setTransactStatus] = useState<TransactionStatus>(initialData?.status as TransactionStatus ?? "pending");
    const [paidCurrency, setPaidCurrency] = useState(initialData?.paidCurrency ?? convertCurrency(accountCurrency, transactType));

    const [showDropdown, setShowDropdown] = useState(false);
    const [clientQuery, setClientQuery] = useState("");
    const [clientId, setClientId] = useState<string | undefined>(
        initialData?.clientId
    );

    const {data: clients = []} = useFetchClients();

    const clientNameMap = useMemo(
        () => buildClientNameMap(clients),
        [clients]
    );
    // Réinitialise quand initialData change (mode édition)
    useEffect(() => {
        if (initialData) {
            setDescription(initialData.description);
            setAmount(String(initialData.amount));
            setPaidAmount(String(initialData.paidAmount ?? ""));
            setTransactStatus(initialData.status as TransactionStatus ?? "pending");
            setPaidCurrency(initialData.paidCurrency ?? "");
            setTransactType(initialData.type);
            setClientQuery(getClientName(clientNameMap, initialData.clientId) ?? "");
        }
    }, [initialData, clients, clientNameMap]);

    // — Filtrage « typeahead »
    const filteredClients = clients.filter((c) =>
        c.name.toLowerCase().includes(clientQuery.toLowerCase())
    );

    // Labels dynamiques
    const labelRec = transactType === "income" ? `Montant recu du client* en ${accountCurrency}` : `Montant recu du client* en ${convertCurrency(accountCurrency, transactType)}`;
    const labelPay = transactType === "outcome" ? `Montant envoyer au client en ${accountCurrency}*` : `Montant payer au client en ${convertCurrency(accountCurrency, transactType)}`;
    const montantLabel = transactType === "outcome" ? labelPay : labelRec;
    const clientAmountLabel = transactType === "outcome" ? labelRec : labelPay;

    // Calculs “à la volée”
    const m = parseFloat(amount) || 0;
    const commission =
        transactType === "income" && accountCurrency !== "RUB"
            ? parseFloat(countCommission(m))
            : 0;
    const clientAmountCom = transactType === "income" ? String(m - commission) : String(m);

    const [newCom, setNewCom] = useState(commission.toString());
    const [clientAmount, setClientAmount] = useState(clientAmountCom);

    const breakDown = transactType === "income" && m > 0 && accountCurrency !== "RUB" && !initialData;
    const adminBreakDown = initialData && isAdmin;
    const commissionAndClientAmountBreakDown =  adminBreakDown && accountCurrency !== "RUB" && transactType === "income";

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
        const data = TransactionFormSchema.parse({
            description,
            amount: parseFloat(amount),
            commission: adminBreakDown ? fixeAmount(parseFloat(newCom)) || 0 : fixeAmount(commission),
            clientAmount: adminBreakDown ? fixeAmount(parseFloat(clientAmount)) : fixeAmount(parseFloat(clientAmountCom)),
            paidAmount: fixeAmount(parseFloat(paidAmount)) || 0,
            paidCurrency,
            type: transactType,
            status: transactStatus
        });

        // On délègue tout à onSubmit (assumé renvoyer Promise)
        onSubmit({...data, clientId});
        // Ferme le modal
        closeModal();
        setDescription("");
        setAmount("");
        setPaidAmount("")
        setPaidCurrency("");
        setTransactType("income");
        setTransactStatus("pending");
        setClientQuery("")
    };

    return (
        <>
            <button className={buttonClassName ? buttonClassName : "btn btn-sm md:btn-md btn-primary w-full flex items-center gap-2"}
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
                    <div className="flex flex-col gap-1">
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
                        {commissionAndClientAmountBreakDown &&
                            <>
                                <TextFieldInput
                                    value={newCom}
                                    label="commission"
                                    setValue={setNewCom}
                                />

                                <TextFieldInput
                                    value={clientAmount}
                                    label={"Montant client"}
                                    setValue={setClientAmount}
                                />
                            </>
                        }

                        {breakDown && (
                            <>
                            <div className="text-gray-500 flex justify-between -mt-2 mb-2">
                                <span>
                                  commission : {commission} {accountCurrency}
                                </span>
                                <span>
                                  client : {clientAmountCom} {accountCurrency}
                                </span>
                            </div>
                            </>
                        )}

                        <TextFieldInput
                            value={paidAmount}
                            label={clientAmountLabel}
                            setValue={setPaidAmount}
                        />
                        <SelectInput<TransactionStatus>
                            value={transactStatus}
                            label="Statut de la transaction"
                            setValue={setTransactStatus}
                            options={transactStatusOptions}
                        >
                            <SquarePen/>
                        </SelectInput>

                        <TextFieldInput
                            value={description as string}
                            label="Description*"
                            setValue={setDescription}
                            helperText="Courte description de la transaction ou generer un code de référence"
                            placeholder="Ex: Remboursement frais repas"
                        />
                        {transactType === "income" && <ReferenceGenerator /> }
                        {adminBreakDown && (
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
                                    <ul className="absolute z-10 w-full max-h-40 overflow-auto bg-white border rounded">
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
                            className="btn btn-sm md:btn-md btn-primary btn-bordered rounded-xl mt-2"
                        >
                            {initialData ? "Enregistrer les modifications" : "Créer une transaction"}
                        </button>
                    </div>
                </div>
            </dialog>
        </>
    );
}

