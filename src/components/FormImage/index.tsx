"use client";
import { useEffect, useContext, useRef} from "react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Context, ICategory, Ifotos } from "@/context/context";
import { toast } from "sonner";
import { IformErrors } from "@/types/error.t";
import { validateCargaImgen } from "@/helpers/validate";
import { SelectCategory } from "@/components/selectCategory";
import Image from "next/image";
import {ImagePreview} from "../MemoPreview";
import {ConfirmModal} from "../ConfirmModal";

export interface IformImage {
  onSubmit: (
    formData: FormData,
    login: boolean
  ) => Promise<void>;
  defaultValue?: Ifotos;
  mode: "edit" | "create";
      numericId?: number

}



export function FormImage ({ onSubmit , defaultValue, mode }: IformImage) {
  const { setCategory, login, setLoading } = useContext(Context);
  const [error, setError] = useState<IformErrors>({});
  const [selectCategory, setSelectCategory] = useState<boolean>(true);
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [pendingFormData, setPendingFormData] = useState<FormData | null>(null);

  const MAX_HISTORY_LENGTH = 300;
  const pathName = usePathname();


  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [formImg, setFormImg] = useState<Ifotos>({
    title: "",
    history: "",
    category: null,
    url: null,
    createdAt: "",
    active: true,
  });

  useEffect(() => {
    setError({});
    if (mode === "edit" && defaultValue) {
      setFormImg(defaultValue);
    }
  }, [ mode, defaultValue]);

  useEffect(() => {
  if (image) {
    const url = URL.createObjectURL(image);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url); // evita fugas de memoria
  }
}, [image]);



  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    setFormImg({
      ...formImg,
      [event.target.name]: event.target.value,
    });
    setError((prev) => {
      const updatedErrors = { ...prev };
      delete updatedErrors[event.target.name as keyof IformErrors];
      return updatedErrors;
    });
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setFormImg({
        ...formImg,
        url: file,
      });
      setImage(file);// Actualiza el estado de la imagen
    }
    setError((prev) => {
      const updatedErrors = { ...prev };
      delete updatedErrors["url"];
      return updatedErrors;
    });
  };


  const handleActiveChange = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (selectCategory) {
      setFormImg({
        ...formImg,
        category: {
          id: 0,
          name: "",
        },
      });
      setSelectCategory(!selectCategory);
    }
    setError((prev) => {
      const updatedErrors = { ...prev };
      delete updatedErrors["active"];
      return updatedErrors;
    });
  };
  const handleCategoryChange = (category: ICategory | null) => {
    setFormImg({
      ...formImg,
      category: category,
    });
  };

  const handleCategoryInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.preventDefault();
    setFormImg({
      ...formImg,
      category: {
        id: 0,
        name: event.target.value,
      },
    });
    setError((prev) => {
      const updatedErrors = { ...prev };
      delete updatedErrors["category"];
      return updatedErrors;
    });
  };

  const handleTextAreaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (event.target.value.length > MAX_HISTORY_LENGTH) return;

    event.preventDefault();
    setFormImg({
      ...formImg,
      [event.target.name]: event.target.value,
    });
    setError((prev) => {
      const updatedErrors = { ...prev };
      delete updatedErrors[event.target.name as keyof IformErrors];
      return updatedErrors;
    });
  };
  const handleRemoveImage = () => {
    setFormImg({
      ...formImg,
      url: null,
    });
    setError((prev) => {
      const updatedErrors = { ...prev };
      delete updatedErrors["url"];
      return updatedErrors;
    });
    setPreviewUrl(null);
    
  };


  const handleFile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validateCargaImgen(formImg as Ifotos);
    setError(validationErrors);

    if (Object.keys(validationErrors).length) return;

    if (!formImg?.url) {
      toast.warning("No se ha seleccionado ningun archivo", {
        style: {
          borderRadius: "10px",
          background: "#000000dd",
          color: "#fff",
          height: "30px",
          width: "300px",
          backgroundColor: "#000000dd",
          fontFamily: " afacad",
        },
      });
      return;
    }

    const formData = new FormData();
    formData.append("title", formImg.title ?? "");
    formData.append("history", formImg.history ?? "");
    formData.append("category", formImg.category?.name ?? "");
    formData.append("createdAt", formImg.createdAt ?? "");
    formData.append("active", formImg.active?.toString() ?? "");
    if (formImg.url instanceof File) {
      formData.append("image", formImg.url);
    } else if (typeof formImg.url === "string") {
      // Es una edición y la imagen ya estaba guardada
      formData.append("existingImage", formImg.url);
    } else {
      toast.warning("No se ha seleccionado ninguna imagen", {
        style: {
          borderRadius: "10px",
          background: "#000000dd",
          color: "#fff",
          height: "30px",
          width: "300px",
          backgroundColor: "#000000dd",
          fontFamily: " afacad",
        },
      });
      return;
    }
    setPendingFormData(formData);
    setModalIsOpen(true);
    setPreviewUrl( null)
  };

  const handleConfirmSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!pendingFormData) return;
    setLoading(true);
    try {
      await onSubmit(pendingFormData, login);

     if (formImg.category?.id === 0) {
       // Usamos el valor actual del estado `categories` dentro de la función de actualización
       setCategory((prevCategories: ICategory[]) => {
         // Añadimos la categoría si no existe
         if (
           !prevCategories.some(
             (category: ICategory) => category.name === formImg.category?.name
           )
         ) {
           return [...prevCategories, formImg.category as ICategory];
         }
         return prevCategories; // Si ya existe, no la agregamos de nuevo
       });
     }

     if (mode === "create") {
         setFormImg({
           title: "",
           history: "",
           category: { id: 0, name: "" },
           url: null,
           createdAt: "",
           active: true,
         });
     }
     setError({});
     toast.success(
       mode==="create"
       ? "Imagen cargada exitosamente"
       : "Imagen actualizada exitosamente"
     , {
       style: {
         borderRadius: "10px",
         background: "#000000dd",
         color: "#fff",
         height: "30px",
         width: "300px",
         backgroundColor: "#000000dd",
         fontFamily: " afacad",
       },
     });
   } catch (error) {
     toast.error("Error al cargar la imagen", { duration: 5000 });
     throw new Error("error en el post de imagenes" + error);
   }finally{
     setLoading(false);
     setModalIsOpen(false);
     setPendingFormData(null);
     if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Limpia el input file manualmente
    }
   }
  }

  const getCounterColor = () => {
    const length = formImg.history?.length;
    const percentage = (length! / MAX_HISTORY_LENGTH) * 100;
  
    if (percentage >= 90) return "text-red-500";
    if (percentage >= 70) return "text-yellow-400";
    return "text-gray-400";
  };
  
  const formatDate = (dataString: string) => {
    const date = new Date(dataString);
    return date.toISOString().split("T")[0];
  }

  const confirmMessage =
  pathName.includes("carga")
    ? "Vas a cargar una imagen, ¿estás seguro?"
    : "Vas a modificar la imagen, ¿estás seguro?";

  const confirmTitle = pathName === "carga" ? "Cargar Imagen" : "Modificar Imagen";

  return (
    <>
    <form
      onSubmit={handleFile}
      className="absolute top-16 right-[-9rem] left-[9rem] flex flex-row rounded font-afacad items-center justify-between z-30"
      method="POST"
    >
      {/*bloque para la imagen */}
      <div className="grid place-items-center bg-gradient-to-t from-black to-black/10 p-2 rounded">
        <h1 className="text-3xl text-center font-bold text-white drop-shadow-[2px_2px_2px_black]">
          CARGA DE IMAGENES
        </h1>
        <label 
        htmlFor="url"          
        className="text-gray-300 pl-2 mt-1 background-black rounded cursor-pointer "
        >
          Seleccionar 
        </label>
        <input
          className="text-gray-300 pl-2 mt-1 background-black "
          type="file"
          name="url"
          id="url"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
          style={{ display: "none" }}
          
        />
        <div style={{ width: "300px", height: "400px", position: "relative" }}>
          {formImg?.url  instanceof File ? (
            <>
              <button
                type="button"
                onClick={handleRemoveImage}
                className="bg-black/30 hover:bg-black transition duration-300 ease-in-out  text-white text-xs px-2 py-1 rounded shadow absolute top-2 right-1"
              >
                X
              </button>
              <img
                src={URL.createObjectURL(formImg.url)}
                alt="previewCarga"
                className=" aspect-[1/1] object-cover rounded w-full h-full mt-1 pb-3 border-opacity-90 shadow-[0_0_20px_5px_rgba(0,0,0,0.8)] hover:shadow-none transition duration-300 ease-in-out"

              />
            </>
          ) : typeof formImg.url === "string" ? ( <>
            <button
              type="button"
              onClick={handleRemoveImage}
              className="bg-black/30 hover:bg-black transition duration-300 ease-in-out text-white text-xs px-2 py-1 rounded shadow absolute top-2 right-1"
            >
              X
            </button>
            <Image
              src={formImg.url}
              alt="previewEdit"
              className="aspect-[1/1] object-cover rounded w-full h-full mt-1 pb-3 border-opacity-90 shadow-[0_0_20px_5px_rgba(0,0,0,0.8)] hover:shadow-none transition duration-300 ease-in-out"
              width={500}
              height={500}
            />
          </>)
          : previewUrl? (
             
              <ImagePreview url={previewUrl} />
          ): null}
          {error.url && (
            <p className="text-red-600 text-center p-1 bg-black/60 mt-40 rounded drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
              {error.url}
            </p>
          )}
        </div>
      </div>
      {/*bloque para los datos adicionales */}
      <div className="flex flex-col items-center h-[480px] w-[300px]">
        <div className="flex flex-col bg-gradient-to-t from-black to-black/8 w-[250px] text-center rounded-t-lg
 p-2.5">
          <label htmlFor="title">TITULO</label>
          <input
            className="text-white bg-transparent border rounded border-gray-100 focus:outline-none"
            type="text"
            name="title"
            id="title"
            onChange={handleChange}
            value={formImg.title}
          />
        </div>
        <div className="flex flex-col bg-black/80 w-[250px] text-center  mt-1">
          <div className="flex flex-col p-2.5" >
          <label htmlFor="history">HISTORIA</label>
          <textarea
            name="history"
            id="history"
            onChange={handleTextAreaChange}
            value={formImg.history}
            className=" resize-none text-white bg-transparent border rounded border-gray-100 focus:outline-none "
            rows={3}
            cols={20}
            maxLength={MAX_HISTORY_LENGTH}
            
          />
          </div>
          <div className={`text-right text-xs mt-1 pr-2 ${getCounterColor()}`}>
          {formImg.history?.length}/{MAX_HISTORY_LENGTH}
          </div>
        </div>
        {/* bloque selector para la categoria */}

        {selectCategory ? (
          <div className="flex flex-col bg-black/80 h-[100px] w-[250px] text-center p-2.5  mt-1">
            <label className="mt-2" htmlFor="category">
              CREAR CATEGORIA
            </label>
            <input
              type="text"
              name="category"
              id="category"
              onChange={handleCategoryInputChange}
              value={formImg.category?.name.toUpperCase() || ""}
              className="text-white bg-transparent border border-gray-100  focus:outline-none animate-pulse"
            />
            <button
              onClick={handleActiveChange}
              className="hover:text-gray-500 text-white animate-pulse mt-2"
            >
              * seleccionar existente?
            </button>
          </div>
        ) : (
          <div className="flex flex-col bg-black/80 h-[100px] w-[250px] text-center p-2 rounded mt-1">
            <SelectCategory
              onChange={handleCategoryChange}
              value={formImg.category?.name || ""}
              style={{
                color: "white",
                backgroundColor: "transparent",
                outline: "none",
                textAlign: "center",
                marginTop: "10px",
                animation: "pulse 2s infinite",
              }}
            />
            <button
              onClick={() => setSelectCategory(true)}
              className="hover:text-gray-500 text-white animate-pulse mt-8"
            >
              * crear categoria?
            </button>
          </div>
        )}
        {/* bloque para la fecha y el active*/}
        <div className="grid grid-cols-2 text-center mt-1 w-[250px]">
          <div className="flex flex-col bg-black/80 rounded-bl-lg
 mr-1">
            <label htmlFor="createdAt">FECHA</label>
            <input
              type="date"
              name="createdAt"
              id="createdAt"
              onChange={handleChange}
              className="text-white bg-transparent focus:outline-none text-center p-1 text-sm"
              value={formImg.createdAt? formatDate(formImg.createdAt): ""}
            />
          </div>

          <div className="flex flex-col  bg-black/80 rounded-br-lg">
            <label htmlFor="active">VISIBLE</label>
            <select
              name="active"
              id="active"
              onChange={(e) => {
                setFormImg({
                  ...formImg,
                  active: e.target.value === "true",
                });
              }}
              value={formImg?.active?.toString()}
              className="text-white bg-transparent text-center focus:outline"
            >
              <option value="true" className="bg-zinc-900 hover:bg-gray-700">
                si
              </option>
              <option value="false" className="bg-zinc-900 hover:bg-gray-700">
                no
              </option>
            </select>
          </div>
        </div>
        <button className="text-sm  hover:text-gray-500 flex flex-col justify-center items-center rounded-lg  w-40 h-10 bg-gradient-to-t from-black to-zinc/10 ">
          CARGAR
        </button>
        {/* bloque para ver errores*/}
        <div className="flex flex-col w-[270px] rounded drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] ">
          {error.title && (
            <p className="text-red-500 pl-1 text-sm bg-black/70">
              {error.title}
            </p>
          )}

          {error.history && (
            <p className="text-red-500 pl-1 text-sm bg-black/70">
              {error.history}
            </p>
          )}

          {error.createdAt && (
            <p className="text-red-500 pl-1 text-sm bg-black/70">
              {error.createdAt}
            </p>
          )}

          {error.active && (
            <p className="text-red-500 pl-1 text-sm bg-black/70">
              {error.active}
            </p>
          )}
          {error.category && (
            <p className="text-red-500 pl-1 text-sm bg-black/70">
              {error.category}
            </p>
          )}
        </div>
      </div>
      {/* bloque para ver el preview*/}
      <div
        className="
     rounded flex flex-col gap-2 w-[300px] h-[480px] justify-start bg-gradient-to-t from-black to-black/10 overflow-hidden p-2
  "
      >

        <p className="text-3xl text-center font-bold text-white drop-shadow-[2px_2px_2px_black] mb-2">
          VISTA PREVIA
        </p>

        <div className="text-white text-sm ml-4">
          <p className="mb-1">
            <strong>TÍTULO:</strong> {formImg.title}
          </p>
          <p className="mb-1">
            <strong>CATEGORÍA:</strong>
            {formImg.category?.name.toUpperCase() || "no seleccionada"}
          </p>
          <p className="mb-1">
            <strong>FECHA:</strong> {formImg.createdAt}
          </p>

          <div className="mt-2">
            <strong>HISTORIA:</strong>
            <div className="max-h-[180px] overflow-y-auto overflow-x-hidden p-1 mt-1 rounded text-sm text-white whitespace-pre-wrap break-words">
              <p className="whitespace-pre-wrap">{formImg.history}</p>
            </div>
          </div>
        </div>
      </div>
    </form>
      <ConfirmModal isOpen={(modalIsOpen)} onClose={() => setModalIsOpen(false)} onConfirm={handleConfirmSubmit} title={confirmTitle} message={confirmMessage} />
      </>
    );
}

