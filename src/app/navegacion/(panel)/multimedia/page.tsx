"use client";
import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Context, ICategory, Ifotos } from "@/context/context";
import { Card } from "@/components/Card";
import { Modal } from "@/components/Modal";
import Image from "next/image";
import { ConfirmModal } from "@/components/ConfirmModal";
import { PencilLine } from 'lucide-react';
import {CustomSelectCategory} from "@/components/CustomSelectCategory";
import { toast } from "sonner";


export default function Multimedia() {
  const { token, fotos, setFotos, loading, error, selectedCategory, setSelectedCategory, categoryPage, globalFotos, setGlobalFotos, setCategory, category } = useContext(Context);
  const [localFoto, setLocalFoto] = useState<Ifotos[]>([]);  // Fotos por categoría
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedFoto, setSelectedFoto] = useState<Ifotos | null>(null);
  const [idSelected, setIdSelected] = useState<number[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [fotoIdToDelete, setFotoIdToDelete] = useState<number | null>(null);
  const [editedName, setEditedName] = useState(selectedCategory?.name || "");
  const [updateModalIsOpen, setUpdateModalIsOpen] = useState<boolean>(false);
const [categoryUpdateData, setCategoryUpdateData] = useState<{ id: number; name: string } | null>(null);


  useEffect(() => {
    setEditedName(selectedCategory?.name || ""); // Cada vez que cambia la categoría seleccionada, reseteamos
  }, [selectedCategory]);
  
  const idslength = idSelected?.length;
  const PORT = process.env.NEXT_PUBLIC_API_URL;



  const handleCheckboxChange = (fotoId: number, checked: boolean) => {
    if (checked) {
      setIdSelected((prevIds) => [...prevIds, fotoId]);
    } else {
      setIdSelected((prevIds) => prevIds.filter((id) => id !== fotoId));
    }
  };

  const handlePutIds = async (ids: number[]) => {
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
            Authorization: `Bearer ${token?.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(idsObjet),
        });
      } else {
        response = await fetch(`${PORT}/photos/updateorderglobal`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token?.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(idsObjet),
        });
      }

      if (!response.ok) {
        throw new Error("Error al intercambiar fotos");
      }
      const data = await response.json();
      if (data.photos) {
        setFotos(data.photos);
        setIdSelected([]);
      }
    } catch (error) {
      console.error("Error al intercambiar fotos:", error);
    }
  };

  const toggleModal = (foto: Ifotos | null) => {
    setSelectedFoto(foto);
    setIsModalOpen(!isModalOpen);
  };

  const router = useRouter();

  const handleDelete = async (id: number) => {
    console.log("foto eliminada", id);
    if (loading) return <div>Cargando fotos...</div>;
    if (error) return <div>{error}</div>;

    try {
      const response = await fetch(`${PORT}/photos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token?.token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.photos) {
        setFotos(data.photos);
      }
      if (category.length > 0) {
        const updatedCategories = category.map((cat) => {
          const hasPhotos = data.photos.some((foto: Ifotos) => foto.category?.id === cat.id);
          return {
            ...cat,
            images: hasPhotos ? (cat.images || []) : [], // Si no hay fotos, images queda vacío
          };
        });
        setCategory(updatedCategories);
      }
    
    } catch (error) {
      console.error(error);
    }
  };
  
  
  const confirmDelete = (id: number) => {
    setFotoIdToDelete(id);
    setModalIsOpen(true);
  };

  const handleConfirmDelete = async (event: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    if (fotoIdToDelete == null) return
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
    if (token && token.token) {
      if (selectedCategory) {
        const filteredFotos = fotos.filter((foto) => foto.category?.id === selectedCategory.id );
        // Si hay una categoría seleccionada, usa las fotos de esa categoría
        setLocalFoto(
          filteredFotos.sort((a, b) => (a.categoryOrder || 0) - (b.categoryOrder || 0))
        );
      } else {
        // Si no hay categoría seleccionada, usa todas las fotos y ordena globalmente
        setGlobalFotos(
          fotos.sort((a, b) => (a.globalOrder || 0) - (b.globalOrder || 0))
        );
      }
    }
  }, [fotos, token, selectedCategory]);
  
  const handleCategoryChange = (selectedCategory: ICategory | null) => {
    if (selectedCategory !== null) {
      setSelectedCategory(selectedCategory);
    } else {
      setSelectedCategory(null);
    }
  };
  const handleConfirmUpdateCategory = async (event: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    if (!categoryUpdateData) return;
  
    await handleUpdateCategory(categoryUpdateData.id, categoryUpdateData.name);
    setUpdateModalIsOpen(false);
    setCategoryUpdateData(null);
  };
  

  const handleUpdateCategory = async (categoryId: number, categoryName: string) => {
 
  
    try {
      const response = await fetch(`${PORT}/categories/${categoryId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token?.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: categoryName }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Error desconocido al actualizar categoría");
      }
  
      const oldCategory = category.find(cat => cat.id === categoryId);
      const oldCategoryName = oldCategory?.name;
  
      setCategory(prev =>
        prev.map(cat =>
          cat.id === categoryId ? { ...cat, name: categoryName } : cat
        )
      );
  
      //Actualizo fotos para que la categoria nueva se vea en la galeria
      if (oldCategoryName) {
        const updatedFotos = fotos.map(foto => 
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
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
  
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
  
  
  return (
    <div className="absolute top-16 right-[-9rem] left-[9rem] z-50">
   
        {categoryPage && 
    (<CustomSelectCategory
        style={{color: 'white', backgroundColor: 'transparent', outline: 'none', letterSpacing: '0.5px', position: 'absolute', top: '0px', left: '-103px'}}
        onChange={handleCategoryChange}
      />)
      }
{categoryPage && selectedCategory && (
  <div className="flex items-center text-white tracking-wide absolute top-[-33px]">
    <label htmlFor="categoryName">Fotos en categoría: </label>

    <input
      id="categoryName"
      type="text"
      className="text-white bg-transparent outline-none uppercase"
      value={editedName}
      onChange={(e) =>
        setEditedName(e.target.value)
      }
    />

<button
      onClick={() => confirmUpdateCategory(selectedCategory?.id as number, editedName)}
      className="hover:text-red-700 transition duration-300 ease-in-out"
    >
      <PencilLine className="w-5 h-5" />
    </button>
  </div>
)}

      {token ? (                                                
        <div
          className="grid grid-cols-3 font-afacad backdrop-blur-sm bg-black/50 rounded "
          style={{ scrollBehavior: "smooth",
            maxHeight: "80vh",
            height: "76vh",
            overflowY: "auto",
           }}
        >
              


          {/* Muestra las fotos de la categoría seleccionada o las fotos globales */}
          {selectedCategory ? (
            localFoto.map((foto) => (
              <Card
                key={foto.id}
                url={foto.url!}
                title={foto.title!}
                history={foto.history}
                category={foto.category}
                createdAt={foto.createdAt}
                active={foto.active}
                handleDelete={() => confirmDelete(foto.id as number)}
                handleUpdate={() => handleUpdate(foto.id as number)}
                handleModal={() => toggleModal(foto as Ifotos)}
                checked={idSelected.includes(foto.id as number)}
                handleChecked={(e) =>
                  handleCheckboxChange(foto.id as number, e.target.checked)
                }
              />
            ))
          ) : (
            globalFotos.map((foto) => (
              <Card
                key={foto.id}
                url={foto.url!}
                title={foto.title!}
                history={foto.history}
                category={foto.category}
                createdAt={foto.createdAt}
                active={foto.active}
                handleDelete={() => confirmDelete(foto.id as number)}
                handleUpdate={() => handleUpdate(foto.id as number)}
                handleModal={() => toggleModal(foto as Ifotos)}
                checked={idSelected.includes(foto.id as number)}
                handleChecked={(e) =>
                  handleCheckboxChange(foto.id as number, e.target.checked)
                }
              />
            ))
          )}
        </div>
      ) : (
        <h1>No te encontras registrado</h1>
      )}
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
      {idslength === 2 && (
        <button onClick={() => handlePutIds(idSelected)} className=" absolute top-[-4.5%]  right-2  transform hover:scale-110 transition duration-500 ease-in-out font-afacad fixed z-60  animate-pulse ">
          REORDENAR
        </button>
      )}
          <ConfirmModal 
           isOpen={(modalIsOpen)}
           onClose={() => setModalIsOpen(false)} 
           onConfirm={handleConfirmDelete} 
           title={"Eliminar"} 
           message={"Estas seguro de eliminar esta foto?"} />
          
  <ConfirmModal
    isOpen={(updateModalIsOpen)}
    onClose={() => setUpdateModalIsOpen(false)}
    onConfirm={handleConfirmUpdateCategory}
    title={"Confirmar modificación"}
    message={`¿Quieres actualizar el nombre de la categoría a "${categoryUpdateData?.name}"?`}
  />


    </div>
  );
}
