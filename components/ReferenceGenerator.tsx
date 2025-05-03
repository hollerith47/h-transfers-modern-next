"use client";

import { Copy } from "lucide-react";
import { generateRef } from "@/utils/generateRef";

export default function ReferenceGenerator() {
    const handleGenerateRef = () => {
        const ref = generateRef();
        // copie dans le presse-papier
        navigator.clipboard.writeText(ref);
        // affiche un alert() natif
        alert(`Référence générée : ${ref}\n\n(Copiée dans le presse-papier)`);
    };

    return (
        <button
            type="button"
            onClick={handleGenerateRef}
            className="btn btn-outline flex items-center gap-2"
        >
            <Copy className="w-5 h-5" />
            Générer la référence
        </button>
    );
}
