"use client";

import {useEffect, useMemo} from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {links, NavLink} from "@/data";
import UseUserRole from "@/hook/useUserRole";

export function useProtectedRoute() {
    const { isLoaded, isSignedIn } = useAuth();
    const router = useRouter();
    const {isAdmin } =  UseUserRole();
    const menuLinks: NavLink[] = useMemo(
        () =>
            isAdmin
                ? links
                : links.filter((link) => !link.adminOnly),
        [isAdmin]
    );

    useEffect(() => {
        if (isLoaded && !isSignedIn) {
            router.push("/sign-in");
        }
    }, [isLoaded, isSignedIn, router]);

    return { isLoaded, isSignedIn, menuLinks };
}

