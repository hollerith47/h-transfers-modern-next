import {Account } from "@/types";
import {getTotalByType} from "@/utils/getTotalByType";
import {formatAmount} from "@/utils/formatAmount";
import {UseAccountCurrency} from "@/hook/useAccount";

type Props = {
    account: Account
};

export default function AccountItem({account}: Props) {
    const transactionCount = account.transactions?.length || 0;
    const totalIncomeTransactions = parseFloat(getTotalByType(account.transactions, "income"));
    const totalOutcomeTransactions = parseFloat(getTotalByType(account.transactions, "outcome"));
    const startingAmount = account.amount ?? 0;
    const rawBalance = startingAmount + totalIncomeTransactions - totalOutcomeTransactions;
    const balance = parseFloat(rawBalance.toFixed(2));

    const totalAvailable = startingAmount + totalIncomeTransactions;
    const progressValue = totalAvailable > 0
        ? Math.min((totalOutcomeTransactions / totalAvailable) * 100, 100)
        : 0;

    const {accountCurrency} = UseAccountCurrency(account.currency);

    return (
        <li key={account.id} className="p-4 border-2 border-base-300 rounded-xl list-none hover:shadow-xl hover:border-primary">
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <div className="bg-accent/20 text-xl h-10 w-10 rounded-full flex justify-center items-center">
                        {account.emoji}
                    </div>
                    <div className="flex flex-col ml-3">
                        <span className="font-bold text-md">{account.name}</span>
                        <span className="text-gray-500 text-sm">
                            {transactionCount > 1 ? `${transactionCount} transactions` : `${transactionCount} transaction`}
                        </span>
                    </div>
                </div>
                <div className="text-normal font-bold text-primary">
                  <span className="text-gray-500">solde:</span> {formatAmount(balance, accountCurrency)}
                </div>
            </div>
            <div className="flex justify-between items-center mt-5 text-gray-500">
                <span>reçu: {formatAmount(totalIncomeTransactions, accountCurrency)}</span>
                {/*TODO:: reste a savoir s'il faut utiliser totalIncomeTransactions ou totalAvailable*/}
                {/*<span>{totalAvailable} {account.currency} available</span>*/}
                <span>Sortie: {formatAmount(totalOutcomeTransactions, accountCurrency)}</span>
            </div>
            <div>
                <progress className="progress progress-primary w-full" value={progressValue} max="100"></progress>
            </div>

        </li>
    );
}