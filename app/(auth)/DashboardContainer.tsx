"use client";
import SoldContainer from "@/app/(auth)/SoldContainer";
import EvolutionChartContainer from "@/app/(auth)/EvolutionChartContainer";
import UseDashboardData from "@/hook/useDashboardData";

export default function DashboardContainer() {
    const { cardData, chartConfigs } = UseDashboardData();

    return (
        <div className="space-y-8">
            {cardData && chartConfigs ?
                (
                    <>
                        <SoldContainer />
                        <EvolutionChartContainer />
                    </>
                )
                :
                (
                    <>
                        <h2>HELLO</h2>
                    </>
                )
            }

        </div>
    );
}