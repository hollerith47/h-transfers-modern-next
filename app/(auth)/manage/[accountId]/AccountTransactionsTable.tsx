"use client";
import {Account, Transaction} from "@/types";
import {formateTime} from "@/utils/formatDate";
import {returnClass, TransactionArrow} from "@/utils/transactionArrow";
// import TablePagination from "@/components/TablePagination";
import {usePagination} from "@/hook/usePagination";
import ModifyTransaction from "@/app/(auth)/manage/[accountId]/ModifyTransaction";
import {useMemo} from "react";
import {buildClientNameMap, getClientName} from "@/utils/ClientUtils";
import {formatAmount} from "@/utils/formatAmount";
import UseUserRole from "@/hook/useUserRole";
// import RenderStatus from "@/components/RenderStatus";
import {UseAccountCurrency} from "@/hook/useAccount";
import DeleteTransactionButton from "@/app/(auth)/manage/[accountId]/DeleteTransactionButton";
import {toast} from "sonner";
import {useFetchClients} from "@/hook/useClient";
import TablePagination from "@/components/features/transaction/TablePagination";
import RenderStatus from "@/components/ui/RenderStatus";

type Props = {
    transactions: Transaction[]
    account: Account
}

const AccountTransactionsTable = ({transactions, account}: Props) => {
    const {isAdmin} = UseUserRole();
    const {page, setPage, totalPages, paginatedData, itemsPerPage} = usePagination(transactions, 8);

    const {data: clients = []} = useFetchClients();

    const clientNameMap = useMemo(
        () => buildClientNameMap(clients),
        [clients]
    );

    const {accountCurrency, oppositeCurrency, isNotRubleAccount} = UseAccountCurrency(account.currency);

    const copyReference = (text: string) => {
        navigator.clipboard
            .writeText(text)
            .then(() => toast.success("Référence copié : " + text))
            .catch(() => toast.error("Échec de la copie"));
    };

    return (
        <>
            <div className="overflow-x-auto mt-5">
                <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                    <table className="table table-pin-rows table-fixed text-xs md:text-md">
                        {/* head */}
                        <thead>
                        <tr className="text-xs md:text-md">
                            <th className="w-10 md:w-12"></th>
                            <th className="w-24 md:w-auto">Date</th>
                            <th className="w-16 md:min-w-[100px] md:w-auto">Montant</th>
                            {isNotRubleAccount &&
                                <>
                                    <th className="hidden md:table-cell w-24 text-center">Profit</th>
                                    <th className="hidden md:table-cell w-24 md:w-auto text-center">M. du client</th>
                                </>

                            }
                            {isAdmin && (
                                <>
                                    <th className="w-22 md:w-auto text-center">
                                        {isNotRubleAccount ? "M. Payer" : "M. Envoyer"}
                                    </th>
                                    <th className="hidden md:table-cell w-auto text-center">Client</th>
                                </>
                            )}

                            <th className="w-32 md:w-auto">status</th>
                            <th className="hidden md:table-cell w-auto text-center">Description</th>
                            <th className="w-auto md:w-50 text-center">Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {paginatedData.map((transaction, idx) => {
                            // on récupère le nom, ou chaîne vide si clientId undefined/null
                            const name = getClientName(clientNameMap, transaction.clientId);

                            return (
                                <tr key={transaction.id} className="hover:bg-base-300">
                                    <td className="w-6 text-xs md:text-md">
                                        {page * itemsPerPage + idx + 1}
                                    </td>
                                    <td className="w-auto text-xs md:text-md">
                                        {formateTime(transaction.createdAt)}
                                    </td>
                                    <td className="w-24 md:w-auto ">
                                        <div className="flex items-center gap-2 text-xs md:text-md">
                                            <TransactionArrow type={transaction.type}/>
                                            <span
                                                // className={`badge text-white badge-xs ${returnClass(transaction.type)} md:badge-sm`}
                                                className={`badge rounded-lg text-white badge-xs ${returnClass(transaction.type)} md:badge-sm`}
                                            >{formatAmount(transaction.amount, accountCurrency)}
                                            </span>
                                        </div>
                                    </td>

                                    {isNotRubleAccount && isAdmin &&
                                        <>
                                            <td className="hidden text-md md:table-cell md:w-auto text-center text-xs md:text-md">
                                                {formatAmount(transaction.commission!, accountCurrency)}
                                            </td>
                                            <td className="hidden text-xs md:table-cell w-auto text-center">
                                                {formatAmount(transaction.clientAmount, accountCurrency)}
                                            </td>
                                        </>
                                    }

                                    {isAdmin &&
                                        (<>
                                            <td className="w-auto text-xs md:text-md text-center md:text-md">
                                                {formatAmount(transaction.paidAmount!, oppositeCurrency)}
                                            </td>
                                            <td className="hidden truncate md:table-cell w-auto text-center text-xs md:text-md">
                                                {name}
                                            </td>
                                        </>)
                                    }
                                    <td className="w-32 md:w-auto text-xs md:text-md"><RenderStatus status={transaction.status}/></td>

                                    <td
                                        onClick={()=>copyReference(transaction.description)}
                                        role="button"
                                        className="hidden md:table-cell w-auto text-xs md:text-md truncate text-center cursor-pointer z-50"
                                        title="copier la description ou la reference"
                                    >
                                        <button className="btn btn-xs hover:btn-primary truncate w-auto">
                                            {transaction.description}
                                        </button>
                                    </td>
                                    <td>
                                        <div className="flex gap-2 justify-center">
                                            <ModifyTransaction transaction={transaction} account={account}/>
                                            {isAdmin &&
                                                <DeleteTransactionButton transactionId={transaction.id} accountId={account.id} />
                                            }
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

export default AccountTransactionsTable;