import {Account} from "@/types";

export default function UseAccountCurrency(account:  Account) {
    const accountCurrency = account.currency;
    const oppositeCurrency = account.currency === "USD" ? "RUB" : "USD";
    const isNotRubleAccount = accountCurrency !== "RUB";

    return {accountCurrency, oppositeCurrency, isNotRubleAccount}
}