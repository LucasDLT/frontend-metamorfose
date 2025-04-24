'use client';
import Link from "next/link";
import { useContext } from "react";
import { Context } from "@/context/context";

const Layout = ({ children, }: Readonly <{ children: React.ReactNode }>) => {
  const {setCategoryPage, setSelectedCategory} = useContext(Context)

  const handleSelectCategoryPage =()=>{  
    
    setCategoryPage(true)
    setSelectedCategory(null)

  }


  const handleSelectedMultimediaPage =()=>{
    setCategoryPage(false)
    setSelectedCategory(null)
  }
  return (
    <div className="max-w-screen-xl max-h-screen-2xl font-afacad flex justify-center items-center  absolute top-52 left-32 right-32  ">
      <nav className="h-10 border  border-black w-full flex flex-row align-center items-center tracking-widest justify-evenly text-xs fixed top-36 z-50 backdrop-blur-sm bg-gradient-to-t from-black to-zinc/20">
        <Link className=" hover:text-gray-500 transition duration-300 ease-in-out" href="/navegacion/multimedia" onClick={handleSelectedMultimediaPage}>MULTIMEDIA</Link>
        <Link className=" hover:text-gray-500 transition duration-300 ease-in-out" href="/navegacion/carga">SUBIR</Link>
        <Link className=" hover:text-gray-500 transition duration-300 ease-in-out" href="/navegacion/multimedia" onClick={handleSelectCategoryPage}>CATEGORIAS</Link>
      </nav>
      {children}
    </div>
  );
};

export default Layout;
