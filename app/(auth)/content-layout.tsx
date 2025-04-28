import {JSX, ReactNode} from "react";


type Props = {
    title: string;
    description: string;
    action?: ReactNode | JSX.Element | undefined;
    children: ReactNode;
}
export default function ContentLayout({children, title, description, action}: Props) {
    // const HEADER_HEIGHT = 100
    return (
        <>
            {/*sticky top-0 left-0 right-0 z-30*/}
            <header
                className='mb-8 flex items-center justify-between bg-white mt-[-25px] '
                // style={{height: `${HEADER_HEIGHT}px`}}
            >
                <div>
                    <h2 className="text-2xl font-bold tracking-tight mb-2">{title || "Title"}</h2>
                    <p className='text-muted-foreground'>{description || "Description"}</p>
                </div>
                {action }
            </header>
                {children}
        </>
    );
}