import type { ReactNode } from "react";

type Option = {
    value: string;
    label: string;
};

type Props = {
    children?: ReactNode;
    value: string;
    label: string;
    setValue: (value: string) => void;
    options: Option[];              // ← nouveau prop
};

export default function SelectInput({children, value,setValue,label,options}: Props) {
    return (
        <label className="input input-bordered mb-3 w-full rounded-xl flex items-center gap-2 focus:outline-none">
            {children && <div className="opacity-50">{children}</div>}
            <select
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="grow bg-transparent focus:outline-none"
                required
            >
                {/* placeholder désactivé */}
                <option value="" className="opacity-50" disabled>
                    {label}
                </option>

                {/* on génère maintenant les options dynamiquement */}
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </label>
    );
}
