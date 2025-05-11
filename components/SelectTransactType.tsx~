import type { ReactNode, Dispatch, SetStateAction } from "react";
import type {z} from "zod";
import {TransactionFormSchema} from "@/schema";

type TForm = z.infer<typeof TransactionFormSchema>;

type Props = {
    children?: ReactNode
    value: TForm["type"]
    label: string
    setValue: Dispatch<SetStateAction<TForm["type"]>>
};

export default function SelectTransactType({children, value, setValue, label}: Props) {
    return (
        <label className="input input-bordered mb-3 w-full rounded-xl flex items-center gap-2 focus:outline-none">
            <div className="opacity-50">{children}</div>
            <select
                value={value}
                onChange={(e) => setValue(e.target.value as TForm["type"])}
                className="grow bg-transparent focus:outline-none"
                required
            >
                <option value="" className="opacity-50" disabled>{label}</option>
                <option value="income">Entry</option>
                <option value="outcome">Outcome</option>
            </select>
        </label>
    );
}