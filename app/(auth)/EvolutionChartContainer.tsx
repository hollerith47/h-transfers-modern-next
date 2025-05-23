import EvolutionChartItem from "@/app/(auth)/EvolutionChartItem";
import UseDashboardData from "@/hook/useDashboardData";

export default function EvolutionChartContainer() {
    const { chartConfigs } = UseDashboardData();
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {chartConfigs.map(({ title, data }) => (
                <EvolutionChartItem key={title} title={title} chartData={data} />
            ))}
        </div>
    );
}