"use client"
import {useEffect, useState} from "react";
import {useProtectedRoute} from "@/hook/useProtectedRoute";
import Sidebar from "@/components/Sidebar";
import MobileMenuNavBar from "@/components/MobileMenuNavBar";
import MobileMenuLinks from "@/components/MobileMenuLinks";
import {useUser} from "@clerk/nextjs";
import {AddUserToDB} from "@/app/actions";

type Props = {
    children: React.ReactNode;
};
export default function AuthLayout({children}: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const { isLoaded, isSignedIn } = useProtectedRoute();
    const {user} = useUser()


    useEffect(() => {
        if (isLoaded && isSignedIn && user?.primaryEmailAddress?.emailAddress) {
            AddUserToDB({email: user.primaryEmailAddress.emailAddress});
        }
    }, [isLoaded, isSignedIn, user]);

    if (!isLoaded || !isSignedIn) return null;

    return (
        <div className="flex min-h-svh relative">
            {/* Desktop sidebar */}
            <div className="fixed inset-y-0 left-0 w-64 hidden lg:block z-30">
                <Sidebar />
            </div>

            {/* Mobile menu button */}
            <div className="fixed top-0 left-0 w-full md:hidden z-40">
                <MobileMenuNavBar isOpen={isOpen} setIsOpen={setIsOpen} />
            </div>

            {/* Mobile menu links */}
            {isOpen && (
                <div className="fixed top-16 left-0 w-full z-30 md:hidden bg-base-100">
                    <MobileMenuLinks setIsOpen={setIsOpen} />
                </div>
            )}

            {/* Main content */}
            <main className={`flex flex-1 w-full transition-all duration-200 ${
                isOpen ? 'overflow-hidden h-svh' : ''
            } lg:pl-64 pt-14 pb-2 lg:pr-4 lg:pt-2`}>
                <div className="bg-white grow p-6 mt-5 md:mt-0 lg:rounded-lg lg:p-10 lg:shadow-sm lg:ring-1 lg:ring-zinc-950/5 w-full">
                    {children}
                </div>
            </main>
        </div>
    )
}


