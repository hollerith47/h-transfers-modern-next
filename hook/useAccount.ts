import {Account} from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAccountAPI } from "@/lib/api";

export function UseAccountCurrency(account:  Account) {
    const accountCurrency = account.currency;
    const oppositeCurrency = account.currency === "USD" ? "RUB" : "USD";
    const isNotRubleAccount = accountCurrency !== "RUB";

    return {accountCurrency, oppositeCurrency, isNotRubleAccount}
}



export function useDeleteAccount() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: deleteAccountAPI,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["accounts"] });
        }
    })
}
