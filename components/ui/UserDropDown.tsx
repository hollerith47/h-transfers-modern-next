import Image from "next/image";
import {ChevronUp, CircleUserRound, LogOut} from "lucide-react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {SignOutButton, useUser} from "@clerk/nextjs";

type Props = {
    position?: "top" | "bottom"
}

export default function UserDropDown({position}: Props) {
    const pathname = usePathname();
    const {user} = useUser();

    return (
        <div className={`dropdown ${position ? "dropdown-" + position : "dropdown-top"} dropdown-end grid gap-1`}>
            <div tabIndex={0} className="flex items-center justify-start">
                <div role="button" className="avatar">
                    <div className="w-10 rounded-full">
                        <Image
                            src={user?.imageUrl || "/logo.png"}
                            alt={user?.fullName || "user profile"}
                            width={40}
                            height={40}
                        />
                    </div>
                </div>
                <div className="ml-2">
                    <p className="text-xs">
                        <strong className="block font-medium">{user?.fullName}</strong>
                        <span>{user?.emailAddresses[0].emailAddress}</span>
                    </p>
                </div>
                <ChevronUp className="size-4 ml-2 text-zinc-500"/>
            </div>

            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                <Link href="/profile"
                      className={pathname === "/profile" ? "btn btn-sm md:btn-md btn-primary justify-start" : "btn btn-sm md:btn-md btn-ghost justify-start"}>
                    <CircleUserRound className="mr-2 size-4"/>
                    <span>Profile</span>
                </Link>
                <SignOutButton redirectUrl="/landing">
                    <button className="btn btn-sm md:btn-md btn-ghost justify-start">
                        <LogOut/><span>Log out</span>
                    </button>
                </SignOutButton>
            </ul>
        </div>
    );
}