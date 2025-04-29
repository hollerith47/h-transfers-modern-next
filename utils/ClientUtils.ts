import type { ClientResponse} from "@/types";

/**
 * Génère une map clientId → clientName pour un accès O(1)
 */
export function buildClientNameMap(clients: ClientResponse[]): Record<string,string> {
    return clients.reduce<Record<string,string>>((map, c) => {
        map[c.id] = c.name;
        return map;
    }, {});
}

/**
 * Récupère le nom d’un client à partir de la map
 */
export function getClientName(
    clientNameMap: Record<string, string>,
    clientId?: string | null | undefined
): string {
    if (!clientId) return "";
    return clientNameMap[clientId] ?? "";
}
