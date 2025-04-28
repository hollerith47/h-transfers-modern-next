import {Transaction} from "@/types";
import {formateTime} from "@/utils/formatDate";
import {returnClass, TransactionArrow} from "@/utils/transactionArrow";

type Props = {
    transactions: Transaction[]
    devise:  string
}

const TransactionsTable = ({transactions, devise}: Props) => {

    return (
        <>
            <div className="overflow-x-auto mt-5">
                <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                    <table className="table table-pin-rows table-fixed">
                        {/* head */}
                        <thead>
                        <tr>
                            <th className="w-12 md:w-16"></th>
                            <th className="w-24 md:w-auto">Date</th>
                            <th className="w-24 md:w-auto text-center">Montant</th>
                            <th className="hidden md:table-cell w-24 text-center">Profit</th>
                            <th className="hidden md:table-cell w-24 md:w-auto text-center">Pour le client</th>
                            <th className="w-24 md:w-auto text-center">M. Paid Client</th>
                            <th className="hidden md:table-cell w-auto text-center">Client</th>
                            <th className="hidden md:table-cell w-auto text-center">Description</th>
                            <th className="w-auto md:w-50 text-center">Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {transactions.map((transaction) => (
                            <tr key={transaction.id} className="hover:bg-base-300">
                                <td>{transaction.emoji}</td>
                                <td className="w-auto">{formateTime(transaction.createdAt)}</td>
                                <td className="w-24 md:w-auto">
                                    <div className={` flex items-center gap-2`}>
                                        <TransactionArrow type={transaction.type}/>
                                        <span
                                            className={`badge text-white ${returnClass(transaction.type)} badge-sm`}>{transaction.amount}{devise}</span>
                                    </div>
                                </td>
                                <td className="hidden md:table-cell md:w-auto text-center">{transaction.commission}{devise}</td>
                                <td className="hidden md:table-cell w-auto text-center">{transaction.clientAmount}{devise}</td>
                                <td className="w-auto text-center">{transaction.paidAmount}₽</td>
                                <td className="hidden md:table-cell w-auto text-center">{transaction.clientName}</td>
                                <td className="hidden md:table-cell w-auto text-center">{transaction.description}</td>
                                <td className="">
                                    <div className="flex gap-2 justify-center">
                                        <button className="btn btn-sm btn-success">
                                            Modifier
                                        </button>
                                        <button className="btn btn-sm btn-error">
                                            Supprimer
                                        </button>
                                    </div>

                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default TransactionsTable;