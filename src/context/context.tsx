"use client";
import { useState, useEffect, createContext, ReactNode } from "react";
import { Loader } from "@/components/Loader";
import { PortalWrapper } from "@/components/PortalWrapper";

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
  setCategory: (
    category: ICategory[] | ((prevCategories: ICategory[]) => ICategory[])
  ) => void;
  loading: boolean;
  globalError: string | null;
  selectedCategory: ICategory | null;
  setSelectedCategory: (category: ICategory | null) => void;
  categoryPage: boolean;
  setCategoryPage: (category: boolean) => void;
  globalFotos: Ifotos[] | [];
  setGlobalFotos: (fotos: Ifotos[]) => void;
  activeFotos: Ifotos[] | [];
  setActiveFotos: (fotos: Ifotos[]) => void;
  inactiveFotos: Ifotos[] | [];
  setInactiveFotos: (fotos: Ifotos[]) => void;
  getActiveFotos: (login: boolean) => Promise<void>;
  getInactiveFotos: (login: boolean) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setGlobalError: (error: string | null) => void;
  getCategory: (login: boolean) => Promise<void>;
}
export const Context = createContext<IContextProps>({} as IContextProps);

export interface IContextProvider {
  children: ReactNode;
}

export const ContextProvider = ({ children }: IContextProvider) => {
  const PORT = process.env.NEXT_PUBLIC_API_URL;

  const [login, setLogin] = useState<boolean>(false); // Estado de inicio de sesión
  const [loading, setLoading] = useState<boolean>(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [fotos, setFotos] = useState<Ifotos[]>([]);
  const [globalFotos, setGlobalFotos] = useState<Ifotos[]>([]); // Fotos globales
  const [category, setCategory] = useState<ICategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
    null
  );
  const [categoryPage, setCategoryPage] = useState<boolean>(false);
  const [activeFotos, setActiveFotos] = useState<Ifotos[]>([]);
  const [inactiveFotos, setInactiveFotos] = useState<Ifotos[]>([]);

  const getCategory = async (login: boolean) => {
    if (!login) return;
    setLoading(true);
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
      setGlobalError("Ocurrio un error al obtener las categorias");
      throw new Error("Error al obtener las categorias", { cause: error });
    } finally {
      setLoading(false);
    }
  };

  const getPhotos = async (login: boolean) => {
    if (!login) return;
    setLoading(true);
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
      setGlobalError("Ocurrió un error al obtener las fotos");
      throw new Error("Error al obtener las fotos", { cause: error });
    } finally {
      setLoading(false);
    }
  };

  const getActiveFotos = async (login: boolean) => {
    if (!login) return;
    setLoading(true);
    try {
      const response = await fetch(`${PORT}/photos/active`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data: Ifotos[] = await response.json();
      console.log("fotos activas", data);

      setActiveFotos(data || []);
    } catch (error) {
      setGlobalError("Ocurrio un error al obtener las fotos activas");
      throw new Error("Error al obtener las fotos activas", { cause: error });
    } finally {
      setLoading(false);
    }
  };

  const getInactiveFotos = async (login: boolean) => {
    if (!login) return;
    setLoading(true);
    try {
      const response = await fetch(`${PORT}/photos/inactive`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data: Ifotos[] = await response.json();
      console.log("fotos inactivas", data);

      setInactiveFotos(data || []);
    } catch (error) {
      setGlobalError("Ocurrio un error al obtener las fotos activas");
      throw new Error("Error al obtener las fotos activas", { cause: error });
    } finally {
      setLoading(false);
    }
  };

  // Leer el token desde el backend al montar
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch(`${PORT}/session`, {
          method: "GET",
          credentials: "include",
        });
        if (res.ok) {
          setLogin(true);
          document.cookie = "isLogin=true; path=/; SameSite=Lax";
        } else {
          setLogin(false);
          document.cookie =
            "isLogin=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
      } catch (error) {
        console.error("Error al verificar la sesión:", error);
        setLogin(false);
        document.cookie =
          "isLogin=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
    };

    checkSession();
  }, []);

  // Reacciona al cambio de token
  useEffect(() => {
    if (login) {
      getPhotos(login);
      getCategory(login);
      getActiveFotos(login);
      getInactiveFotos(login);
    } else {
      setFotos([]);
      setCategory([]);
      getActiveFotos(false);
      getInactiveFotos(false);
    }
  }, [login]);

  const value = {
    login,
    setLogin,
    fotos,
    setFotos,
    category,
    setCategory,
    loading,
    setLoading,
    globalError,
    setGlobalError,
    setSelectedCategory,
    selectedCategory,
    categoryPage,
    setCategoryPage,
    globalFotos,
    setGlobalFotos,
    activeFotos,
    setActiveFotos,
    inactiveFotos,
    setInactiveFotos,
    getActiveFotos,
    getInactiveFotos,
    getCategory,
  };

  return (
    <Context.Provider value={value}>
      {<PortalWrapper >(
        loading && (
            <Loader />
        )      )
      </PortalWrapper>}
      {children}
    </Context.Provider>
  );
};
