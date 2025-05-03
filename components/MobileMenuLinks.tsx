"use client"
import Link from "next/link";
import {usePathname} from "next/navigation";
import {links} from "@/data";

type Props = {
    setIsOpen: (open: boolean) => void;
};
export default function MobileMenuLinks({setIsOpen}: Props) {
    const pathname = usePathname();
    return (
        <div className="h-svh">
            <nav className="grid gap-1 px-2">
                {links.map(link => (
                    <Link
                        onClick={() => setIsOpen(false)}
                        href={link.href}
                        key={link.href}
                        className={pathname === link.href ? "btn btn-primary justify-start" : "btn btn-ghost justify-start"}
                    >
                        <link.icon className="mr-2 size-4"/>
                        <span>{link.label}</span>
                    </Link>
                ))}
            </nav>
        </div>
    );
}