"use client";
import SoldContainer from "@/app/(auth)/SoldContainer";
import EvolutionChartContainer from "@/app/(auth)/EvolutionChartContainer";
import UseDashboardData from "@/hook/useDashboardData";
import Loader from "@/components/ui/Loader";

export default function DashboardContainer() {
    const {isLoading} = UseDashboardData();

    return (
        <>
            {isLoading ?
                (
                    <Loader fullScreen />
                ): (
                <div className="space-y-8">
                    <SoldContainer/>
                    <EvolutionChartContainer/>
                </div>
                )
            }

        </>
    );
}