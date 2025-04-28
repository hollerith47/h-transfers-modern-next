"use client";
import TextFieldInput from "@/components/TextFieldInput";
import {useEffect, useState} from "react";
import {ArrowLeftRight, Banknote, ListOrdered, NotebookPen, X} from "lucide-react";
import CurrencySelectInput from "@/components/CurrencySelectInput";
import SelectTransactType from "@/components/SelectTransactType";
import {countCommission} from "@/utils/countCommission";
import {toast} from "sonner";
import { TransactionFormSchema} from "@/schema";
import {z} from "zod";

type Props = {
    accountCurrency: string;
    onSubmit: (data: z.infer<typeof TransactionFormSchema>) => void;
};

export default function TransactionForm({ accountCurrency, onSubmit }: Props) {
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [commission, setCommission] = useState<number>(0);
    const [clientAmount, setClientAmount] = useState<number>(0);
    const [paidAmount, setPaidAmount] = useState("");
    const [paidCurrency, setPaidCurrency] = useState("");
    const [transactType, setTransactType] = useState("");

    const handleCreate = () => {
        try {
            // on valide via Zod
            const data = TransactionFormSchema.parse({
                description,
                amount: parseFloat(amount),
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
                setCommission(0);
                setClientAmount(0);
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

    useEffect(() => {
        const m = parseFloat(amount) || 0;
        if ((accountCurrency === "USD" || accountCurrency === "EUR") && m > 0) {
            const comm = parseFloat(countCommission(m));
            setCommission(comm);
            setClientAmount(m - comm);
            setPaidCurrency("RUB");
        } else {
            setCommission(0);
            setClientAmount(m);
        }
    }, [amount, accountCurrency]);

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
                            value={amount} label="Montant recu*"
                            setValue={setAmount}>
                            <ListOrdered/>
                        </TextFieldInput>
                        {amount &&
                            <div className="text-gray-500 flex justify-between mt-[-10px] mb-2">
                                <span>commission : {commission}{" "}{accountCurrency}</span><span>client : {clientAmount}</span>
                            </div>
                        }
                        <TextFieldInput
                            value={paidAmount} label="Montant payez au client*"
                            setValue={setPaidAmount}>
                            <ListOrdered/>
                        </TextFieldInput>
                        <CurrencySelectInput
                            value={paidCurrency}
                            label="Select Paid currency"
                            setValue={setPaidCurrency}>
                            <Banknote/>
                        </CurrencySelectInput>
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