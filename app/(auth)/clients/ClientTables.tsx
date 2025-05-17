"use client"
import TablePagination from "@/components/TablePagination";
import {usePagination} from "@/hook/usePagination";
import {formateTime} from "@/utils/formatDate";
import ModifyClient from "@/app/(auth)/clients/ModifyClient";
import DeleteClientBtn from "@/app/(auth)/clients/DeleteClientBtn";
import Loader from "@/components/Loader";
import {useMemo, useState} from "react";
import {useFetchClients} from "@/hook/useClient";

export default function ClientTables() {
    const {data: clients=[], isLoading, isError} = useFetchClients();
    const [searchTerm, setSearchTerm] = useState("");

    const filteredClients = useMemo(() => {
        return clients.filter((client) => {
            const nameMatch = client.name.toLowerCase().includes(searchTerm.toLowerCase());
            const emailMatch = client.email?.toLowerCase().includes(searchTerm.toLowerCase());
            const phoneMatch = client.phone?.toLowerCase().includes(searchTerm.toLowerCase());
            return nameMatch || emailMatch || phoneMatch;
        });
    }, [clients, searchTerm]);

    const {page, setPage, totalPages, paginatedData,itemsPerPage} = usePagination(filteredClients, 12);

    if (isLoading) {
        return <Loader fullScreen size="xl" />
    }

    if (isError) {
        // TODO:: faire de composant pour l'erreur
        return <div>Failed to load clients.</div>;
    }

    return (
        <>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3 mb-4">
                <input
                    type="text"
                    className="input input-sm md:input-md input-bordered w-full md:w-84"
                    placeholder="Rechercher par Name, email ou phone"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="overflow-x-auto">
                <table className="table text-xs md:text-md">
                    {/* head */}
                    <thead>
                <tr className="text-xs md:text-md">
                    <th></th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Date d&apos;enregistrement</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {paginatedData.map((client, idx)=> (
                    <tr key={client.id} className="hover:bg-base-300">
                        <th>{(page * itemsPerPage) + idx + 1}</th>
                        <td className="truncate">{client.name}</td>
                        <td>{client.email}</td>
                        <td>{client.phone}</td>
                        <td>{formateTime(client.createdAt)}</td>
                        <td>
                            <div className="flex gap-2 justify-center">
                                <ModifyClient client={client}/>
                                <DeleteClientBtn clientId={client.id} />
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