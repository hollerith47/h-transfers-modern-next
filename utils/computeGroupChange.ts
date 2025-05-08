import { DashboardEntry } from "@/types";
import { startOfDay, addDays, subDays } from "date-fns";

export function computeGroupChange(entries: DashboardEntry[]) {
    const startToday    = startOfDay(new Date());
    const startTomorrow = addDays(startToday, 1);
    const startYest     = subDays(startToday, 1);

    let balanceToday     = 0;
    let balanceYesterday = 0;

    for (const { account } of entries) {
        const base = account.amount ?? 0;

        // Transactions d’aujourd’hui (00:00 → maintenant)
        const txToday = account?.transactions?.filter(tx => {
            const d = new Date(tx.createdAt);
            return d >= startToday && d < startTomorrow;
        });

        // Transactions d’hier (00:00 hier → 00:00 aujourd’hui)
        const txYest = account?.transactions?.filter(tx => {
            const d = new Date(tx.createdAt);
            return d >= startYest && d < startToday;
        });

        const incomeToday  = txToday?.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
        const outcomeToday = txToday?.filter(t => t.type === "outcome").reduce((s, t) => s + t.amount, 0);
        const balToday     = base + parseFloat(String(incomeToday)) - parseFloat(String(outcomeToday));

        const incomeYest   = txYest?.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
        const outcomeYest  = txYest?.filter(t => t.type === "outcome").reduce((s, t) => s + t.amount, 0);
        const balYest      = base + parseFloat(String(incomeYest)) - parseFloat(String(outcomeYest));

        balanceToday     += balToday;
        balanceYesterday += balYest;
    }

    const change    = balanceToday - balanceYesterday;
    const pctChange = balanceYesterday === 0 ? 0 : (change / balanceYesterday) * 100;

    return { balanceToday, balanceYesterday, change, pctChange };
}
