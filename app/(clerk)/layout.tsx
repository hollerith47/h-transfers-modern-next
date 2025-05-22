import GuestNavbar from "@/components/layout/GuestNavbar";

export default function Layout({children}: { children: React.ReactNode }) {
    return (
        <>
            <GuestNavbar/>
            <div className="flex items-center justify-center pt-20 sm:pt-24">
                {children}
            </div>
        </>
    );
}