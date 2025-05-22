import GuestNavbar from "@/components/layout/GuestNavbar";
import Footer from "@/components/layout/Footer";

export default function Layout({children}: { children: React.ReactNode }) {
    return (
        <>
            <GuestNavbar/>
            <div className="min-h-[57vh] flex items-center justify-center pt-20 mb-24">
                {children}
            </div>
            <div>
                <Footer />
            </div>
        </>
    );
}