export async function fetchUserRole(email: string) {
    const res = await fetch("/api/user/role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    });
    if (!res.ok) throw new Error("Failed to fetch user role");
    return await res.json() as Promise<{ role: string }>;
}