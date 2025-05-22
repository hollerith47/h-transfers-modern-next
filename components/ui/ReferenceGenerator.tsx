"use client";
import { Copy } from "lucide-react";
import { generateRef } from "@/utils/generateRef";
import {toast} from "sonner";

export default function ReferenceGenerator() {
    const handleGenerateRef = () => {
        const ref = generateRef();
        // copie dans le presse-papier
        navigator.clipboard.writeText(ref);
        toast.success(`Référence générée : ${ref}\n\n(Copiée dans le presse-papier)`);
    };

    return (
        <button
            type="button"
            onClick={handleGenerateRef}
            className="btn btn-outline btn-sm md:btn-md rounded-xl flex items-center gap-2"
        >
            <Copy className="w-5 h-5" />
            Générer la référence
        </button>
    );
}
