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
    <nav className="w-[4.5rem] h-[90px] flex flex-col justify-center items-center text-sm text-white text-center gap-4 fixed z-50  tracking-wide font-afacad absolute top-[12rem] right-[1rem] ">

      {login === false && (
        <div className=" transform hover:translate-x-[-10%] transition duration-500 ease-in-out">
          <Link href={"/forms"}>Ingreso</Link>
        </div>
      )}
      <div className="transform hover:translate-x-[-10%] transition duration-500 ease-in-out">
        <Link href={"/"}>Inicio</Link>
      </div>
      {login && (
          // aca utilice template string para meter en la clase una condicion 
          <div className={`trasnform hover:translate-x-[-10%] transition duration-500 ease-in-out ${path ==="/" ? "animate-pulse":""}`}>
          <Link href={"/navegacion"}>Panel</Link>
        </div>
      
      )}
    

    </nav>
  );
}
