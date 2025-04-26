"use client";
import {useState} from "react";
import {useUser} from "@clerk/nextjs";
import {Banknote, ListOrdered, Wallet, X} from "lucide-react";
import TextFieldInput from "@/components/TextFieldInput";
import CurrencySelectInput from "@/components/CurrencySelectInput";
import EmojiPicker from "emoji-picker-react";
import {AddAccount} from "@/app/actions";
import {toast} from 'sonner';

export default function AccountForm() {
    const {user} = useUser();
    const [accountName, setAccountName] = useState('');
    const [accountInitialBalance, setAccountInitialBalance] = useState('');
    const [accountCurrency, setAccountCurrency] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [accountSelectedEmoji, setAccountSelectedEmoji] = useState('');

    const handleSelectedEmoji = (emojiObject: { emoji: string }) => {
        setAccountSelectedEmoji(emojiObject.emoji);
        setShowEmojiPicker(false);
    }


    const handleCreateAccount = async () => {
        try {
            await toast.promise(
                AddAccount({
                    email: user?.primaryEmailAddress?.emailAddress as string,
                    name: accountName,
                    amount: parseFloat(accountInitialBalance),
                    emoji: accountSelectedEmoji,
                    currency: accountCurrency
                }),
                {
                    loading: 'Creating account...',
                    success: 'Account created successfully!',
                    error: 'Failed to create account.',
                }
            );
            const modal = document.getElementById("my_modal_3") as HTMLDialogElement;
            if (modal) {
                modal.close();
                setAccountSelectedEmoji("");
                setAccountName("");
                setAccountInitialBalance("");
                setAccountCurrency("");
            }

        } catch (error) {
            console.log("error while creating account", error);
        }
    }

    return (
        <>
            <button className="btn hover:bg-primary hover:text-white"
                    onClick={() => (document.getElementById('my_modal_3') as HTMLDialogElement).showModal()}>
                Create New Account <Wallet className="text-gray-500" />
            </button>
            <dialog id="my_modal_3" className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-soft btn-error absolute right-2 top-2">
                            <X/>
                        </button>
                    </form>
                    <h3 className="font-bold text-lg">Create New Account</h3>
                    <p className="py-4">create new account and set initial balance</p>
                    <div className="w-full flex flex-col">
                        <TextFieldInput
                            value={accountName}
                            label="Account name"
                            setValue={setAccountName}
                        >
                            <Wallet/>
                        </TextFieldInput>
                        <TextFieldInput
                            value={accountInitialBalance}
                            label="Initial Balance"
                            type="number"
                            setValue={setAccountInitialBalance}
                        >
                            <ListOrdered/>
                        </TextFieldInput>
                        <CurrencySelectInput
                            value={accountCurrency}
                            label="Select Currency"
                            setValue={setAccountCurrency}>
                            <Banknote/>
                        </CurrencySelectInput>
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
                            onClick={handleCreateAccount}
                            className="btn btn-primary btn-bordered rounded-xl"
                        >
                            Create
                        </button>
                    </div>
                </div>
            </dialog>
        </>
    );
}