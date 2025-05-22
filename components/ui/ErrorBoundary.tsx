"use client";
import {useQueryErrorResetBoundary} from "@tanstack/react-query";
import {ErrorBoundary as ReactErrorBoundary} from "react-error-boundary";

export default function QueryErrorBoundary({children}: {children: React.ReactNode}) {
    const {reset}  = useQueryErrorResetBoundary();
    return (
        <ReactErrorBoundary
            onReset={reset}
            fallbackRender={({error, resetErrorBoundary}) => (
                <div className="alert alert-error">
                    <div>
                        <span>Une erreur est survenue: {error.message}</span>
                        <button
                            className="btn btn-sm btn-outline"
                            onClick={resetErrorBoundary}
                        >
                            Réessayer
                        </button>
                    </div>
                </div>
            )}
        >
            {children}
        </ReactErrorBoundary>
    );
}