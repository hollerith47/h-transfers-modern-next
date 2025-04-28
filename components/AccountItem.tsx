import {Account } from "@/types";
import {getTotalByType} from "@/utils/getTotalByType";

type Props = {
    account: Account
};



export default function AccountItem({account}: Props) {
    const transactionCount = account.transactions?.length || 0;
    const totalIncomeTransactions = getTotalByType(account.transactions, "income");
    const totalOutcomeTransactions = getTotalByType(account.transactions, "outcome");
    const startingAmount = account.amount ?? 0;
    const balance = startingAmount + totalIncomeTransactions - totalOutcomeTransactions;

    const totalAvailable = startingAmount + totalIncomeTransactions;
    const progressValue = totalAvailable > 0
        ? Math.min((totalOutcomeTransactions / totalAvailable) * 100, 100)
        : 0;

    console.log({totalAvailable,balance, totalOutcomeTransactions, totalIncomeTransactions ,startingAmount})


    return (
        <li key={account.id} className="p-4 border-2 border-base-300 rounded-xl list-none hover:shadow-xl hover:border-primary">
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <div className="bg-accent/20 text-xl h-10 w-10 rounded-full flex justify-center items-center">
                        {account.emoji}
                    </div>
                    <div className="flex flex-col ml-3">
                        <span className="font-bold text-lg">{account.name}</span>
                        <span className="text-gray-500 text-sm">
                            {transactionCount > 1 ? `${transactionCount} transactions` : `${transactionCount} transaction`}
                        </span>
                    </div>
                </div>
                <div className="text-lg font-bold text-primary">
                    {balance} {account.currency}
                </div>
            </div>
            <div className="flex justify-between items-center mt-5 text-gray-500">
                <span>{totalOutcomeTransactions} {account.currency} spent</span>
                {/*TODO:: reste a savoir s'il faut utiliser totalIncomeTransactions ou totalAvailable*/}
                {/*<span>{totalAvailable} {account.currency} available</span>*/}
                <span>{totalIncomeTransactions} {account.currency} entries</span>
            </div>
            <div>
                <progress className="progress progress-primary w-full" value={progressValue} max="100"></progress>
            </div>

        </li>
    );
}