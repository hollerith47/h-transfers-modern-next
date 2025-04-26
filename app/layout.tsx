import type {Metadata} from "next";
import {Inter, Roboto_Mono} from 'next/font/google'
import "./globals.css";
import {ClerkProvider} from "@clerk/nextjs";
import { Toaster } from 'sonner';

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-inter',
})

const roboto_mono = Roboto_Mono({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-roboto-mono',
})

export const metadata: Metadata = {
    title: {
        default: "H Transfert",
        template: "%s | H Transfert",
    },
    description: "H Transfert application de gestion de transfert pour les administrateurs et gestionnaire",
};

export default function RootLayout({children}: Readonly<{ children: React.ReactNode }>) {
    return (
        <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
            <html lang="en" data-theme="corporate" className={`${inter.variable} ${roboto_mono.variable} antialiased`}>
            <body id="top">
            {children}
            <Toaster richColors position="bottom-right" />
            </body>
            </html>
        </ClerkProvider>
    );
}
