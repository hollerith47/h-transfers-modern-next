// "use client";
import UseDashboardData from "@/hook/useDashboardData";
import StatCard from "@/app/(auth)/StatCard";

export default function SoldContainer() {
    const { cardData } = UseDashboardData();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {cardData.map(({label, pctChange, symbol,value,locale, color}) => (
                <StatCard
                    key={label}
                    label={label}
                    value={value}
                    pctChange={pctChange}
                    symbol={symbol}
                    locale={locale}
                    color={color}
                />
            ))}
        </div>
    );
}