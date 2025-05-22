import LoadingThreeDots from "@/components/ui/LoadingThreeDots";
type LoaderProps = {
    /** plein écran (overlay) */
    fullScreen?: boolean;
    /** couleur via classe DaisyUI/Tailwind */
    colorClass?: string;
};

export default function Loader({fullScreen = false, colorClass = "text-primary"}: LoaderProps) {

    const containerClass = fullScreen
        ? "fixed inset-0 flex items-center justify-center bg-base-100/50 z-50"
        : "flex items-center justify-center";

    return (
        <div className={containerClass}>
            <div className={[
                "loading",
                "loading-dots",
                "w-12 h-12 md:w-16 md:h-16 lg:w-24 lg:h-24 xl:w-32 xl:h-32 xxl:w-40 xxl:h-40",
                colorClass,
            ].join(" ")}
            >
                <LoadingThreeDots />

            </div>
        </div>
    );
}
