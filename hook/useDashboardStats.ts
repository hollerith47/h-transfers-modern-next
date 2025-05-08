import {useMemo} from "react";
import {useFetchAccounts} from "@/hook/useAccount";
import {AccountStats, CurrencyStats, PeriodStats} from "@/types";
import {computePeriodStats} from "@/utils/dashboardUtils";

export default function UseDashboardStats() {
    const {data: accounts = []} = useFetchAccounts();
    
    return useMemo(()=>{
        const now = new Date();
        // Début de jour/semaine/mois
        const startToday  = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startYest   = new Date(startToday);
        startYest.setDate(startYest.getDate() - 1);

        const startOfWeek = new Date(startToday);
        const day = startToday.getDay() || 7; // 1=lundi ... 7=dimanche
        startOfWeek.setDate(startToday.getDate() - (day - 1));
        const startOfLastWeek = new Date(startOfWeek);
        startOfLastWeek.setDate(startOfWeek.getDate() - 7);

        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(startOfMonth);
        startOfLastMonth.setMonth(startOfMonth.getMonth() - 1);

        const currencyMap: Record<string, {
            day: PeriodStats,
            week: PeriodStats,
            month: PeriodStats
        }> = {};

        const perAccount: AccountStats[] = [];

        accounts.forEach(acct => {
            const txs = acct.transactions || [];
            const startAmt = acct.amount ?? 0;

            const dayStats   = computePeriodStats(startAmt, txs, startToday, startYest);
            const weekStats  = computePeriodStats(startAmt, txs, startOfWeek, startOfLastWeek);
            const monthStats = computePeriodStats(startAmt, txs, startOfMonth, startOfLastMonth);

            const currency = acct.currency;
            if (!currencyMap[currency]) {
                const emptyStats: PeriodStats = {
                    yesterday: 0,
                    today: 0,
                    change: 0,
                    pctChange: null,
                    income: 0,
                    outcome: 0,
                };
                currencyMap[currency] = {
                    day: { ...emptyStats },
                    week: { ...emptyStats },
                    month: { ...emptyStats },
                };
            }

            const cur = currencyMap[currency];
            // Additionne les valeurs
            (["day", "week", "month"] as const).forEach(period => {
                const stat = { day: dayStats, week: weekStats, month: monthStats }[period];
                cur[period].yesterday += stat.yesterday;
                cur[period].today += stat.today;
                cur[period].change += stat.change;
                cur[period].income += stat.income;
                cur[period].outcome += stat.outcome;
            });

            perAccount.push({
                id: acct.id,
                name: acct.name,
                currency,
                day: dayStats,
                week: weekStats,
                month: monthStats,
            });
        });

        // Finalise % changement pour chaque devise
        const currencyStats: CurrencyStats[] = Object.entries(currencyMap).map(([currency, stats]) => {
            const formatPeriod = (period: PeriodStats): PeriodStats => ({
                ...period,
                pctChange: period.yesterday === 0 ? null : (period.change / period.yesterday) * 100
            });

            return {
                currency,
                day:   formatPeriod(stats.day),
                week:  formatPeriod(stats.week),
                month: formatPeriod(stats.month),
            };
        });

        return {currencyStats, perAccount};

    }, [accounts])
}

