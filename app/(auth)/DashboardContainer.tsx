"use client";
import SoldContainer from "@/app/(auth)/SoldContainer";
import EvolutionChartContainer from "@/app/(auth)/EvolutionChartContainer";

export default function DashboardContainer() {

    return (
        <div className="space-y-8">
            <SoldContainer />
            <EvolutionChartContainer />
        </div>
    );
}