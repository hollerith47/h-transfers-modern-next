import type {Metadata} from "next";
import { Inter, Roboto_Mono } from 'next/font/google'
import "./globals.css";

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

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
    return (
        <html lang="en" data-theme="corporate" className={`${inter.variable} ${roboto_mono.variable} antialiased`}>
        <body id="top">
        {children}
        </body>
        </html>
    );
}
