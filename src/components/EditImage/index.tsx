"use client";

import { useContext, useEffect, useState } from "react";
import { Context, Ifotos } from "@/context/context";
import { FormImage } from "@/components/FormImage";

export const EditImage = ({ id }: { id: string })=> {
const PORT = process.env.NEXT_PUBLIC_API_URL;
  const { login, setFotos } = useContext(Context);
  const [dataFetch, setDataFetch] = useState<Ifotos | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const numericId = Number(id);

  useEffect(() => {
    if (!login || !numericId) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${PORT}/photos/id/${numericId}`, {
          method: "GET",
          credentials: "include",
          
        });

        if (!response.ok) throw new Error("Acceso denegado. Token inválido.");

        const data: Ifotos = await response.json();
        setDataFetch(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Ocurrió un error desconocido"
        );
        setDataFetch(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [PORT, numericId, login]);

  const handleEdit = async (formData: FormData) => {
    try {
      const response = await fetch(`${PORT}/photos/update/${numericId}`, {
        method: "PUT",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) throw new Error("Ocurrió un error al actualizar la imagen");

      const data = await response.json();
      setFotos(data.photo);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return dataFetch ? (
    <FormImage defaultValue={dataFetch} mode="edit" onSubmit={handleEdit} />
  ) : (
    <div>No se encontraron datos</div>
  );
}
