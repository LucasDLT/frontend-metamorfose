"use client";
import { FormImage } from "@/components/FormImage";
import { useContext } from "react";
import { Context, Ifotos } from "@/context/context";


export default function Carga() {

  const { fotos, setFotos, token, setCategory } = useContext(Context);
  const PORT=process.env.NEXT_PUBLIC_API_URL

  const handleSubmit = async (formData: FormData) => {
         const response = await fetch(`${PORT}/photos/upload`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token?.token}`,
            },
            body: formData,
          });
          const data: { photo: Ifotos } = await response.json();
          if (data.photo) {
            setFotos([...fotos, data.photo as Ifotos]);
            setCategory(prevCategories => prevCategories.map(cat => {
              // Si la categoría de la foto subida coincide
              if (cat.id === data.photo.category?.id) {
                // Agregamos la imagen al array de imágenes de la categoría
                return {
                  ...cat,
                  images: [...(cat.images || []), data.photo],
                };
              }
              return cat;
            }));          } }

  return (
  
    <FormImage mode="create" onSubmit={handleSubmit} />
    
  )
}
