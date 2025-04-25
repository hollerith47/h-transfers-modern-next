import Image from "next/image";
import {ChevronUp, CircleUserRound, LogOut} from "lucide-react";
import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";

export default function UserDropDown({position}: { position: "top" | "bottom" }) {
    const pathname = usePathname();
    const router = useRouter();

    function handleLogOut(){
        router.push("/landing")
    }

    return (
        <div className={`dropdown dropdown-${position} dropdown-end grid gap-1`}>
            <div tabIndex={0} className="flex items-center justify-start">
                <div role="button" className="avatar">
                    <div className="w-12 rounded-full">
                        <Image
                            src="/logo.png"
                            alt={"avatar"}
                            width={60}
                            height={60}
                        />
                    </div>
                </div>
                <div>
                    <p className="text-xs">
                        <strong className="block font-medium">Herman Makiese</strong>
                        <span> hermanhmakiese@gmail.com </span>
                    </p>
                </div>
                <ChevronUp className="size-4 ml-2 text-zinc-500"/>
            </div>

            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                <Link href="/profile"
                      className={pathname === "/profile" ? "btn btn-primary justify-start" : "btn btn-ghost justify-start"}>
                    <CircleUserRound className="mr-2 size-4"/>
                    <span>Profile</span>
                </Link>
                <button onClick={handleLogOut} className="btn btn-ghost justify-start"><LogOut/><span>Log out</span></button>
            </ul>
        </div>
    );
}