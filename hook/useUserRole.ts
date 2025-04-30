"use client"
import {useUser} from "@clerk/nextjs";
import {useQuery} from "@tanstack/react-query";
import { getUserRole} from "@/app/actions";
import {useMemo} from "react";
import {UserRole} from "@/types";

export default function UseUserRole() {
    const {user} = useUser();
    let useRole: UserRole = "manager";
    const email = user?.primaryEmailAddress?.emailAddress;
    const {
        data: userData, isLoading, isError
    } = useQuery({
        queryKey: ['user-role', email],
        queryFn: async () => {
            if (!email) return [];
            try {
                return await getUserRole({email});
            } catch (error) {
                throw error;
            }
        },
        enabled: !!email
    });
    // Memoize la valeur du rôle
    const role = useMemo(() => {
        if (!isLoading && !isError && userData && "role" in userData) {
            return userData.role;
        }
        return "manager";
    }, [isLoading, isError, userData]);

    // Memoize le flag isAdmin
    const isAdmin = useMemo(() => role === "admin", [role]);
    return {useRole, isAdmin}
}