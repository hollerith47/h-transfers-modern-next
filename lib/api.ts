import {DeleteAccountPayload, DeleteAccountResponse, UserIdType} from "@/types";

export async function fetchUserRole(email: string) {
    const res = await fetch("/api/user/role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    });
    if (!res.ok) throw new Error("Failed to fetch user role");
    return await res.json() as { role: string; id: string };
}



export async function deleteAccountAPI(payload: DeleteAccountPayload):Promise<DeleteAccountResponse>{
    const res = await fetch("/api/account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) {
        throw new Error(json.error || "Failed to delete account");
    }
    return json;
}
export async function setUserAdmin(payload: UserIdType){
    const res = await fetch("/api/user/promote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) {
        throw new Error(json.error || "Failed to promote user");
    }
    return json;
}
