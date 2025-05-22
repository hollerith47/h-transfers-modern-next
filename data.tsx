import {
    ArrowLeftRight,
    BarChart,
    Calculator,
    CogIcon,
    HandshakeIcon,
    NotepadTextDashed,
    Wallet,
    LucideIcon
} from "lucide-react";
import {TransactionStatus} from "@/types";
import {Option} from "@/components/ui/SelectInput";

export interface NavLink {
    href: string;
    label: string;
    icon: LucideIcon;
    adminOnly?: boolean;     // ← qui peut voir ce lien
}

export const links: NavLink[] = [
    {
        href: "/",
        label: "Dashboard",
        icon: BarChart,
        adminOnly: false
    },
    {
        href: "/accounts",
        label: "Accounts",
        icon: Wallet,
        adminOnly: false
    },
    {
        href: "/admin/calculator",
        label: "Calculator",
        icon: Calculator,
        adminOnly: true
    },

    {
        href: "/transactions",
        label: "Transactions",
        icon: ArrowLeftRight,
        adminOnly: false
    },
    {
        href: "/clients",
        label: "Clients",
        icon: HandshakeIcon,
        adminOnly: true
    },
    {
        href: "/settings",
        label: "Settings",
        icon: CogIcon,
        adminOnly: true
    },
    {
        href: "/brouillon",
        label: "Brouillon",
        icon: NotepadTextDashed,
        adminOnly: true
    }
]

export const currencyOptions = [
    {value: "USD", label: "USD - Dollar"},
    {value: "EUR", label: "EUR - Euro"},
    {value: "RUB", label: "RUB - Rouble"},
]

export const transactStatusOptions: Option<TransactionStatus>[] = [
    {value: "pending", label: "En attente"},
    {value: "completed", label: "Terminée"},
]