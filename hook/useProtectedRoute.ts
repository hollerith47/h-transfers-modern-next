"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export function useProtectedRoute() {
    const { isLoaded, isSignedIn } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isLoaded && !isSignedIn) {
            router.push("/sign-in");
        }
    }, [isLoaded, isSignedIn, router]);

    return { isLoaded, isSignedIn };
}
