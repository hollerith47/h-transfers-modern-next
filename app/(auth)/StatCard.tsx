import {motion} from "framer-motion";
type StatCardProps = {
    label: string;
    value: number;
    pctChange: number;
    symbol?: string;
    color?: string;
    locale?: string;
};

export default function StatCard({ label, value, pctChange,locale, symbol = "", color = "blue" }: StatCardProps) {
    const isUp = pctChange >= 0;

    const textColor = isUp ? "text-green-600" : "text-red-600";
    const bgColor =
        color === "blue" ? "bg-blue-100"
            : color === "yellow" ? "bg-yellow-100"
                : color === "red" ? "bg-red-100"
                    : color === "green" ? "bg-green-100"
                        : "bg-gray-100";

    return (
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className={`rounded-xl p-4 shadow-md ${bgColor}`}>
            <div className="text-xs font-semibold text-gray-600">{label}</div>
            <div className="text-2xl font-bold">{symbol} {value.toLocaleString(locale ? locale : "fr-FR", { maximumFractionDigits: 2 })}</div>
            <div className={`text-sm ${textColor} mt-1 flex items-center gap-1`}>
                {isUp ? "▲" : "▼"} {Math.abs(pctChange).toFixed(1)} %
            </div>
        </motion.div>
    );
}
