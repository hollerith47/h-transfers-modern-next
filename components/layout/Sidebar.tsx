"use client";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import {usePathname} from "next/navigation";
import UserDropDown from "@/components/ui/UserDropDown";
import {links} from "@/data";
import {NotepadTextDashed} from "lucide-react";
import UseUserRole from "@/hook/useUserRole";



export default function Sidebar() {
    const pathname = usePathname();
    const {isAdmin} =  UseUserRole()

    return (
        <div className="flex flex-col justify-between h-full gap-4 py-2">
            <div>
                <div className="flex h-14 mb-4 items-center border-b border-base-300">
                    <div className="flex items-center gap-2 font-semibold ml-5">
                        <Logo/>
                    </div>
                </div>
                <nav className="grid gap-1 px-2">
                    {links.map(link=> (
                        <Link href={link.href} key={link.href} className={ pathname === link.href ? "btn btn-primary justify-start":  "btn btn-ghost justify-start"}>
                            <link.icon className="mr-2 size-4"/>
                            <span>{link.label}</span>
                        </Link>
                    ))}
                    {isAdmin &&
                        <Link href="/brouillon"  className={ pathname === "/brouillon"  ? "btn btn-primary justify-start":  "btn btn-ghost justify-start"}>
                            <NotepadTextDashed className="mr-2 size-4"/>
                            <span>Brouillon</span>
                        </Link>
                    }
                </nav>
            </div>
            <div className="flex h-14 items-center border-t border-base-300 px-4 hover:cursor-pointer hover:bg-gray-200">
                <UserDropDown />
            </div>
        </div>
    );
}