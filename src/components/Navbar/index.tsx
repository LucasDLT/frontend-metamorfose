"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useContext } from "react";
import { Context, ICategory } from "@/context/context";
import { toast } from "sonner";

export default function Navbar() {
  const router = useRouter();
  const path = usePathname();
  const multimedia = path.includes("multimedia");
  const { token, setToken, setSelected, selected } =
    useContext(Context);

  const logOut = () => {
    toast.warning("Adios!", {
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
        height: "20px",
        width: "200px",
        backgroundColor: "#6666662f",
        fontFamily: " afacad",
      },
    });
    setToken(null);
    router.push("/");
  };

  const handleSelect =()=>setSelected(!selected)


  return (
    <nav className="w-[8%] h-60 flex flex-col justify-center items-center text-xs text-white text-center gap-4 fixed z-50 top-[40%] right-[0%] tracking-wide font-afacad  ">
      {token && (
        <div className="transform transition hover:translate-x-[-10%] duration-500 ease-in-out ">
          <Link href={"/"} onClick={logOut}>
            LOGOUT
          </Link>
        </div>
      )}
      {!token && (
        <div className=" transform hover:translate-x-[-10%] transition duration-500 ease-in-out">
          <Link href={"/forms"}>FORMULARIOS</Link>
        </div>
      )}
      <div className="transform hover:translate-x-[-10%] transition duration-500 ease-in-out">
        <Link href={"/"}>INICIO</Link>
      </div>
      {token && (
          // aca utilice template string para meter en la clase una condicion 
          <div className={`trasnform hover:translate-x-[-10%] transition duration-500 ease-in-out ${path ==="/" ? "animate-pulse":""}`}>
          <Link href={"/navegacion"}>PANEL</Link>
        </div>
      
      )}
      {token && multimedia && (
          <div className={`trasnform hover:translate-x-[-10%] transition duration-500 ease-in-out ${path ==="/" ? "animate-pulse":""}`}>
                  <Link className=" hover:text-gray-500 transition duration-300 ease-in-out" href="/navegacion/multimedia" onClick={handleSelect}>REUBICAR</Link>

        </div>
      )

      }

    </nav>
  );
}
