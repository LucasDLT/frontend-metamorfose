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
}) => {
  const { category, setCategory } = useContext(Context);
  const path = usePathname();
  const PORT = process.env.NEXT_PUBLIC_API_URL;

  const isMultimediaPage = path === "/navegacion/multimedia";
  const isMultimediaDetail = path.startsWith("/multimedia/") && path !== "/multimedia";

  const titleSelect = isMultimediaPage
    ? "Total de fotos"
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

  const handleDeleteCategory = async (categoryId: number) => {
    const confirmDelete = confirm("¿Estás seguro de eliminar la categoría?");
    if (confirmDelete) {
      try {
        const response = await fetch(`${PORT}/categories/${categoryId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Error eliminando la categoría");

        // Actualizamos la lista en el contexto
        setCategory((prev) => prev.filter((cat) => cat.id !== categoryId));
      } catch (error) {
        console.error("Error al eliminar categoría:", error);
      }
    }
  };

  return (
    <div className=" ml-[-36px] w-[8.5rem]" style={style}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className=" text-white w-full p-2  flex justify-evenly items-center"
      >
        <span>{selectedCategoryName || titleSelect}</span>
        <svg
          className={`w-4 h-4 transform transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Lista de opciones */}
      <div
        className={`absolute bg-black/60 w-full mt-1 rounded shadow z-10 max-h-60 overflow-y-auto transition-all duration-200 origin-top transform
          ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}
        `}
      >
        <ul className="py-1">
          <li
            key="default"
            className="px-4 py-2 text-white hover:text-gray-400 transition duration-300 ease-in-out cursor-pointer"
            onClick={() => handleSelect("")}
          >
            {titleSelect}
          </li>

          {category.map((categoria: ICategory) => (
            <li
              key={categoria.id}
              className="flex justify-between items-center px-4 py-2 text-white hover:text-gray-400 transition duration-300 ease-in-out cursor-pointer"
              onClick={() => handleSelect(categoria.name)}
            >
              <span>{categoria.name.toUpperCase()}</span>
              {(!categoria.images || categoria.images.length === 0) && (
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Evita que se dispare selección al hacer click en borrar
                    handleDeleteCategory(categoria.id);
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
  );
};
