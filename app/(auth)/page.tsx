import ContentLayout from "@/app/(auth)/content-layout";

export const metadata = {
    title: "Dashboard",
}
export default function Page() {
    return (
        <ContentLayout title="Dashboard" description="description">
            <h1>Des tableaux et statistiques</h1>
        </ContentLayout>
    );
}