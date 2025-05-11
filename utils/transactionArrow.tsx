import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";

type TransactionType = "income" | "outcome";

interface Props {
    type: TransactionType;
}

export function TransactionArrow({ type }: Props) {
    return type === "income" ? (
        <ArrowUpCircle className="hidden md:block size-4  text-green-500" />
    ) : (
        <ArrowDownCircle className="hidden md:block size-4 md:text-sm text-red-500" />
    );
}

export const returnClass = (type: string) => {
    if (type === "outcome") {
        return  "badge-error";
    }else {
        return "badge-success";
    }
}
