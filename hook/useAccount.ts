// import {Account} from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAccountAPI } from "@/lib/api";

export function UseAccountCurrency(accountCurrency:  string) {
    // const accountCurrency = account.currency;
    const oppositeCurrency = accountCurrency === "USD" ? "RUB" : "USD";
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
