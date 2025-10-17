"use client";
import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Context, ICategory, Ifotos } from "@/context/context";
import { Card } from "@/components/Card";
import { Modal } from "@/components/Modal";
import Image from "next/image";
import { ConfirmModal } from "@/components/ConfirmModal";
import { ArrowDownUpIcon } from "lucide-react";
import { CustomSelectCategory } from "@/components/CustomSelectCategory";
import { toast } from "sonner";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { IsActiveFotoBtn } from "@/components/IsAtiveFotoBtn";
import { Loader } from "@/components/Loader";

export default function Multimedia() {
  const {
    login,
    fotos,
    setFotos,
    selectedCategory,
    setSelectedCategory,
    categoryPage,
    globalFotos,
    setGlobalFotos,
    setCategory,
    category,
    activeFotos,
    inactiveFotos,
    setLoading,
    getActiveFotos,
    getInactiveFotos,
    setActiveFotos,
    setInactiveFotos,
  } = useContext(Context);
  const [localFoto, setLocalFoto] = useState<Ifotos[]>([]); // Fotos por categoría
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedFoto, setSelectedFoto] = useState<Ifotos | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [fotoIdToDelete, setFotoIdToDelete] = useState<number | null>(null);
  const [editedName, setEditedName] = useState(selectedCategory?.name || "");
  const [filterType, setFilterType] = useState<"active" | "inactive" | "all">(
    "all"
  );
  const [updateModalIsOpen, setUpdateModalIsOpen] = useState<boolean>(false);
  const [categoryIdToDelete, setCategoryIdToDelete] = useState<number | null>(
    null
  );
  const [openModalDeleteCategory, setOpenModalDeleteCategory] =
    useState<boolean>(false);
  const [inactiveInCategory, setInactiveInCategory] = useState<boolean>(false);
  const [categoryUpdateData, setCategoryUpdateData] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    setEditedName(selectedCategory?.name || ""); // Cada vez que cambia la categoría seleccionada, reseteamos
  }, [selectedCategory]);

  const PORT = process.env.NEXT_PUBLIC_API_URL;

  const handleRequestDelete = (categoryId: number) => {
    setCategoryIdToDelete(categoryId);
    setOpenModalDeleteCategory(true);
  };

  const handleDeleteCategory = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event?.preventDefault();
    if (!categoryIdToDelete) return;
    setLoading(true);
    try {
      const response = await fetch(`${PORT}/categories/${categoryIdToDelete}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) throw new Error("Error eliminando la categoría");

      // Actualizamos la lista en el contexto
      setCategory((prev) =>
        prev.filter((cat) => cat.id !== categoryIdToDelete)
      );
      toast.success("categoría eliminada", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
          height: "20px",
          width: "200px",
          backgroundColor: "#6666662f",
          fontFamily: " afacad",
        },
      });
    } catch (error) {
      console.error("Error al eliminar categoría:", error);
    } finally {
      setLoading(false);
      setOpenModalDeleteCategory(false);
      setCategoryIdToDelete(null);
      setEditedName("");
    }
  };

  const toggleModal = (foto: Ifotos | null) => {
    setSelectedFoto(foto);
    setIsModalOpen(!isModalOpen);
  };

  const handleDelete = async (login: boolean, id: number) => {
    if (!login) return;
    setLoading(true);

    try {
      const response = await fetch(`${PORT}/photos/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await response.json();
      if (data.photos) {
        setFotos(data.photos);
      }
      if (category.length > 0) {
        const updatedCategories = category.map((cat) => {
          const hasPhotos = data.photos.some(
            (foto: Ifotos) => foto.category?.id === cat.id
          );
          return {
            ...cat,
            images: hasPhotos ? cat.images || [] : [], // Si no hay fotos, images queda vacío
          };
        });
        setCategory(updatedCategories);
        toast.success("Foto eliminada", {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
            height: "20px",
            width: "200px",
            backgroundColor: "#6666662f",
            fontFamily: " afacad",
          },
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      getActiveFotos(login);
      getInactiveFotos(login);
      setLoading(false);
    }
  };

  const confirmDelete = (id: number) => {
    setFotoIdToDelete(id);
    setModalIsOpen(true);
  };

  const handleConfirmDelete = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event?.preventDefault();
    if (fotoIdToDelete == null) return;
    await handleDelete(login, fotoIdToDelete);
    setModalIsOpen(false);
    setFotoIdToDelete(null);
  };

  const confirmUpdateCategory = (categoryId: number, categoryName: string) => {
    setCategoryUpdateData({ id: categoryId, name: categoryName });
    setUpdateModalIsOpen(true);
  };

  const handleUpdate = async (id: number) => {
    router.push(`multimedia/${id}`);
  };

  const { url, title } = selectedFoto || {};
  const imageUrl = url
    ? url instanceof File
      ? URL.createObjectURL(url)
      : url
    : "";

  // Actualiza los estados de fotos por categoría y fotos globales
  useEffect(() => {
    if (login) {
      if (selectedCategory) {
        const filteredFotos = fotos.filter(
          (foto) => foto.category?.id === selectedCategory.id
        );
        // Si hay una categoría seleccionada, usa las fotos de esa categoría
        setLocalFoto(
          filteredFotos.sort(
            (a: Ifotos, b: Ifotos) => b.categoryOrder! - a.categoryOrder!
          )
        );
      } else {
        // Si no hay categoría seleccionada, usa todas las fotos y ordena globalmente
        setGlobalFotos(
          fotos.sort((a: Ifotos, b: Ifotos) => b.globalOrder! - a.globalOrder!)
        );
        setActiveFotos(
          activeFotos.sort(
            (a: Ifotos, b: Ifotos) => b.globalOrder! - a.globalOrder!
          )
        );
        setInactiveFotos(
          inactiveFotos.sort(
            (a: Ifotos, b: Ifotos) => b.globalOrder! - a.globalOrder!
          )
        );
        inactiveFotos.sort(
          (a: Ifotos, b: Ifotos) => b.globalOrder! - a.globalOrder!
        );
      }
    } 
  }, [fotos, login, selectedCategory]);

  const handleCategoryChange = (selectedCategory: ICategory | null) => {
    if (selectedCategory !== null) {
      setSelectedCategory(selectedCategory);
    } else {
      setSelectedCategory(null);
    }
  };
  const handleConfirmUpdateCategory = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event?.preventDefault();

    if (!categoryUpdateData) return;

    await handleUpdateCategory(categoryUpdateData.id, categoryUpdateData.name);
    setUpdateModalIsOpen(false);
    setCategoryUpdateData(null);
  };

  const handleUpdateCategory = async (
    categoryId: number,
    categoryName: string
  ) => {
    setLoading(true);
    try {
      const response = await fetch(`${PORT}/categories/${categoryId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: categoryName }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Error desconocido al actualizar categoría"
        );
      }

      const oldCategory = category.find((cat) => cat.id === categoryId);
      const oldCategoryName = oldCategory?.name;

      setCategory((prev) =>
        prev.map((cat) =>
          cat.id === categoryId ? { ...cat, name: categoryName } : cat
        )
      );

      //Actualizo fotos para que la categoria nueva se vea en la galeria
      if (oldCategoryName) {
        const updatedFotos = fotos.map((foto) =>
          foto.category?.name === oldCategoryName
            ? { ...foto, category: { ...foto.category, name: categoryName } }
            : foto
        );
        setFotos(updatedFotos);
      }

      toast.success("Categoría actualizada correctamente.", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
          height: "50px",
          width: "300px",
          backgroundColor: "#6666662f",
          fontFamily: "afacad",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";

      console.error("Error al actualizar la categoría:", error);
      toast.error(errorMessage || "Ocurrió un error inesperado.", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
          height: "50px",
          width: "300px",
          backgroundColor: "#6666662f",
          fontFamily: "afacad",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePutIds = async (ids: number[]) => {
    if (ids.length !== 2) {
      alert("no se recibieron ids en handlePutIds");
      return;
    }
    setLoading(true);
    const idsObjet = {
      id1: ids[0],
      id2: ids[1],
    };

    try {
      let response;
      if (selectedCategory) {
        response = await fetch(`${PORT}/photos/updateorder`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(idsObjet),
          credentials: "include",
        });
      } else {
        response = await fetch(`${PORT}/photos/updateorderglobal`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(idsObjet),
          credentials: "include",
        });
      }

      if (!response.ok) {
        throw new Error("Error al intercambiar fotos");
      }
      const data = await response.json();
      if (data.photos) {
        setFotos(data.photos);
        setActiveFotos(data.photos.filter((fotos: Ifotos) => fotos.active));
        setInactiveFotos(data.photos.filter((fotos: Ifotos) => !fotos.active));
      }
    } catch (error) {
      console.error("Error al intercambiar fotos:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleDrop = async (
    event: React.DragEvent<HTMLDivElement>,
    dropTargetId: number
  ) => {
    event.preventDefault();

    const draggedIdStr = event.dataTransfer.getData("text/plain");
    const draggedId = parseInt(draggedIdStr, 10);

    // Evita acciones innecesarias o duplicadas
    if (!draggedId || !dropTargetId || draggedId === dropTargetId) return;

    const idsToSwap = [draggedId, dropTargetId];
    await handlePutIds(idsToSwap);
  };

  // Nueva función para manejar drag start
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: number) => {
    e.dataTransfer.setData("text/plain", id.toString());
    document.querySelectorAll(".clone").forEach((c) => c.remove()); // Limpieza previa

    const img = e.currentTarget.cloneNode(true) as HTMLElement;
    const imagen = img.querySelector("img") as HTMLImageElement;
    imagen.style.height = "10rem";
    imagen.style.width = "15rem";
    imagen.style.borderRadius = "5px";
    imagen.style.border = "1px solid #000000";
    imagen.style.position = "absolute";
    imagen.style.top = "-99999px";
    imagen.classList.add("clone");
    document.body.appendChild(imagen);
    e.dataTransfer.setDragImage(imagen, 0, 0);
  };
  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const clones = document.querySelectorAll(".clone");
    clones.forEach((clone) => clone.remove());
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    handleAutoScroll(e);
  };

  const handleAutoScroll = (event: React.DragEvent<HTMLDivElement>) => {
    const scrollContainer = document.getElementById("scroolPersonalizado");
    const threshold = 100; // Margen de sensibilidad en px
    const scrollSpeed = 10;

    if (!scrollContainer) return;

    const rect = scrollContainer.getBoundingClientRect();
    const mouseY = event.clientY;

    const maxScrollTop =
      scrollContainer.scrollHeight - scrollContainer.clientHeight;

    if (mouseY < rect.top + threshold) {
      scrollContainer.scrollTop = Math.max(
        0,
        scrollContainer.scrollTop - scrollSpeed
      );
    } else if (mouseY > rect.bottom - threshold) {
      scrollContainer.scrollTop = Math.min(
        maxScrollTop,
        scrollContainer.scrollTop + scrollSpeed
      );
    }
  };

  //funcion para el mapeo de estados de las fotos
  const getFotosToDisplay = () => {
    if (categoryPage) {
      if (!selectedCategory) return [];

      if (inactiveInCategory) {
        const inactiveFotosInCategory = localFoto.filter(
          (foto: Ifotos) => foto.active === false
        );
        return inactiveFotosInCategory;
      }

      return localFoto.filter((foto: Ifotos) => foto.active === true);
    }
    if (filterType === "active") {
      return activeFotos;
    }

    if (filterType === "inactive") {
      return inactiveFotos;
    }

    return globalFotos;
  };

  const delays = ["delay-300", "delay-500", "delay-700", "delay-1000"];

  return (
    <div className="w-[330px] flex justify-center items-center sm:w-[455px] justify-center md:w-[600px] lg:w-[850px] xl:w-[1110px] 2xl:w-[1300px] absolute top-16 z-50 flex justify-center items-center">
      {categoryPage ? (
        <CustomSelectCategory
          clasName="animate-fade-right"
          style={{
            color: "white",
            backgroundColor: "transparent",
            outline: "none",
            letterSpacing: "0.5px",
          }}
          onChange={handleCategoryChange}
          onRequestDeleteCategory={handleRequestDelete}
        />
      ) : (
        <div>
          <IsActiveFotoBtn
            onClickActive={() => setFilterType("active")}
            onClickInactive={() => setFilterType("inactive")}
            onClickAll={() => setFilterType("all")}
            active={filterType}
          />
        </div>
      )}
      {categoryPage && selectedCategory && (
        <div className=" flex items-center justify-end text-white tracking-wide absolute top-[-26px] gap-1 lg:gap-2 xl:gap-3 text-[10px]">
          <label
            htmlFor="categoryName"
            className="text-sm hidden md:block lg:block xl:block"
          >
            Fotos en categoría:{" "}
          </label>

          <input
            id="categoryName"
            type="text"
            className="text-white text-center bg-transparent outline-none uppercase border border-gray-400 rounded w-[130px] lg:w-[140px] xl:w-[150px]  backdrop-blur-sm animate-pulse"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
          />

          <button
            onClick={() =>
              confirmUpdateCategory(selectedCategory?.id as number, editedName)
            }
            className="hover:text-gray-400 transition duration-300 ease-in-out text-white text-center bg-transparent outline-none uppercase flex items-center gap-3 justify-center border border-gray-400 rounded w-[140px] lg:w-[150px] xl:w-[200px] backdrop-blur-sm"
          >
            CAMBIAR NOMBRE
            <div>
              <ArrowDownUpIcon data-tip="Guardar" className="w-5 h-5" />
            </div>
          </button>

          <button
            onClick={() => setInactiveInCategory(!inactiveInCategory)}
            className="backdrop-blur-sm border border-gray-400 hover:border-gray-500 transition duration-300 ease-in-out rounded w-[130px] lg:w-[140px] xl:w-[150px]  animate-pulse "
          >
            {inactiveInCategory ? "SUBIDAS" : " BORRADORES"}
          </button>
        </div>
      )}

      {login ? (
        <OverlayScrollbarsComponent
          id="scroolPersonalizado"
          options={{ scrollbars: { autoHide: "scroll" } }}
          style={{
            maxHeight: "80vh",
            height: "74vh",
            overflowY: "auto",
            transition: "duration 300ms ease in-out",
          }}
        >
          <div className="grid grid-cols-1 gap-2 font-afacad rounded h-full justify-items-center items-center sm:w-full sm:grid-cols-2 md:w-full lg:w-full lg:grid-cols-3 xl:w-full lg:grid-cols-3 flex flex-wrap justify-center">
            {getFotosToDisplay().length === 0 ? (
              <div className="text-white/70 font-bold tracking-wider text-center font-afacad text-xl flex items-center justify-center absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-fade-in animate-pulse">
                No hay fotos en esta seccion
              </div>
            ) : (
              getFotosToDisplay().map((foto, index) => (
                <div
                  key={foto.id}
                  className={`animate-fade-in ${delays[index % delays.length]}`}
                >
                  <Card
                    key={foto.id}
                    id={foto.id}
                    url={foto.url!}
                    title={foto.title!}
                    history={foto.history}
                    category={foto.category}
                    createdAt={foto.createdAt}
                    active={foto.active}
                    handleDelete={() => confirmDelete(foto.id as number)}
                    handleUpdate={() => handleUpdate(foto.id as number)}
                    handleModal={() => toggleModal(foto as Ifotos)}
                    onDragOver={
                      filterType === "all" && !categoryPage
                        ? undefined
                        : handleDragOver
                    }
                    onDrop={
                      filterType === "all" && !categoryPage
                        ? undefined
                        : handleDrop
                    }
                    onDragStart={
                      filterType === "all" && !categoryPage
                        ? undefined
                        : handleDragStart
                    }
                    onDragEnd={
                      filterType === "all" && !categoryPage
                        ? undefined
                        : handleDragEnd
                    }
                  />
                </div>
              ))
            )}
            <ConfirmModal
              isOpen={openModalDeleteCategory}
              onClose={() => setOpenModalDeleteCategory(false)}
              onConfirm={handleDeleteCategory}
              title={"Eliminar"}
              message={"Estas seguro de eliminar esta categoría?"}
            />
            <ConfirmModal
              isOpen={modalIsOpen}
              onClose={() => setModalIsOpen(false)}
              onConfirm={handleConfirmDelete}
              title={"Eliminar"}
              message={"Estas seguro de eliminar esta foto?"}
            />
            <ConfirmModal
              isOpen={updateModalIsOpen}
              onClose={() => setUpdateModalIsOpen(false)}
              onConfirm={handleConfirmUpdateCategory}
              title={"Confirmar modificación"}
              message={`¿Quieres actualizar el nombre de la categoría a "${categoryUpdateData?.name}"?`}
            />
          </div>
          <Modal isOpen={isModalOpen} onClose={() => toggleModal(null)}>
            <div
              className=" 
              xl:w-[40vw] xl:h-[auto]
              lg:w-[48vw] lg:h-[auto]
              md:w-[58w] md:h-[auto]
              sm:w-[64vw] sm:h-[auto]
              w-[79vw] h-[auto] bg-transparent
              flex justify-center items-center animate-fade-in"
            >
              <Image
                className="bg-gray-100 w-full h-full object-cover rounded-sm"
                src={imageUrl}
                alt={title || "Imagen"}
                width={4120}
                height={2848}
              />
            </div>
          </Modal>
        </OverlayScrollbarsComponent>
      ) : (
        <div className="flex justify-center items-center">
          <Loader />
        </div>
      )}
    </div>
  );
}
