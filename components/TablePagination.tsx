type Props = {
    page: number;
    setPage: (page: (p: number) => number) => void;
    totalPages: number;
}
export default function TablePagination({page, setPage, totalPages}: Props) {
    return (
        <div className="flex justify-center mt-6">
            <div className="join">
                <button
                    className="join-item btn btn-primary"
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                >
                    « Précédent
                </button>
                <button className="join-item btn" disabled>
                    Page {page + 1} / {totalPages}
                </button>
                <button
                    className="join-item btn btn-primary"
                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                    disabled={page + 1 >= totalPages}
                >
                    Suivant »
                </button>
            </div>
        </div>
    );
}