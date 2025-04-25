type Props = {
    title: string;
    description: string;
    action?: React.ReactNode;
    children: React.ReactNode;
}
export default function ContentLayout({children, title, description, action}: Props) {
    return (
        <>
            <header className='mb-8 flex items-center justify-between'>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight mb-2">{title || "Title"}</h2>
                    <p className='text-muted-foreground'>{description || "Description"}</p>
                </div>
                {action || "action"}
            </header>
            {children}
        </>
    );
}