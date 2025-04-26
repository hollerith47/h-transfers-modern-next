import {useEffect} from "react";

type Props = {
    message: string
    onClose: () => void
};
export default function Notification({message, onClose}:Props) {
    
    useEffect(()=>{
        const timer = setTimeout(()=>{
            onClose()
        },3000)
        return () => clearTimeout(timer)
    },[onClose])

    return (
        <div className="toast toast-bottom toast-left">
            <div className="alert p-2 text-sm shadow-lg">
                <span className="flex items-center">
                    {message}
                </span>
            </div>
        </div>
    );
}