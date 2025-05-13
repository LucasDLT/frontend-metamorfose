'use client';
import Link from "next/link";
import { useContext } from "react";
import { Context } from "@/context/context";

const Layout = ({ children, }: Readonly <{ children: React.ReactNode }>) => {
  const {setCategoryPage, setSelectedCategory} = useContext(Context)

  const handleSelectCategoryPage =()=>{  
    
    setCategoryPage(true)

  }


  const handleSelectedMultimediaPage =()=>{
    setCategoryPage(false)
    setSelectedCategory(null)
  }
  return (
    <div className="max-w-screen-xl max-h-screen-2xl font-afacad relative  ">
      <nav className="h-10 w-screen flex justify-end items-center gap-10 tracking-widest text-xs fixed top-[6rem] right-36  z-50 ">
        <Link className=" hover:text-gray-500 transition duration-300 ease-in-out" href="/navegacion/multimedia" onClick={handleSelectedMultimediaPage}>MULTIMEDIA</Link>
        <Link className=" hover:text-gray-500 transition duration-300 ease-in-out" href="/navegacion/carga">SUBIR</Link>
        <Link className=" hover:text-gray-500 transition duration-300 ease-in-out" href="/navegacion/multimedia" onClick={handleSelectCategoryPage}>CATEGORIAS</Link>
      </nav>
      {children}
    </div>
  );
};

export default Layout;