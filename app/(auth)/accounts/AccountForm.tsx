"use client";
import {useEffect, useState} from "react";
import {useUser} from "@clerk/nextjs";
import {Banknote, ListOrdered, PencilLine, Wallet, X} from "lucide-react";
import TextFieldInput from "@/components/TextFieldInput";
import EmojiPicker from "emoji-picker-react";
import {AddAccount, updateAccountData} from "@/app/actions";
import {toast} from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import SelectInput from "@/components/SelectInput";
import {currencyOptions} from "@/data";
import {z} from "zod";
import {InitialAccountData} from "@/schema";

type Props = {
    initialData?: z.infer<typeof InitialAccountData>;
    isEditable?: boolean;
}



export default function AccountForm({initialData, isEditable}: Props) {
    const {user} = useUser();
    const queryClient = useQueryClient();

    const [accountName, setAccountName] = useState( initialData?.name ?? '');
    const [accountInitialBalance, setAccountInitialBalance] = useState('');
    const [accountCurrency, setAccountCurrency] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [accountSelectedEmoji, setAccountSelectedEmoji] = useState(initialData?.emoji ?? '');
    const [accountId, setAccountId] = useState(initialData?.accountId ?? '');

    // const {mutateAsync: updateAccountInfo} = useUpdateAccount();
    const email = user?.primaryEmailAddress?.emailAddress as string;

    const isEditMode = Boolean(initialData);

    // reset form when initialData changes
    useEffect(() => {
        if (initialData) {
            setAccountName(initialData.name);
            setAccountSelectedEmoji(initialData.emoji);
            setAccountId(initialData.accountId);
        }
    }, [initialData]);

    const mutation = useMutation({
        mutationFn: async () => {
            if(isEditMode){
                return updateAccountData({accountId, name: accountName, emoji: accountSelectedEmoji, email});
            }
            return AddAccount({
                email,
                name: accountName,
                amount: parseFloat(accountInitialBalance),
                emoji: accountSelectedEmoji,
                currency: accountCurrency
            });
        },
        onSuccess: () => {
            if (isEditMode) {
                queryClient.invalidateQueries({ queryKey: ['account', accountId] });
            }else{
                queryClient.invalidateQueries({ queryKey: ['accounts', email] });
            }
            // toast.success('Account created successfully!');
            const modal = document.getElementById("my_modal_3") as HTMLDialogElement;
            if (modal) {
                modal.close();
                setAccountSelectedEmoji("");
                setAccountName("");
                setAccountInitialBalance("");
                setAccountCurrency("");
            }
        },
        onError: () => {
            toast.error('Failed to create account.');
        }
    });

    const handleSelectedEmoji = (emojiObject: { emoji: string }) => {
        setAccountSelectedEmoji(emojiObject.emoji);
        setShowEmojiPicker(false);
    }

    const handleSubmit = async () => {
        toast.promise(mutation.mutateAsync(), {
            loading: isEditMode ? 'Updating account...' : 'Creating account...',
            success: isEditMode ? 'Updated!' : 'Created!',
            error: isEditMode ? 'Update failed.' : 'Creation failed.',
        });
    };


    return (
        <>
            <button className={`btn btn-${isEditable ? "success" : "primary"} flex items-center gap-2`}
                    onClick={() => (document.getElementById('my_modal_3') as HTMLDialogElement).showModal()}>
                {isEditMode ? (<>Edit Account infos <PencilLine /></>) : (<>Create New Account <Wallet  /></>)}
            </button>
            <dialog id="my_modal_3" className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-soft btn-error absolute right-2 top-2">
                            <X/>
                        </button>
                    </form>
                    <h3 className="font-bold text-lg">{isEditMode ? 'Update Account' : 'Create New Account'}</h3>
                    <p className="py-4">
                        {isEditMode
                            ? 'Modify your account details and save.'
                            : 'Create new account and set initial balance.'
                        }
                    </p>
                    <div className="w-full flex flex-col">
                        <TextFieldInput
                            value={accountName}
                            label="Account name"
                            setValue={setAccountName}
                        >
                            <Wallet/>
                        </TextFieldInput>
                        {!isEditMode && (
                            <>
                                <TextFieldInput
                                    value={accountInitialBalance}
                                    label="Initial Balance"
                                    type="number"
                                    setValue={setAccountInitialBalance}
                                >
                                    <ListOrdered/>
                                </TextFieldInput>
                                <SelectInput
                                    value={accountCurrency}
                                    label="Select Currency"
                                    setValue={setAccountCurrency}
                                    options={currencyOptions}
                                >
                                    <Banknote/>
                                </SelectInput>
                            </>
                        )}
                        <button
                            className="btn mb-2 btn-bordered rounded-xl"
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                            {accountSelectedEmoji || "Select Emoji 🤗"}
                        </button>
                        {showEmojiPicker && (
                            <div className="flex justify-center items-center my-4">
                                <EmojiPicker onEmojiClick={handleSelectedEmoji}/>
                            </div>
                        )}

                        <button
                            onClick={handleSubmit}
                            className="btn btn-primary btn-bordered rounded-xl"
                        >
                            {isEditMode ? 'Save Changes' : 'Create'}
                        </button>
                    </div>
                </div>
            </dialog>
        </>
    );
}