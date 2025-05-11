import {ReactNode} from "react";


type Props = {
    title: string;
    description: string;
    action?: ReactNode;
    children: ReactNode;
}
export default function ContentLayout({children, title, description, action}: Props) {
    return (
        <>
            <header
                className='mb-8 flex items-center justify-between bg-white mt-[-25px] '
            >
                <div>
                    <h2 className="text-lg md:text-2xl font-bold tracking-tight mb-2">{title || "Title"}</h2>
                    <p className='text-sm md:text-lg text-muted-foreground'>{description || "Description"}</p>
                </div>
                {action}
            </header>
            {children}
        </>
    );
}