"use client";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import {usePathname} from "next/navigation";
import UserDropDown from "@/components/ui/UserDropDown";
import {useProtectedRoute} from "@/hook/useProtectedRoute";



export default function Sidebar() {
    const pathname = usePathname();
    const { menuLinks } = useProtectedRoute()

    return (
        <div className="flex flex-col justify-between h-full gap-4 py-2">
            <div>
                <div className="flex h-14 mb-4 items-center border-b border-base-300">
                    <div className="flex items-center gap-2 font-semibold ml-5">
                        <Logo/>
                    </div>
                </div>
                <nav className="grid gap-1 px-2">
                    {menuLinks.map(link=> (
                        <Link href={link.href} key={link.href} className={ pathname === link.href ? "btn btn-primary justify-start":  "btn btn-ghost justify-start"}>
                            <link.icon className="mr-2 size-4"/>
                            <span>{link.label}</span>
                        </Link>
                    ))}
                </nav>
            </div>
            <div className="flex h-14 items-center border-t border-base-300 px-4 hover:cursor-pointer hover:bg-gray-200">
                <UserDropDown />
            </div>
        </div>
    );
}