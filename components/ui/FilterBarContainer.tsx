"use client";
import {TransactionFilterBar, TransactionFilterBarProps} from "@/components/features/transaction/TransactionFilterBar";
import {JSX, useState} from "react";
import {Filter} from "lucide-react";

export function FilterBarContainer(props: JSX.IntrinsicAttributes & TransactionFilterBarProps) {
    const [open, setOpen] = useState(false);
    return (
        <>
            {/* Sur mobile : bouton pour ouvrir/fermer */}
            <div className="md:hidden mb-4">
                <button
                    className="btn btn-sm btn-outline w-full flex items-center justify-center gap-2"
                    onClick={() => setOpen((o) => !o)}
                >
                    <Filter className="w-5 h-5" />
                    {open ? "Masquer les filtres" : "Afficher les filtres"}
                </button>
                {open && (
                    <div className="mt-2 p-4 bg-base-200 rounded-lg">
                        <TransactionFilterBar {...props} />
                    </div>
                )}
            </div>

            {/* Sur desktop : on montre toujours la barre */}
            <div className="hidden md:block">
                <TransactionFilterBar {...props} />
            </div>
        </>
    );
}
