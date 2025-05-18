'use client';
import Link from "next/link";
import { useContext } from "react";
import { Context } from "@/context/context";
import { usePathname } from "next/navigation";

const Layout = ({ children, }: Readonly <{ children: React.ReactNode }>) => {
  const {setCategoryPage, setSelectedCategory} = useContext(Context)
  const patname = usePathname()

  const handleSelectCategoryPage =()=>{  
    
    setCategoryPage(true)

  }


  const handleSelectedMultimediaPage =()=>{
    setCategoryPage(false)
    setSelectedCategory(null)
  }
  return (
      <nav key={patname} className={`h-10 w-screen flex justify-center items-center gap-10 tracking-widest text-xs fixed z-50 sm:justify-center md:justify-center lg:justify-center xl:justify-center 2xl:justify-center ${patname === "/navegacion" ? "animate-fade-in" : "" }`}>
        <div className="flex gap-10 justify-center w-screen items-center sm:justify-end sm:mr-8 md:justify-end lg:justify-end xl:justify-end 2xl:justify-end">
        <Link className=" hover:text-gray-500 transition duration-300 ease-in-out" href="/navegacion/multimedia" onClick={handleSelectedMultimediaPage}>MULTIMEDIA</Link>
        <Link className=" hover:text-gray-500 transition duration-300 ease-in-out" href="/navegacion/carga">SUBIR</Link>
        <Link className=" hover:text-gray-500 transition duration-300 ease-in-out" href="/navegacion/multimedia" onClick={handleSelectCategoryPage}>CATEGORIAS</Link>
        </div>  
      {children}
      </nav>
  );
};

export default Layout;