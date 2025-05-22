"use client";
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ReactQueryStreamedHydration} from '@tanstack/react-query-next-experimental'
import React from "react";
import UseScrollToTop from "@/hook/useScrollToTop";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            experimental_prefetchInRender: true,
            staleTime: 1000 * 60,
            refetchOnWindowFocus: false,
            retry: 2,
            gcTime: 1000 * 60 * 5,
        }
    }
});

export default function Providers({children}: { children: React.ReactNode }) {
    UseScrollToTop();

    return (
        <QueryClientProvider client={queryClient}>
            <ReactQueryStreamedHydration>
                {children}
            </ReactQueryStreamedHydration>
            {process.env.NODE_ENV === "development" && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
    )
}