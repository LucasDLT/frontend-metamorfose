import { Ifotos } from "@/context/context";
import Image from "next/image";
import { useState } from "react";

interface CardProps extends Ifotos {
  handleDelete?: (id: number) => void;
  handleUpdate?: () => void;
  handleModal?: () => void;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>, id: number) => void;
  onDrop?: (e: React.DragEvent<HTMLDivElement>, id: number) => void;
  onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void;
  handleCategoryOrderChange?: (fotoId: number, newOrder: number) => void;  
  onDragEnd?: (e: React.DragEvent<HTMLDivElement>) => void;
  className?: string
}

export const Card: React.FC<CardProps> = (fotos: CardProps) => {
  const {
    url,
    title,
    category,
    createdAt,
    active,
    className = "",
    handleDelete,
    handleUpdate,
    handleModal,
    onDragStart,
    onDrop,
    onDragOver,
    onDragEnd,
  } = fotos;

  const [loading, setLoading] = useState(true);

  const newDate = new Date(createdAt!)
    .toLocaleDateString("es-ES")
    .replace(/\//g, "-");

  const imageUrl = url
    ? url instanceof File
      ? URL.createObjectURL(url)
      : url
    : "";

  return (
    <>
      <div
        draggable={true}
        onDragStart={(e) => onDragStart && onDragStart(e, fotos.id!)}
        onDragOver={onDragOver}
        onDrop={(e) => onDrop && onDrop(e, fotos.id!)}
        onDragEnd={onDragEnd}
        className={`${className} aspect-[1.446] flex flex-col items-center justify-center rounded font-sans relative z-0 cursor-grab transition-all duration-200 ease-in-out`}
      >
        {loading && (
          <div className="absolute border inset-0 z-50 flex items-center justify-center bg-black/40 text-white text-xs font-afacad">
            Cargando...
          </div>
        )}

        {/* Imagen */}
        <Image
          src={imageUrl}
          alt={title || "Imagen"}
          width={4120}
          height={2848}
          onLoadingComplete={() => setLoading(false)}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            loading ? "opacity-0 absolute" : "opacity-100 relative"
          }`}
        />

        {/* Header */}
        {!loading && (
          <>
            <div className="flex flex-row justify-between text-xs w-full bg-black bg-opacity-80 z-10 font-afacad absolute top-0">
              <h2 className="text-gray-300 hover:text-gray-500 uppercase flex items-center transition duration-500 ease-in-out">
                {category?.name}
              </h2>
              <h2 className="text-gray-300 hover:text-gray-500 uppercase transition duration-500 ease-in-out">
                {active?.valueOf() ? "Activo" : "Inactivo"}
              </h2>
              <h2 className="text-gray-300 hover:text-gray-500 uppercase flex items-center transition duration-500 ease-in-out">
                {newDate}
              </h2>
            </div>

            {/* Footer */}
            <div className="flex flex-row justify-between text-xs w-full bg-black bg-opacity-80 z-10 font-afacad absolute bottom-0">
              <button
                className="text-gray-300 hover:text-gray-500 transition duration-500 ease-in-out"
                onClick={handleModal}
              >
                VER
              </button>
              <button
                className="text-gray-300 hover:text-gray-500 transition duration-500 ease-in-out"
                onClick={handleUpdate}
              >
                EDICION
              </button>
              <button
                className="text-gray-300 hover:text-gray-500 transition duration-500 ease-in-out"
                onClick={() => handleDelete?.(fotos.id!)}
              >
                ELIMINAR
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};
