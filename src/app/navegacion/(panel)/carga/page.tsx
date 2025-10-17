"use client";
import { FormImage } from "@/components/FormImage";
import { useContext } from "react";
import { Context, Ifotos } from "@/context/context";
import { useRouter } from "next/navigation";

export default function Carga() {
  const {  fotos, setFotos, setCategory, setLoading, getActiveFotos, getInactiveFotos, getCategory } = useContext(Context);
  const PORT = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  const handleSubmit = async ( login: boolean, formData: FormData) => {
    if (!login) return;
    setLoading(true);

    try { 
      const response = await fetch(`${PORT}/photos/upload`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data: { photo: Ifotos } = await response.json();
      if (data.photo) {
        setFotos([...fotos, data.photo as Ifotos]);
        setCategory((prevCategories) =>
          prevCategories.map((cat) => {
            // Si la categoría de la foto subida coincide
            if (cat.id === data.photo.category?.id) {
              // Agregamos la imagen al array de imágenes de la categoría
              return {
                ...cat,
                images: [...(cat.images || []), data.photo],
              };
            }
            return cat
          })
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      getActiveFotos(login);
      getInactiveFotos(login);
      getCategory(login);
      router.push("/navegacion/multimedia");
    }
  };

  return <FormImage mode="create"  onSubmit={(formData, login) => handleSubmit(login, formData)}/>;
}
