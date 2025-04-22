"use client";

import { useContext, useEffect, useState } from "react";
import { Context, Ifotos } from "@/context/context";
import { FormImage } from "@/components/FormImage";

export const EditImage = ({ params }: { params: Promise<{ id: number }> }) => {
  const PORT = process.env.NEXT_PUBLIC_API_URL;
  const { token, setFotos } = useContext(Context);
  const [dataFetch, setDataFetch] = useState<Ifotos | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Desempaquetar el parámetro `id` usando React.use()
  const [id, setId] = useState<number | null>(null);

  useEffect(() => {
    const fetchParams = async () => {
      // Desempaquetar la promesa de params
      const resolvedParams = await params;
      setId(resolvedParams.id);
    };

    fetchParams();
  }, [params]);

  useEffect(() => {
    if (!token?.token || !id) {
      // Si no tenemos token o id, no hacer la solicitud
      return;
    }

    const fetchData = async (id: number) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${PORT}/photos/id/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token.token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Acceso denegado. Token inválido.");
        }

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

    if (id) {
      fetchData(id);
    }
  }, [id, token]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }


  const handleEdit = async (formData: FormData) => {
    console.log("Formulario enviado:", formData);
    
    try {
      const response = await fetch(`${PORT}/photos/update/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token?.token}`,
        },
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Ocurrio un error al actualizar la imagen");
      }
      const data = await response.json();
      console.log(" datos modificados", data.photo );
      setFotos(data.photo);

    } catch (error) {
      console.error(error);
    }
  };
  

  return (
    <>
      {dataFetch ? (
        <FormImage defaultValue={dataFetch} mode="edit" onSubmit={handleEdit} />
      ) : (
        <div>No se encontraron datos</div>
      )}
    </>
  );
};

export default EditImage;
