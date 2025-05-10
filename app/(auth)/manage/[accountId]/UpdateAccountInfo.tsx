import {Account} from "@/types";
import AccountForm from "@/app/(auth)/accounts/AccountForm";

type Props = {
    account: Account;
};

export default function UpdateAccountInfo({account}: Props) {
    return (
        <AccountForm
            isEditable
            initialData={{
                accountId: account.id,
                name: account.name,
                emoji: account.emoji ?? '',
            }}/>
    );
}