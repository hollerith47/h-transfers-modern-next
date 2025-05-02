import React from "react";
import type { TransactionStatus } from "@/types";

type Props = {
    status: TransactionStatus;
};

const statusLabels: Record<TransactionStatus, string> = {
    pending:   "Encours",
    completed: "Terminée",
};

const statusClasses: Record<TransactionStatus, string> = {
    pending:   "text-red-600 font-semibold",
    completed: "text-green-600 font-semibold",
};
export default function RenderStatus({ status }: Props) {
    return (
        <span className={statusClasses[status]}>
      {statusLabels[status]}
    </span>
    );
}