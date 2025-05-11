import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";

type TransactionType = "income" | "outcome";

interface Props {
    type: TransactionType;
}

export function TransactionArrow({ type }: Props) {
    return type === "income" ? (
        <ArrowUpCircle className="hidden md:block text-xs md:text-md md:w-6 md:h-6 text-green-500" />
    ) : (
        <ArrowDownCircle className="hidden md:block text-xs md:text-md md:w-6 md:h-6 text-red-500" />
    );
}

export const returnClass = (type: string) => {
    if (type === "outcome") {
        return  "badge-error";
    }else {
        return "badge-success";
    }
}
