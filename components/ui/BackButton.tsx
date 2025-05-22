"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackButton() {
    const router = useRouter();

    return (
        <button
            onClick={() => router.back()}
            className="btn btn-sm md:btn-md btn-primary flex items-center gap-2"
        >
            <ArrowLeft className="w-4 h-4" />
            Back
        </button>
    );
}
