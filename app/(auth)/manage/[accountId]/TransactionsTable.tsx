"use client";
import {Account, ClientResponse, Transaction} from "@/types";
import {formateTime} from "@/utils/formatDate";
import {returnClass, TransactionArrow} from "@/utils/transactionArrow";
import TablePagination from "@/components/TablePagination";
import {usePagination} from "@/hook/usePagination";
import ModifyTransaction from "@/app/(auth)/manage/[accountId]/ModifyTransaction";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {DeleteTransaction, getClients} from "@/app/actions";
import {useUser} from "@clerk/nextjs";
import {useMemo} from "react";
import {buildClientNameMap, getClientName} from "@/utils/ClientUtils";
import {z} from "zod";
import { DeleteTransactionSchema} from "@/schema";
import {toast} from "sonner";

type Props = {
    transactions: Transaction[]
    devise: string,
    account: Account
}

const TransactionsTable = ({transactions, devise, account}: Props) => {
    const {user} = useUser();
    const email = user?.primaryEmailAddress?.emailAddress;
    const queryClient = useQueryClient();
    const {page, setPage, totalPages, paginatedData, itemsPerPage} = usePagination(transactions, 5);

    const {data: clients = []} = useQuery<ClientResponse[], Error>({
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
        enabled: !!email, // Important pour éviter un appel sans initialData
    });
    const clientNameMap = useMemo(
        () => buildClientNameMap(clients),
        [clients]
    );


    const deleteTransactionMutation = useMutation(
        {
            mutationFn: async(data: z.infer<typeof DeleteTransactionSchema>) => DeleteTransaction(data),
            onSuccess: () => {
                queryClient.invalidateQueries({queryKey: ["account", account.id]});
            },
        }
    );

    const handleDeleteTransaction = async (transactionId: string) => {
        const confirmDelete = confirm('Are you sure you want to delete this transaction?');
        if (confirmDelete) {
            return toast.promise(
                deleteTransactionMutation.mutateAsync({transactionId}),
                {
                    loading: "Transaction deleting...",
                    success: "Transaction deleted successfully!",
                    error: (error)=> error instanceof Error ? error.message : "Failed to delete transaction."
                }
            );
        }
    }

    return (
        <>
            <div className="overflow-x-auto mt-5">
                <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                    <table className="table table-pin-rows table-fixed">
                        {/* head */}
                        <thead>
                        <tr>
                            <th className="w-10 md:w-12"></th>
                            <th className="w-24 md:w-auto">Date</th>
                            <th className="w-16 md:w-auto text-center">Montant</th>
                            <th className="hidden md:table-cell w-24 text-center">Profit</th>
                            <th className="hidden md:table-cell w-24 md:w-auto text-center">Pour le client</th>
                            <th className="w-22 md:w-auto text-center">M. Paid Client</th>
                            <th className="hidden md:table-cell w-auto text-center">Client</th>
                            <th className="hidden md:table-cell w-auto text-center">Description</th>
                            <th className="w-auto md:w-50 text-center">Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {paginatedData.map((transaction, idx) => {
                            // on récupère le nom, ou chaîne vide si clientId undefined/null
                            const name = getClientName(clientNameMap, transaction.clientId);
                            // console.log(name)

                            return (
                                <tr key={transaction.id} className="hover:bg-base-300">
                                    <td className="w-6">
                                        {page * itemsPerPage + idx + 1}
                                    </td>
                                    <td className="w-auto">
                                        {formateTime(transaction.createdAt)}
                                    </td>
                                    <td className="w-24 md:w-auto">
                                        <div className="flex items-center gap-2">
                                            <TransactionArrow type={transaction.type}/>
                                            <span
                                                className={`badge text-white ${returnClass(transaction.type)} badge-sm`}
                                            >
                                      {transaction.amount}{devise}
                                    </span>
                                        </div>
                                    </td>
                                    <td className="hidden md:table-cell md:w-auto text-center">
                                        {transaction.commission}{devise}
                                    </td>
                                    <td className="hidden md:table-cell w-auto text-center">
                                        {transaction.clientAmount}{devise}
                                    </td>
                                    <td className="w-auto text-center">
                                        {transaction.paidAmount}₽
                                    </td>
                                    <td className="hidden md:table-cell w-auto text-center">
                                        {name}
                                    </td>
                                    <td className="hidden md:table-cell w-auto text-center">
                                        {transaction.description}
                                    </td>
                                    <td>
                                        <div className="flex gap-2 justify-center">
                                            <ModifyTransaction transaction={transaction} account={account}/>
                                            <button
                                                onClick={() => handleDeleteTransaction(transaction.id)}
                                                className="btn btn-xs md:btn-sm btn-error">
                                                Supprimer
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
            {/*Pagination*/}
            {totalPages > 1 && (
                <TablePagination
                    page={page}
                    setPage={setPage}
                    totalPages={totalPages}
                />
            )}
        </>
    );
};

export default TransactionsTable;