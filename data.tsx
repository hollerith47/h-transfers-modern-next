import {ArrowLeftRight, BarChart, Calculator, CogIcon, HandshakeIcon, Wallet} from "lucide-react";
import {TransactionStatus} from "@/types";
import {Option} from "@/components/SelectInput";

export const links = [
    {
        href: "/",
        label: "Dashboard",
        icon: BarChart
    },
    {
        href: "/accounts",
        label: "Accounts",
        icon: Wallet
    },
    {
        href: "/admin/calculator",
        label: "Calculator",
        icon: Calculator,
    },
    {
        href: "/settings",
        label: "Settings",
        icon: CogIcon
    },
    {
        href: "/transactions",
        label: "Transactions",
        icon: ArrowLeftRight
    },
    {
        href: "/clients",
        label: "Clients",
        icon: HandshakeIcon
    }
]

export const currencyOptions = [
    { value: "USD", label: "USD - Dollar" },
    { value: "EUR", label: "EUR - Euro" },
    { value: "RUB", label: "RUB - Rouble" },
]

export const transactStatusOptions : Option<TransactionStatus>[] = [
    { value: "pending", label: "En attente" },
    { value: "completed", label: "Terminée" },
]