"use client";
import SoldContainer from "@/app/(auth)/SoldContainer";
import EvolutionChartContainer from "@/app/(auth)/EvolutionChartContainer";

export default function DashboardContainer() {

    return (
        <div className="p-6 space-y-8">
            <SoldContainer />
            <EvolutionChartContainer />
        </div>
    );
}