import { X} from "lucide-react";
import {Client} from "@/types";

type Props = {
    client: Client
};

export default function ModifyTransaction({client}: Props) {
    return (
        <>
            <div className="">
                <button className="btn btn-xs md:btn-sm btn-success flex items-center gap-2"
                        onClick={() => (document.getElementById('my_modal_6') as HTMLDialogElement).showModal()}>
                    Modifier
                </button>
                <dialog id="my_modal_6" className="modal">
                    <div className="modal-box">
                        <form method="dialog">
                            <button className="btn btn-sm btn-circle btn-soft btn-error absolute right-2 top-2">
                                <X/>
                            </button>
                        </form>
                        <h3 className="font-bold text-lg">Modifier le detail du client</h3>
                        <div className="w-full flex flex-col ">
                        </div>
                    </div>
                </dialog>
            </div>
        </>
    );
}