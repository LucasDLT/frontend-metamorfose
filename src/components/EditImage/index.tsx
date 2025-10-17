"use client";

import { useContext, useEffect, useState } from "react";
import { Context, Ifotos } from "@/context/context";
import { FormImage } from "@/components/FormImage";
import { useRouter } from "next/navigation";

export const EditImage = ({ id }: { id: string }) => {
  const PORT = process.env.NEXT_PUBLIC_API_URL;
  const {
    login,
    setFotos,
    setActiveFotos,
    setInactiveFotos,
    setLoading,
    setGlobalError,
    getActiveFotos,
    getInactiveFotos,
    getCategory,
  } = useContext(Context);
  const [dataFetch, setDataFetch] = useState<Ifotos | null>(null);

  const router = useRouter();

  const numericId = Number(id);

  useEffect(() => {
    if (!login || !numericId) return;

    const fetchData = async (login: boolean, numericId: number) => {
      if (!login) return;
      setLoading(true);
      try {
        const response = await fetch(`${PORT}/photos/id/${numericId}`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) throw new Error("Acceso denegado. Token inválido.");

        const data: Ifotos = await response.json();
        setDataFetch(data);
      } catch (error) {
        setGlobalError(
          error instanceof Error
            ? error.message
            : "Ocurrió un error desconocido"
        );
        setDataFetch(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData(login, numericId);
  }, [PORT, numericId, login]);

  const handleEdit = async (
    formData: FormData,
    login: boolean,
    numericId?: number
  ) => {
    if (!login || !numericId) return;
    numericId = Number(numericId);
    try {
      const response = await fetch(`${PORT}/photos/update/${numericId}`, {
        method: "PUT",
        body: formData,
        credentials: "include",
      });

      if (!response.ok)
        throw new Error(
          "Ocurrió un error al actualizar la imagen por que el id es: " +
            numericId
        );

      const data = await response.json();
      const updatedFotos = data.photo as Ifotos[];

      // Seteo general
      setFotos(updatedFotos);

      // Separo activos e inactivos
      setActiveFotos(updatedFotos.filter((foto) => foto.active));
      setInactiveFotos(updatedFotos.filter((foto) => !foto.active));
    } catch (error) {
      console.error(error);
      setGlobalError(`${error}`);
    } finally {
      getActiveFotos(login);
      getInactiveFotos(login);
      getCategory(login);
      router.push("/navegacion/multimedia");
    }
  };

  return (
    dataFetch && (
      <FormImage
        defaultValue={dataFetch}
        mode="edit"
        onSubmit={(formData, login) => handleEdit(formData, login, numericId)}
      />
    )
  );
};
