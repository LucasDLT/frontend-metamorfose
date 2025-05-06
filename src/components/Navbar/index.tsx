"use client";
import Link from "next/link";
import {  usePathname } from "next/navigation";
import { useContext } from "react";
import { Context } from "@/context/context";

export default function Navbar() {
  const path = usePathname();
  const { login } =
    useContext(Context);

  


  return (
    <nav className="w-[7%] h-60 flex flex-col justify-center items-center text-xs text-white text-center gap-4 fixed z-50 top-[16%] right-[0%] tracking-wide font-afacad  ">

      {login === false && (
        <div className=" transform hover:translate-x-[-10%] transition duration-500 ease-in-out">
          <Link href={"/forms"}>FORMULARIOS</Link>
        </div>
      )}
      <div className="transform hover:translate-x-[-10%] transition duration-500 ease-in-out">
        <Link href={"/"}>INICIO</Link>
      </div>
      {login && (
          // aca utilice template string para meter en la clase una condicion 
          <div className={`trasnform hover:translate-x-[-10%] transition duration-500 ease-in-out ${path ==="/" ? "animate-pulse":""}`}>
          <Link href={"/navegacion"}>PANEL</Link>
        </div>
      
      )}
    

    </nav>
  );
}
