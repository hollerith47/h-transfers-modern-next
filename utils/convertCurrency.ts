import { Currency, TransactionType } from "@/types";

export function convertCurrency(
    currency: string,
    type: TransactionType
): Currency {
    if (type === "income") {
        // dépôt : on convertit la devise du versement en devise de compte
        if (currency === "USD" || currency === "EUR") {
            return "RUB";
        }
        // si c'est déjà du RUB, on va le convertir en USD par convention
        return "USD";
    } else {
        // retrait : on convertit la devise de compte en devise de paiement client
        if (currency === "RUB") {
            return "USD";
        }
        // si c'est USD ou EUR, on renvoie RUB pour payer en devise locale
        return "RUB";
    }
}