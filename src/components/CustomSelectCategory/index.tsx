"use client";

import { useContext, useState } from "react";
import { Context, ICategory } from "@/context/context";
import { usePathname } from "next/navigation";
import { Trash2 } from "lucide-react";
import { IselectCategoryProps } from "../selectCategory";


export const CustomSelectCategory: React.FC<IselectCategoryProps> = ({
  onChange,
  style,
  value,
  onRequestDeleteCategory
}) => {
  const { category } = useContext(Context);

  const path = usePathname();

  const isMultimediaPage = path === "/navegacion/multimedia";
  const isMultimediaDetail = path.startsWith("/multimedia/") && path !== "/multimedia";

  const titleSelect = isMultimediaPage
    ? "Categorias"
    : isMultimediaDetail
    ? "Selecciona una categoría"
    : "Categorías";

  const [isOpen, setIsOpen] = useState(false);

  const selectedCategoryName = value || "";

  const handleSelect = (selectedName: string) => {
    const selectedCategory =
      category?.find((cat) => cat.name === selectedName) || null;
    onChange(selectedCategory);
    setIsOpen(false);
  };

  


  return (
    <div className="animate-fade-in absolute
        top-[10px]
        left-[-28%]
        flex
        flex-col
        items-center
        justify-center
        gap-10
        w-[5.5rem]
        sm:left-[-22%] 
        md:left-[-15%]
        lg:left-[-11%]
        xl:left-[-8%]
        2xl:left-[-7%]" 
        style={style}>
          <div className="relative w-full">

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className=" text-white w-full p-2 flex justify-evenly items-center"
      >
        <span>{selectedCategoryName || titleSelect}</span>
        <svg
          className={`w-4 h-4 transform transition-transform duration-400 ease-in-out ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button> 

      {/* Lista de opciones */}
      <div
        className={`absolute bg-black/60 w-full   rounded shadow z-10 max-h-60 overflow-y-auto transition-all duration-400 origin-top transform
          ${isOpen ? "opacity-100 scale-100 transition duration-300 ease-in-out" : "opacity-0 scale-95 pointer-events-none"}
        `}
      >
        <ul >
     
          {category.map((categoria: ICategory) => (
            <li
              key={categoria.id}
              className="flex justify-between items-center text-white text-[9px] hover:text-gray-400 transition duration-300 ease-in-out cursor-pointer mb-1 px-2"
              onClick={() => handleSelect(categoria.name)}
            >
              <span>{categoria.name.toUpperCase()}</span>
              {(!categoria.images || categoria.images.length === 0) && (
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Evita que se dispare selección al hacer click en borrar
                    onRequestDeleteCategory?.(categoria.id);
                  }}
                  className="ml-2"
                >
                  <Trash2 className="w-3 h-3 text-white hover:text-red-600 transition" />
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

                </div>
    </div>
  );
};
