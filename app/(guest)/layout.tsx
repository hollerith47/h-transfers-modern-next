import GuestNavbar from "@/components/layout/GuestNavbar";
import Footer from "@/components/layout/Footer";

export default function GuestLayout({children}: {children: React.ReactNode}) {
    return (
        <div>
            <GuestNavbar />
            <div className="min-h-[57vh]" id="top">
                {children}
            </div>
            <div>
                <Footer />
            </div>
        </div>
    );
}