import UserDropDown from "@/components/ui/UserDropDown";

type Props = {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}
export default function MobileMenuNavBar({setIsOpen, isOpen}: Props) {
    return (
        <div className="navbar bg-base-100/96 shadow-sm">
            <div className="navbar-start">
                <UserDropDown position="bottom" />
            </div>
            <div className="navbar-end">
                <div>
                    <button tabIndex={0} onClick={() => setIsOpen(!isOpen)} role="button"
                            className="btn btn-ghost btn-circle">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24"
                             stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M4 6h16M4 12h16M4 18h7"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}