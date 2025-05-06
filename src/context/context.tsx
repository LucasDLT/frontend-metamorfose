"use client";

import { useState, useEffect, createContext, ReactNode } from "react";

export interface Ilogin {
  login?: boolean;
}
export interface Ifotos {
  id?: number;
  title?: string;
  history?: string;
  url?: File | null;
  createdAt?: string;
  active?: boolean;
  category?: ICategory | null | undefined;
  globalOrder?: number;
  categoryOrder?: number;
}
export interface ICategory {
  id: number;
  name: string;
  images?: Ifotos[];
}
export interface IContextProps {
  login: boolean;
  setLogin: (login: boolean) => void;
  fotos: Ifotos[] | [];
  setFotos: (fotos: Ifotos[]) => void;
  category: ICategory[] | [];
  setCategory: (category: ICategory[] | ((prevCategories: ICategory[]) => ICategory[])) => void;
  loading: boolean;
  error: string | null;
  selectedCategory: ICategory | null ;
  setSelectedCategory: (category: ICategory | null) => void;
  categoryPage:boolean;
  setCategoryPage: (category: boolean) => void;
  globalFotos: Ifotos[] | [];
  setGlobalFotos: (fotos: Ifotos[]) => void;
}
export const Context = createContext<IContextProps>({} as IContextProps);

export interface IContextProvider {
  children: ReactNode;
}

export const ContextProvider = ({ children }: IContextProvider) => {
  const PORT = process.env.NEXT_PUBLIC_API_URL;

  const [login, setLogin] = useState<boolean>(false); // Estado de inicio de sesión
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fotos, setFotos] = useState<Ifotos[]>([]);
  const [globalFotos, setGlobalFotos] = useState<Ifotos[]>([]); // Fotos globales
  const [category, setCategory] = useState<ICategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);
  const [categoryPage, setCategoryPage] = useState<boolean>(false);
  const [hasMounted, setHasMounted] = useState<boolean>(false);
 
  const value = {
    login,
    setLogin,
    fotos,
    setFotos,
    category,
    setCategory,
    loading,
    error,
    setSelectedCategory,
    selectedCategory,
    categoryPage,
    setCategoryPage,
    globalFotos,
    setGlobalFotos
  };

  const getCategory = async (login:boolean) => {
    if (!login) return;
    try {
      const response = await fetch(`${PORT}/categories`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (!response.ok)
        throw new Error("Error en la solicitud de categorias en Contexto");

      const data: ICategory[] = await response.json();
      setCategory(data || []);
    } catch (error) {
      throw new Error("Error al obtener las categorias", { cause: error });
    }
  };

  const getPhotos = async (login: boolean) => {
    if (!login) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${PORT}/photos`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok)
        throw new Error("Error en la solicitud: Fotos del contexto");

      const data: Ifotos[] = await response.json();
      setFotos(data || []);
    } catch (error) {
      setError("Ocurrió un error al obtener las fotos");
      throw new Error("Error al obtener las fotos", { cause: error });
    } finally {
      setLoading(false);
    }
  };
  

  // Leer el token desde localStorage al montar
  useEffect(() => {
    const checkSession = async () => {
      try{
        const res = await fetch(`${PORT}/session`, {
          method: "GET",
          credentials: "include",
        })
        if (res.ok) {
          setLogin(true);
        } else {
          setLogin(false);
          
        }
      }catch (error) {
        console.error("Error al verificar la sesión:", error);
        
        setLogin(false);
      } finally {
        setHasMounted(true);
      }
    };

    checkSession();
  }, []);
 

  // Reacciona al cambio de token
  useEffect(() => {
    if (!login) {
      setLogin(false);
      setFotos([]);
      setCategory([]);
      return;
    }
    setLogin(true);
    getPhotos(login)
    getCategory(login);
  }, [login]);

  // Evita render hasta montar
  if (!hasMounted) return null;

  return <Context.Provider value={value}>{children}</Context.Provider>;
};
