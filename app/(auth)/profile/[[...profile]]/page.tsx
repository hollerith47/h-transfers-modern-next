import {UserProfile} from "@clerk/nextjs";

export const metadata = {
    title: "Profile",
}

export default function Page() {
    return (
        <UserProfile path="/profile" />
    );
}