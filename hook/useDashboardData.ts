"use client";
import UseUserRole from "@/hook/useUserRole";
import {useAccountsWithStats, useTotalGroupBalance} from "@/hook/useAccount";
import {computeGroupChange} from "@/utils/computeGroupChange";
import {CardInfo, ChartPoint} from "@/types";
import {useMemo} from "react";

export default function UseDashboardData() {
    const { isAdmin } = UseUserRole();
    const {usdAccounts, rubAccounts, usdtAccounts, eurAccounts} = useAccountsWithStats();

    // 1) Compute change objects
    const usdChange  = computeGroupChange(usdAccounts);
    const rubChange  = computeGroupChange(rubAccounts);
    const eurChange  = computeGroupChange(eurAccounts);
    const usdtChange = computeGroupChange(usdtAccounts);

    // 2) Compute totals
    const usdTotal  = useTotalGroupBalance(usdAccounts);
    const rubTotal  = useTotalGroupBalance(rubAccounts);
    const eurTotal  = useTotalGroupBalance(eurAccounts);
    const usdtTotal = useTotalGroupBalance(usdtAccounts);

    // 3) cardData : tout est calculé à l’intérieur du même useMemo
    const cardData: CardInfo[] = useMemo(() => {
        const rawCards: CardInfo[] = [
            {
                label: "USD",
                value: usdTotal,
                locale: "en-US",
                pctChange: usdChange.pctChange,
                symbol: "$",
                color: "blue",
            },
            {
                label: "RUB",
                value: rubTotal,
                locale: "ru-RU",
                pctChange: rubChange.pctChange,
                symbol: "₽",
                color: "red"
            },
            {
                label: "EUR",
                value: eurTotal,
                locale: "fr-FR",
                pctChange: eurChange.pctChange,
                symbol: "€",
                color: "green"
            },
            {
                label: "USDT",
                value: usdtTotal,
                locale: "en-US",
                pctChange: usdtChange.pctChange,
                symbol: "₮",
                color: "yellow"
            },
        ];
        return isAdmin ? rawCards : rawCards.filter((c) => c.value > 0);
    }, [isAdmin, usdTotal, rubTotal, eurTotal, usdtTotal, usdChange.pctChange, rubChange.pctChange, eurChange.pctChange, usdtChange.pctChange]);

    // 4) chartData : idem, dans un useMemo séparé
    const chartUsdUsdtData: ChartPoint[] = useMemo(() => [
        { currency: "USD",  yesterday: usdChange.balanceYesterday,  today: usdChange.balanceToday },
        { currency: "USDT", yesterday: usdtChange.balanceYesterday, today: usdtChange.balanceToday },
    ], [usdChange.balanceYesterday, usdChange.balanceToday,
        usdtChange.balanceYesterday, usdtChange.balanceToday
    ]);

    const chartUsdData: ChartPoint[] = useMemo(() => [
        { currency: "USD",  yesterday: usdChange.balanceYesterday,  today: usdChange.balanceToday },
    ], [usdChange.balanceYesterday, usdChange.balanceToday]);
    const chartRubData: ChartPoint[] = useMemo(() => [
        { currency: "RUB",  yesterday: rubChange.balanceYesterday,  today: rubChange.balanceToday },
    ], [ rubChange.balanceYesterday, rubChange.balanceToday]);

    const chartEuroData: ChartPoint[] = useMemo(() => [
        { currency: "EUR",  yesterday: eurChange.balanceYesterday,  today: eurChange.balanceToday },
    ], [ eurChange.balanceYesterday, eurChange.balanceToday]);

    return { cardData, chartUsdUsdtData, chartRubData, chartEuroData, chartUsdData };
}