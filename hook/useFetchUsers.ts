"use client";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {useUser} from "@clerk/nextjs";
import {setUserAdmin} from "@/lib/api";


export const useFetchUsers = () => {
    const {user} = useUser();
    const email = user?.primaryEmailAddress?.emailAddress;
    return useQuery({
        queryKey: ['users', email],
        enabled: !!email,
        // staleTime: 1000 * 60 * 120,
        // gcTime: 1000 * 60 * 60, // 1 heure
        queryFn: async () => {
            const res = await fetch('/api/user', {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email}),
            });

            if (!res.ok){
                const err = await res.json();
                throw new Error(err.error || "Erreur inconnue");
            }
            const {users} = await res.json();
            return users;
        }})
}

export const usePromoteUser = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: setUserAdmin,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["users"] });
        }
    })
}