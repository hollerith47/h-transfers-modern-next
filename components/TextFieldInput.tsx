type Props = {
    children?: React.ReactNode
    value: string
    label: string
    type?: string
    setValue: (value: string) => void
};
export default function TextFieldInput({children, value, setValue, label, type}: Props) {
    return (
        <label className="input input-bordered mb-3 w-full rounded-xl">
            <div className="opacity-50">{children}</div>
            <input
                type={type ? type :"text"}
                className="grow"
                placeholder={label}
                value={value}
                required
                onChange={(e) => setValue(e.target.value)}
            />
        </label>
    );
}