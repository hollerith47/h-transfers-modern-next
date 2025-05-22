import Link from "next/link";

export default function Logo() {
    return (
        <Link href="/"  className="flex font-bold items-center">
            {/*<Image src={logoImg} alt={"Logo H Tech"} width={"50"} height={"50"} />*/}
            <span className="text-2xl md:text-3xl bg-primary text-white">H</span>
            <span className="text-2xl md:text-3xl text-primary">Transfers</span>
        </Link>

);
}
