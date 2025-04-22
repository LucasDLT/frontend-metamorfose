"use client";
import { FormImage } from "@/components/FormImage";
import { useContext } from "react";
import { Context, Ifotos } from "@/context/context";


export default function Carga() {

  const { fotos, setFotos, token } = useContext(Context);
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
          } }

  return (
  
    <FormImage mode="create" onSubmit={handleSubmit} />
    
  )
}
