"use client"
import {useUser} from "@clerk/nextjs";
import {useQuery} from "@tanstack/react-query";
import { getClients} from "@/app/actions";
import {Client} from "@/types";
import TablePagination from "@/components/TablePagination";
import {usePagination} from "@/hook/usePagination";
import {formateTime} from "@/utils/formatDate";
import ModifyTransaction from "@/app/(auth)/manage/[accountId]/ModifyTransaction";

export default function ClientTables() {
    const {user} = useUser();
    const email = user?.primaryEmailAddress?.emailAddress;

    const {data: clients=  [], isLoading, isError} = useQuery<Client[], Error>({
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

    const {page, setPage, totalPages, paginatedData,itemsPerPage} = usePagination(clients, 5);

    if (isLoading) {
        // TODO:: faire de composant pour loader pour le chargement
        return <div>Loading clients...</div>;
    }

    if (isError) {
        // TODO:: faire de composant pour l'erreur
        return <div>Failed to load clients.</div>;
    }
    console.log(clients);
    return (
        <>
        <div className="overflow-x-auto">
            <table className="table">
                {/* head */}
                <thead>
                <tr>
                    <th></th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Date d'enregistrement</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {paginatedData.map((client, idx)=> (
                    <tr key={client.id} className="hover:bg-base-300">
                        <th>{(page * itemsPerPage) + idx + 1}</th>
                        <td>{client.name}</td>
                        <td>{client.email}</td>
                        <td>{client.phone}</td>
                        <td>{formateTime(client.createdAt)}</td>
                        <td>
                            <div className="flex gap-2 justify-center">
                                <ModifyTransaction />
                                <button className="btn btn-xs md:btn-sm btn-error">
                                    Supprimer
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
            {totalPages > 1 && (
                <TablePagination
                    page={page}
                    setPage={setPage}
                    totalPages={totalPages}
                />
            )}
        </>
    );
}