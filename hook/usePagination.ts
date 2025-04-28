import { useState, useMemo } from "react";

export type PaginationResult<T> = {
    page: number;
    itemsPerPage: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    totalPages: number;
    paginatedData: T[];
};

/**
 * Hook générique de pagination.
 * @param data           Le tableau complet à paginer
 * @param itemsPerPage   Nombre d’éléments par page
 * @param options
 * @param options.initialPage  Page de départ (défaut 0)
 * @param options.sortFn       Fonction de tri optionnelle
 */
export function usePagination<T>(data: T[], itemsPerPage: number, options?: { initialPage?: number; sortFn?: (a: T, b: T) => number; }): PaginationResult<T> {
    const { initialPage = 0, sortFn } = options || {};
    const [page, setPage] = useState(initialPage);

    // 1️⃣ Tri optionnel
    const sortedData = useMemo(() => {
        if (!sortFn) return [...data].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        // on clone pour ne pas muter l’original
        return [...data].sort(sortFn);
    }, [data, sortFn]);

    // 2️⃣ Calcul du nombre total de pages
    const totalPages = useMemo(
        () => Math.ceil(sortedData.length / itemsPerPage),
        [sortedData.length, itemsPerPage]
    );

    // 3️⃣ Extraction du sous-tableau pour la page courante
    const paginatedData = useMemo(() => {
        const start = page * itemsPerPage;
        return sortedData.slice(start, start + itemsPerPage);
    }, [sortedData, page, itemsPerPage]);

    return { page, setPage, totalPages, itemsPerPage,paginatedData };
}
