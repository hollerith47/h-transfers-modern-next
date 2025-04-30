import type { ReactNode } from "react";

export type Option<T extends string> = {
    value: T;
    label: string;
};
type SelectInputProps<T extends string> = {
    children?: ReactNode;
    /** controlled value */
    value: T;
    /** placeholder label */
    label: string;
    /** setter, receives a T */
    setValue: (value: T) => void;
    /** array of options, with matching T */
    options: Option<T>[];
};
// type Props = {
//     children?: ReactNode;
//     value: string;
//     label: string;
//     setValue: (value: string) => void;
//     options: Option[];              // ← nouveau prop
// };

export default function SelectInput<T extends string>({children, value,setValue,label,options}: SelectInputProps<T>) {
    return (
        <label className="input input-bordered mb-3 w-full rounded-xl flex items-center gap-2 focus:outline-none">
            {children && <div className="opacity-50">{children}</div>}
            <select
                value={value}
                onChange={(e) => setValue(e.target.value as T)}
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
