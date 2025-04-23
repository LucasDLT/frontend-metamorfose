import { Context, Ifotos } from "@/context/context";
import { useContext } from "react";
import Image from "next/image";

interface CardProps extends Ifotos {
  handleDelete?: (id: number) => void;
  handleUpdate?: () => void;
  handleModal?: () => void;
  handleChecked?: (e: React.ChangeEvent<HTMLInputElement>) => void; //dejo esto aca para un selector de botones que se activa con el panel EDICION tengo que hacer dos bloques de divs para que se seleccione entre uno y otro, un boton que la active y le pase a esta funcion un valor booleano para que se muestre el otro. Se ve entre la vista multimedia y la de edicion de ubicacion.
  checked?: boolean;
  handleCategoryOrderChange?: (fotoId: number, newOrder: number) => void;  
}

export const Card: React.FC<CardProps> = (fotos: CardProps) => {
  const {
    url,
    title,
    
    category,
    createdAt,
    active,

    handleDelete,
    handleUpdate,
    handleModal,
    handleChecked,
    checked,
  
  } = fotos;

  const newDate = new Date(createdAt!)
    .toLocaleDateString("es-ES")
    .replace(/\//g, "-");

  const imageUrl = url
    ? url instanceof File
      ? URL.createObjectURL(url)
      : url
    : "";
  const { selected } = useContext(Context);


  return (
    <>    
    <div className="aspect-[1.446]  m-1 flex flex-col items-center justify-center rounded font-sans relative z-0 ">
      {!selected && (
        <div className="flex flex-row justify-between  text-xs w-full bg-black bg-opacity-80 z-10 font-afacad absolute top-0  ">
          <h2 className="text-gray-300 hover:text-gray-500 uppercase flex alingn-center transition duration-500 ease-in-out">
            {category?.name} 
          </h2>
          <h2 className="text-gray-300 hover:text-gray-500 uppercase transition duration-500 ease-in-out">
            {active?.valueOf() ? "Activo" : "Inactivo"}
          </h2>
          <h2 className="text-gray-300 hover:text-gray-500 uppercase flex alingn-center transition duration-500 ease-in-out">
            {newDate}
          </h2>
        </div>
      )}
      <Image
        src={imageUrl}
        alt={title || "Imagen"}
        width={4120}
        height={2848}
        className="flex justify-center items-center w-full h-full object-cover hover:opacity-80  transition duration-500 ease-in-out"
      />
      {!selected && (
        <div className="flex flex-row justify-between text-xs w-full bg-black bg-opacity-80 z-10 font-afacad absolute bottom-[0px] ">
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
            className="text-gray-300 hover:text-gray-500 transition duration-500 ease-in-out "
            onClick={() => handleDelete?.(fotos.id!)}
            >
            ELIMINAR
          </button>
        </div>
      )}

      {selected && 
      <input
       type="checkbox" 
       name="swap" 
       id="swap"
       checked={checked}
       onChange={handleChecked} 
       className="absolute top-1 left-1 "
       />}
    </div>
    </>
  );
};
