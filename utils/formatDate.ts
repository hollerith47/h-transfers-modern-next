import { parseISO, format } from "date-fns";
export function formateTime(date: Date) {
    return date.toLocaleDateString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export function formatDateString(iso: Date): string{
    const d = parseISO(String(iso));
    return format(d, "dd/MM/yyyy HH:mm:ss")
}