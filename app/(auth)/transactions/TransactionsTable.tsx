"use client";

import {useRouter} from "next/navigation";
import {Transaction} from "@/types";
import {usePagination} from "@/hook/usePagination";
import {formatDateString} from "@/utils/formatDate";
import {returnClass, TransactionArrow} from "@/utils/transactionArrow";
import {formatAmount} from "@/utils/formatAmount";
import {UseAccountCurrency} from "@/hook/useAccount";
import RenderStatus from "@/components/ui/RenderStatus";
import TablePagination from "@/components/features/transaction/TablePagination";

type Props = {
    transactions: Transaction[];
};

export default function TransactionsTable({transactions}: Props) {
    const router = useRouter();
    // const { isAdmin } = UseUserRole();
    const {
        page,
        setPage,
        totalPages,
        paginatedData,
        itemsPerPage,
    } = usePagination(transactions, 12);

    // console.log(transactions)

    return (
        <>
            <div className="overflow-x-auto mt-5">
                <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                    <table className="table table-pin-rows table-fixed text-xs md:text-md">
                        <thead>
                        <tr className="text-xs md:text-md">
                            <th className="w-10 md:w-12"></th>
                            <th className="w-24 md:w-auto">Date</th>
                            <th className="w-16 md:min-w-[100px] md:w-auto">Montant</th>
                            <th className="hidden md:table-cell w-24 text-center">Profit</th>
                            <th className="hidden md:table-cell w-24 text-center">
                                M. du client
                            </th>
                            <th className="w-22 md:w-auto text-center">M. Envoyé</th>
                            <th className="hidden md:table-cell w-auto text-center">Client</th>
                            <th className="w-32 md:w-auto">Statut</th>
                            <th className="hidden md:table-cell w-auto text-center">
                                Description
                            </th>
                            <th className="w-auto md:w-50 text-right">Nom Compte</th>
                        </tr>
                        </thead>
                        <tbody>
                        {paginatedData.map((tx, idx) => {
                            const {
                                oppositeCurrency,
                            } = UseAccountCurrency(tx.accountCurrency ?? "USD");
                            const date = formatDateString(tx.createdAt);
                            // console.log({date})
                            return (
                                <tr
                                    key={tx.id}
                                    onClick={() => router.push(`/manage/${tx.accountId}`)}
                                    role="button"
                                    tabIndex={0}
                                    className="hover:bg-base-300 cursor-pointer">
                                    {/* Index */}
                                    <td className="w-6">
                                        {page * itemsPerPage + idx + 1}
                                    </td>

                                    {/* Date */}
                                    {/*<td className="w-auto">{formateTime(tx.createdAt)}</td>*/}
                                    <td className="w-auto">{date}</td>

                                    {/* Montant */}
                                    <td className="w-24 md:w-auto">
                                        <div className="flex items-center gap-2">
                                            <TransactionArrow type={tx.type}/>
                                            <span
                                                className={`badge rounded-lg text-white badge-xs ${returnClass(
                                                    tx.type
                                                )} md:badge-sm`}
                                            >
                                              {formatAmount(tx.amount, tx.accountCurrency!)}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Profit + Montant client (seulement si compte non-RUB) */}
                                    {/*{isNotRubleAccount && isAdmin && (*/}
                                    <>
                                        <td className="hidden md:table-cell text-center">
                                            {formatAmount(tx.commission!, tx.accountCurrency!)}
                                        </td>
                                        <td className="hidden md:table-cell text-center">
                                            {formatAmount(tx.clientAmount, tx.accountCurrency!)}
                                        </td>
                                    </>
                                    {/*)}*/}

                                    {/* Montant payé au client */}
                                    <td className="w-auto text-center">
                                        {formatAmount(tx.paidAmount!, oppositeCurrency)}
                                    </td>

                                    {/* Client */}
                                    <td className="hidden md:table-cell truncate text-center">
                                        {tx.clientName}
                                    </td>

                                    {/* Statut */}
                                    <td className="w-32 md:w-auto">
                                        <RenderStatus status={tx.status}/>
                                    </td>

                                    {/* Description */}
                                    <td className="hidden md:table-cell truncate text-center">
                                        {tx.description}
                                    </td>

                                    {/* Nom du compte */}
                                    <td className="text-right">{tx.accountName}</td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
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
