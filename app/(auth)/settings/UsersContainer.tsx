"use client";
import {useFetchUsers} from "@/hook/useFetchUsers";
import Loader from "@/components/ui/Loader";
import UserList from "@/app/(auth)/settings/UserList";

export default function UsersContainer() {
    const {data: users, isLoading} = useFetchUsers();
    if (isLoading) {
        return <Loader fullScreen/>
    }
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <UserList users={users}/>
        </div>
    );
}