import {Inbox} from "lucide-react";

export default function EmptyTransaction() {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-gray-500">
            <Inbox strokeWidth={1.5} className="w-12 h-12 mb-4"/>
            <p className="text-lg">Aucune transaction disponible</p>
        </div>
    );
}