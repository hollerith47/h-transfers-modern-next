import Logo from "@/components/Logo";
import {Globe} from "lucide-react";
import Link from "next/link";

export default function GuestNavbar() {
    return (
        <div className="navbar bg-base-100 px-5 shadow-sm">
            <div className="flex-1">
                <Logo />
            </div>
            <div className="flex-none">
                <ul className="menu menu-horizontal px-1 mr-2 flex items-center">
                    <li>
                        <Link href={"/calculator"} className="badge badge-primary md:text-lg">Envoyer de l&apos;argent</Link>
                    </li>
                    <li>
                        <details>
                            <summary><Globe /></summary>
                            <ul className="bg-base-100 rounded-t-none">
                                <li><button>Francais</button></li>
                                <li><button>English</button></li>
                                <li><button>Русский</button></li>
                            </ul>
                        </details>
                    </li>
                </ul>
            </div>
        </div>
    );
}