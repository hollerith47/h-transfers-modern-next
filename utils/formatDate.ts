export function formateTime(date: Date) {
    return date.toLocaleDateString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}