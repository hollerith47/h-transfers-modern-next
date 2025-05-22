import ContentLayout from "@/app/(auth)/content-layout";
import DashboardContainer from "@/app/(auth)/DashboardContainer";

export const metadata = {
    title: "Dashboard",
}

export default function Page() {
    return (
        <ContentLayout title="Tableau de bord" description="Appercue des statistiques generales">
            <DashboardContainer />
        </ContentLayout>
    );
}