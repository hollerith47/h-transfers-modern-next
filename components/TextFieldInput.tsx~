import React from 'react';

// Enhanced TextFieldInput with label above, optional placeholder and helper text

type TextFieldInputProps = {
    children?: React.ReactNode;
    value: string;
    label: string;
    type?: string;
    placeholder?: string;
    helperText?: string;
    setValue: (value: string) => void;
};

export default function TextFieldInput({children,value,label,placeholder,helperText,type = "text",setValue }: TextFieldInputProps) {
    return (
        <div className="flex flex-col w-full mb-0">
            {/* Label above input */}
            <label className="mb-1 text-sm font-medium text-gray-700">{label}</label>
            <div className="input input-bordered w-full rounded-xl flex items-center gap-2 focus-within:ring-2 focus-within:ring-primary">
                {/* Optional icon */}
                {children && <div className="opacity-50">{children}</div>}
                <input
                    type={type}
                    className="grow bg-transparent focus:outline-none"
                    placeholder={placeholder ?? label}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
            </div>
            {/* Optional helper text below input */}
            {helperText && (
                <p className="mt-1 text-xs text-muted-foreground">{helperText}</p>
            )}
        </div>
    );
}
