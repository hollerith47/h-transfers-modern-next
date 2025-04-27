"use client";
import TextFieldInput from "@/components/TextFieldInput";
import {useEffect, useState} from "react";
import {Account} from "@/types";
import {ArrowLeftRight, Banknote, ListOrdered, NotebookPen, X} from "lucide-react";
import CurrencySelectInput from "@/components/CurrencySelectInput";
import SelectTransactType from "@/components/SelectTransactType";
import {countCommission} from "@/utils/countCommission";
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {createTransaction} from "@/app/actions";
import {toast} from "sonner";

type Props = {
    account: Account
};

export default function TransactionForm({account}: Props) {
    const queryClient = useQueryClient();
    const accountId = account.id;
    const accountCurrency = account.currency;
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [commission, setCommission] = useState<number>(0);
    const [clientAmount, setClientAmount] = useState<number>(0);
    const [paidAmount, setPaidAmount] = useState("");
    const [transactType, setTransactType] = useState("");
    const [paidCurrency, setPaidCurrency] = useState("");

    const mutation = useMutation({

        mutationFn: async () => {
            return createTransaction({
                description,
                amount: parseFloat(amount),
                commission,
                clientAmount,
                paidAmount: parseFloat(paidAmount),
                paidCurrency,
                type: transactType,
                accountId,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['transactions', account.id]});
            // toast.success('Transaction created successfully!');
            const modal = document.getElementById("my_modal_4") as HTMLDialogElement;
            if (modal) {
                modal.close();
                setPaidCurrency("");
                setCommission(0);
                setDescription("")
            }
        },
        onError: () => {
            // toast.error('Failed to create transaction.');
        }
    });

    const handleCreateTransaction = async () => {
        const data = {
            description,
            amount: parseFloat(amount),
            commission,
            clientAmount,
            paidAmount,
            paidCurrency,
            type: transactType,
            accountId,
        }
        toast.promise(mutation.mutateAsync(), {
            loading: 'Creating transaction...',
            success: 'Transaction created successfully!',
            error: 'Failed to create transaction.',
        });
        console.log(data)

    }

    useEffect(() => {
        if (amount && (accountCurrency === "USD" || accountCurrency === "EUR")) {
            const montant = parseFloat(amount);
            setCommission(parseFloat(countCommission(montant)));
            setPaidCurrency("RUB")
            if (commission) {
                setClientAmount(montant - commission)
            }
        }
    }, [amount, commission, clientAmount, paidAmount, paidCurrency, transactType])
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
                            onClick={handleCreateTransaction}
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