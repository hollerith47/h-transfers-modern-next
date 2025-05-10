"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
// @ts-ignore
import type { SpreadsheetData } from "react-spreadsheet";

const Spreadsheet = dynamic(
    () => import("react-spreadsheet") as unknown as Promise<React.ComponentType<{
        data: SpreadsheetData;
        onChange: (data: SpreadsheetData) => void;
    }>>,
    { ssr: false }
);

export default function page() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [data, setData] = useState<SpreadsheetData>(
        Array.from({ length: 15 }, () => Array.from({ length: 12 }, () => ""))
    );

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-4">Mini Google Sheet</h1>
            <div className="w-full h-[600px] overflow-auto border rounded">
                <iframe
                    width="100%"
                    height="100%"
                    src="https://docs.google.com/spreadsheets/d/1X-HayhFBfakKmdjay9Qe-9og1Fg3lnJuGLp_AZyWYB8/edit?usp=sharing"></iframe>
            </div>
        </div>
    );
}
