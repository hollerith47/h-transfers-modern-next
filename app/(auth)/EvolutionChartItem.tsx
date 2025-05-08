import {
    BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import {ChartPoint} from "@/types";

type Props = {
    chartData: ChartPoint[],
    title: string
}


export default function EvolutionChartItem({chartData, title}: Props) {
    return (
        <div className="w-full h-80 bg-white rounded-xl shadow-md p-4">
            <h2 className="text-lg font-semibold mb-2">{title}</h2>
            <ResponsiveContainer width="100%" height="90%">
                <BarChart data={chartData} margin={{top: 10, right: 30, left: 0, bottom: 0}}>
                    <XAxis dataKey="currency"/>
                    <YAxis/>
                    <Tooltip formatter={(value: number) => value.toFixed(2)}/>
                    <Legend verticalAlign="top" height={36}/>
                    <Bar dataKey="yesterday" name="Hier" fill="#8884d8"/>
                    <Bar dataKey="today" name="Aujourd’hui" fill="#82ca9d"/>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
        ;
}