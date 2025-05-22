type Props = {
    children?: React.ReactNode
    value: string
    label: string
    setValue: (value: string) => void
};

export default function CurrencySelectInput({children, value, setValue, label}: Props) {
    return (
        <label className="input input-bordered mb-3 w-full rounded-xl flex items-center gap-2 focus:outline-none">
            <div className="opacity-50">{children}</div>
            <select
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="grow bg-transparent focus:outline-none"
                required
            >
                <option value="" className="opacity-50" disabled>{label}</option>
                <option value="USD">USD - Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="RUB">RUB - Rouble</option>
            </select>
        </label>
    );
}