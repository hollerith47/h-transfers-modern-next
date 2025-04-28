"use client";
import TextFieldInput from "@/components/TextFieldInput";
import {useState} from "react";
import {ArrowLeftRight, Banknote, ListOrdered, NotebookPen, X} from "lucide-react";
import SelectTransactType from "@/components/SelectTransactType";
import {countCommission} from "@/utils/countCommission";
import {toast} from "sonner";
import { TransactionFormSchema} from "@/schema";
import {z} from "zod";
import {currencyOptions} from "@/data";
import SelectInput from "@/components/SelectInput";

type Props = {
    accountCurrency: string;
    onSubmit: (data: z.infer<typeof TransactionFormSchema>) => void;
};

export default function TransactionForm({ accountCurrency, onSubmit }: Props) {
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [paidAmount, setPaidAmount] = useState("");
    const [paidCurrency, setPaidCurrency] = useState("");
    const [transactType, setTransactType] = useState("income");

    const labelReception = "Montant recu du client*"
    const labelPayment = "Montant payez au client*"

    const montantLabel = transactType === "outcome" ? labelPayment : labelReception;
    const clientAmountLabel = transactType === "outcome" ? labelReception : labelPayment;
    const commission = transactType === "income" && parseFloat(countCommission(parseFloat(amount)))
    const clientAmount = amount - commission;
    const showBreakdown = transactType === "income" && amount > 0;

    const handleCreate = () => {
        try {
            // on valide via Zod
            const data = TransactionFormSchema.parse({
                description,
                amount: parseFloat(String(amount)),
                commission,
                clientAmount,
                paidAmount: parseFloat(paidAmount) || 0,
                paidCurrency,
                type: transactType,
            });
            // console.log(data)
            onSubmit(data);
            const modal = document.getElementById("my_modal_4") as HTMLDialogElement;
            if (modal) {
                modal.close();
                setTransactType("")
                setAmount("");
                // setCommission(0);
                // setClientAmount(0);
                setPaidAmount("");
                setTransactType("")
                setPaidCurrency("");
                setDescription("")
            }
        } catch (err) {
            toast.error("Error while creating transactions");
            console.log(err)
        }
    };

    return (
        <div className="mt-3">
            <button className="btn btn-primary flex items-center gap-2"
                    onClick={() => (document.getElementById('my_modal_4') as HTMLDialogElement).showModal()}>
                Create New Transaction <ArrowLeftRight/>
            </button>
            <dialog id="my_modal_4" className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-soft btn-error absolute right-2 top-2">
                            <X/>
                        </button>
                    </form>
                    <h3 className="font-bold text-lg py-4">Create New transaction</h3>
                    <div className="w-full flex flex-col ">
                        <SelectTransactType value={transactType} label="Type de transaction" setValue={setTransactType}>
                            <ArrowLeftRight/>
                        </SelectTransactType>
                        <TextFieldInput
                            value={amount} label={montantLabel}
                            setValue={setAmount}>
                            <ListOrdered/>
                        </TextFieldInput>
                        {showBreakdown &&
                            <div className="text-gray-500 flex justify-between mt-[-10px] mb-2">
                                <span>commission : {commission}{" "}{accountCurrency}</span>
                                <span>client : {clientAmount}{" "}{accountCurrency}</span>
                            </div>
                        }
                        <TextFieldInput
                            value={paidAmount} label={clientAmountLabel}
                            setValue={setPaidAmount}>
                            <ListOrdered/>
                        </TextFieldInput>
                        <SelectInput
                            value={paidCurrency}
                            label="Selectionner la divise de reception"
                            setValue={setPaidCurrency}
                            options={currencyOptions}
                        >
                            <Banknote/>
                        </SelectInput>
                        <TextFieldInput
                            value={description} label="Description*"
                            setValue={setDescription}>
                            <NotebookPen/>
                        </TextFieldInput>
                        <button
                            onClick={handleCreate}
                            className="btn btn-primary btn-bordered rounded-xl"
                        >
                            Create
                        </button>
                    </div>
                </div>
            </dialog>
        </div>
    );
}