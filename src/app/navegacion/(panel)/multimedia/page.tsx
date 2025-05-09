"use client";
import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Context, ICategory, Ifotos } from "@/context/context";
import { Card } from "@/components/Card";
import { Modal } from "@/components/Modal";
import Image from "next/image";
import { ConfirmModal } from "@/components/ConfirmModal";
import { PencilLine } from "lucide-react";
import { CustomSelectCategory } from "@/components/CustomSelectCategory";
import { toast } from "sonner";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { IsActiveFotoBtn } from "@/components/IsAtiveFotoBtn";

export default function Multimedia() {
  const {
    login,
    fotos,
    setFotos,
    loading,
    error,
    selectedCategory,
    setSelectedCategory,
    categoryPage,
    globalFotos,
    setGlobalFotos,
    setCategory,
    category,
    activeFotos,
    inactiveFotos,
  } = useContext(Context);
  const [localFoto, setLocalFoto] = useState<Ifotos[]>([]); // Fotos por categoría
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedFoto, setSelectedFoto] = useState<Ifotos | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [fotoIdToDelete, setFotoIdToDelete] = useState<number | null>(null);
  const [editedName, setEditedName] = useState(selectedCategory?.name || "");
  const [filterType, setFilterType] = useState<"active" | "inactive" | "all">("all");
  const [updateModalIsOpen, setUpdateModalIsOpen] = useState<boolean>(false);
  const [categoryUpdateData, setCategoryUpdateData] = useState<{
    id: number;
    name: string;
  } | null>(null);
  

  const router = useRouter();

  
  useEffect(() => {
    setEditedName(selectedCategory?.name || ""); // Cada vez que cambia la categoría seleccionada, reseteamos
  }, [selectedCategory]);
  
  const PORT = process.env.NEXT_PUBLIC_API_URL;




 
  const toggleModal = (foto: Ifotos | null) => {
    setSelectedFoto(foto);
    setIsModalOpen(!isModalOpen);
  };


  const handleDelete = async (id: number) => {
    console.log("foto eliminada", id);
    if (loading) return <div>Cargando fotos...</div>;
    if (error) return <div>{error}</div>;

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
        toast.success("Foto eliminada",{
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
    console.log("fotoIdToDelete", fotoIdToDelete);

    await handleDelete(fotoIdToDelete);
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
          filteredFotos.sort((a: Ifotos, b: Ifotos) => b.categoryOrder! - a.categoryOrder!)
        );
      } else {
        // Si no hay categoría seleccionada, usa todas las fotos y ordena globalmente
        setGlobalFotos(
          fotos.sort((a: Ifotos, b: Ifotos) => b.globalOrder! - a.globalOrder!)
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
    try {
      const response = await fetch(`${PORT}/categories/${categoryId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: categoryName },
        ),
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
    }
  };
    
  const handlePutIds = async (ids: number[]) => {
    console.log("entre en la funcion handlePutIds y recibi los ids", ids);
    
    if (ids.length !== 2) {
      alert("no se recibieron ids en handlePutIds");
      return;
    }
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
      }
    } catch (error) {
      console.error("Error al intercambiar fotos:", error);
    }
  };
  const handleDrop = async (event: React.DragEvent<HTMLDivElement>, dropTargetId: number) => {
    event.preventDefault();
  
    const draggedIdStr = event.dataTransfer.getData("text/plain");
    const draggedId = parseInt(draggedIdStr, 10);
  
    console.log("Drop - id arrastrado:", draggedId, "id soltado:", dropTargetId);
  
    // Evita acciones innecesarias o duplicadas
    if (!draggedId || !dropTargetId || draggedId === dropTargetId) return;
  
    const idsToSwap = [draggedId, dropTargetId];
    await handlePutIds(idsToSwap);
  };
  
  
    // Nueva función para manejar drag start
const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: number) => {
  e.dataTransfer.setData("text/plain", id.toString());
  console.log("drag start", id);
  document.querySelectorAll(".clone").forEach(c => c.remove()); // Limpieza previa

  const img = e.currentTarget.cloneNode(true) as HTMLElement;
  const imagen= img.querySelector("img") as HTMLImageElement;
  imagen.style.height  = "10rem";
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
}
const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
  e.preventDefault();
  e.stopPropagation();
  handleAutoScroll(e);
}

const handleAutoScroll = (event: React.DragEvent<HTMLDivElement>) => {
  const scrollContainer = document.getElementById("scroolPersonalizado");
  const threshold = 100; // Margen de sensibilidad en px
  const scrollSpeed = 10;

  if (!scrollContainer) return;

  const rect = scrollContainer.getBoundingClientRect();
  const mouseY = event.clientY;

  const maxScrollTop = scrollContainer.scrollHeight - scrollContainer.clientHeight;

if (mouseY < rect.top + threshold) {
  scrollContainer.scrollTop = Math.max(0, scrollContainer.scrollTop - scrollSpeed);
} else if (mouseY > rect.bottom - threshold) {
  scrollContainer.scrollTop = Math.min(maxScrollTop, scrollContainer.scrollTop + scrollSpeed);
}

};

//funcion para el mapeo de estados de las fotos
const getFotosToDisplay = () => {
  if (categoryPage && selectedCategory) {
    return localFoto;
  }

  if (filterType === "active") {
    return activeFotos;
  }

  if (filterType === "inactive") {
    return inactiveFotos;
  }

  return globalFotos;
};


  return (
    <div className="absolute top-16 right-[-9rem] left-[9rem] z-50"

    >
      {categoryPage ? (
        <CustomSelectCategory
          style={{
            color: "white",
            backgroundColor: "transparent",
            outline: "none",
            letterSpacing: "0.5px",
            position: "absolute",
            top: "0px",
            left: "-103px",
          }}
          onChange={handleCategoryChange}
        />
      ): <IsActiveFotoBtn
      onClickActive={() => setFilterType("active")}
      onClickInactive={() => setFilterType("inactive")}
      onClickAll={() => setFilterType("all")}
      />
      }
      {categoryPage && selectedCategory && (
        <div className="flex items-center text-white tracking-wide absolute top-[-33px]">
          <label htmlFor="categoryName">Fotos en categoría: </label>

          <input
            id="categoryName"
            type="text"
            className="text-white bg-transparent outline-none uppercase"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
          />

          <button
            onClick={() =>
              confirmUpdateCategory(selectedCategory?.id as number, editedName)
            }
            className="hover:text-red-700 transition duration-300 ease-in-out"
          >
            <PencilLine className="w-5 h-5" />
          </button>
        </div>
      )}

      {login ? (
        <OverlayScrollbarsComponent
        id="scroolPersonalizado"
          options={{ scrollbars: { autoHide: "scroll" } }}
          style={{
            maxHeight: "80vh",
            height: "76vh",
            overflowY: "auto",
            transition: 'duration 300ms ease in-out '
          }}
        >
          <div 
          className="grid grid-cols-3 font-afacad  rounded h-full ">
           
                {getFotosToDisplay().map((foto) => (
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
                  
                  onDragOver={handleDragOver}
                  onDrop={handleDrop }
                  onDragStart={handleDragStart}  
                  onDragEnd={handleDragEnd}      
                  />
                ))}

 

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
              <div className=" w-[45vw] h-[70vh]  flex justify-center items-center">
                <Image
                  className="w-full h-full object-cover rounded-sm"
                  src={imageUrl}
                  alt={title || "Imagen"}
                  width={4120}
                  height={2848}
                />
              </div>
            </Modal>
        </OverlayScrollbarsComponent>
      ) : null}
    </div>
  );
}
