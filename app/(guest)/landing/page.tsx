import Link from "next/link";

export default function Page() {
    return (
        <>
            <div className="flex items-center justify-center flex-col py-10 w-full">
                <div>
                    <div className="flex flex-col">
                        <h1 className="text-4xl md:text-5xl font-bold text-center">
                            Transferer de l&apos;argent n&apos;a<br />  jamais ete aussi facile
                        </h1>
                        <p className="py-6 text-gray-800 text-center">
                            Envoyer et recever de l&apos;argent <br /> en toute simplicité avec
                            notre service !
                        </p>
                        <div className="flex justify-center items-center">
                            <Link
                                href={"/sign-in"}
                                className="btn btn-sm md:btn-md btn-outline btn-primary"
                            >
                                Se connecter
                            </Link>
                            <Link
                                href={"/sign-up"}
                                className="btn btn-sm md:btn-md ml-2 btn-primary"
                            >
                                S&apos;inscrire
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}