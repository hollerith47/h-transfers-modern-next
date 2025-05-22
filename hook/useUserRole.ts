"use client"
import {useUser} from "@clerk/nextjs";
import {useQuery} from "@tanstack/react-query";
import {useMemo} from "react";
import {UserRole} from "@/types";
import {fetchUserRole} from "@/lib/api";

export default function UseUserRole() {
    const {user} = useUser();
    const useRole: UserRole = "manager";
    const email = user?.primaryEmailAddress?.emailAddress;
    const {
        data: userData, isLoading, isError
    } = useQuery({
        queryKey: ['user-role', email],
        queryFn: async () => {
            if (!email) return [];
            try {
                return await fetchUserRole(email);
            } catch (error) {
                throw error;
            }
        },
        staleTime: Infinity,
        gcTime: 1000 * 60 * 60, // 1 heure
        enabled: !!email
    });
    // Memoize la valeur du rôle
    const role = useMemo(() => {
        if (!isLoading && !isError && userData && "role" in userData) {
            return userData.role;
        }
        return "manager";
    }, [isLoading, isError, userData]);

    const currentUserId = useMemo(() => {
        if (!isLoading && !isError && userData && "id" in userData) {
            return userData.id;
        }
        return "";
    }, [isLoading, isError, userData]);
    // Memoize le flag isAdmin
    const isAdmin = useMemo(() => role === "admin", [role]);
    return {useRole, isAdmin, currentUserId};
}