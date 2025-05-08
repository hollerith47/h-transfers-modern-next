import EvolutionChartItem from "@/app/(auth)/EvolutionChartItem";
import UseDashboardData from "@/hook/useDashboardData";

export default function EvolutionChartContainer() {
    const {chartUsdUsdtData,chartUsdData,chartRubData } = UseDashboardData();
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <EvolutionChartItem chartData={chartUsdUsdtData} title="Évolution USD & USDT" />
            <EvolutionChartItem chartData={chartUsdData} title="Évolution USD" />
            <EvolutionChartItem chartData={chartRubData} title="Évolution RUB" />
        </div>
    );
}