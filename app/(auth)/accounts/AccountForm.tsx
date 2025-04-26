"use client";
import { useState} from "react";
import {useUser} from "@clerk/nextjs";
import {Banknote, ListOrdered, Wallet, X} from "lucide-react";
import TextFieldInput from "@/components/TextFieldInput";
import CurrencySelectInput from "@/components/CurrencySelectInput";
import EmojiPicker from "emoji-picker-react";
import {AddAccount} from "@/app/actions";
import { toast } from 'sonner';
import Notification from "@/components/Notification";

export default function AccountForm() {
    const {user} = useUser();
    const [accountName, setAccountName] = useState('');
    const [accountInitialBalance, setAccountInitialBalance] = useState('');
    const [accountCurrency, setAccountCurrency] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [accountSelectedEmoji, setAccountSelectedEmoji] = useState('');
    const [notificationMessage, setNotificationMessage] = useState("");

    const handleSelectedEmoji = (emojiObject: { emoji: string }) => {
        setAccountSelectedEmoji(emojiObject.emoji);
        setShowEmojiPicker(false);
    }

    const handleCloseNotification =() => {
        setNotificationMessage("")
    }

    const handleCreateAccount = async () => {
        const amount = parseFloat(accountInitialBalance);
        if (isNaN(amount) || amount <= 0) {
            toast.error('Invalid amount');
            return;
        }
        try {
            await toast.promise(
                AddAccount(
                    user?.primaryEmailAddress?.emailAddress as string,
                    accountName,
                    amount,
                    accountSelectedEmoji,
                    accountCurrency
                ),
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
            setNotificationMessage("Account created successfully")

        } catch (error) {
            console.log("error while creating account", error);
        }
    }

    return (
        <>
            {notificationMessage && (
                <Notification message={notificationMessage} onClose={handleCloseNotification} />
            )}
            <button className="btn"
                    onClick={() => (document.getElementById('my_modal_3') as HTMLDialogElement).showModal()}>
                Create New Account
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