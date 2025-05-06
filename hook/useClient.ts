import {useQuery} from "@tanstack/react-query";
import {ClientResponse} from "@/types";
import {getClients} from "@/app/actions";
import {useUser} from "@clerk/nextjs";

export function useFetchClients(){
    const {user} = useUser();
    const email = user?.primaryEmailAddress?.emailAddress;
    return  useQuery<ClientResponse[], Error>({
        queryKey: ['clients', email],
        queryFn: async () => {
            if (!email) return [];
            try {
                return await getClients();
            } catch (error) {
                console.error("error while fetching accounts", error);
                throw error;
            }
        },
        enabled: !!email, // Important pour éviter un appel sans email
    });
}