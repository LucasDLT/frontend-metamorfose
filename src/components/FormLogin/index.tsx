"use client";
import { useForm } from "react-hook-form";
import { loginSchema } from "@/validation/loginSchema";
import { Inputs } from "@/types/typeErrors";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useState } from "react";
import { Context } from "@/context/context";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { EyeOff, Eye } from "lucide-react";

interface FormLoginProps {
  setToggle: React.Dispatch<React.SetStateAction<boolean>>;
}
export const FormLogin: React.FC<FormLoginProps> = ({ setToggle }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({ resolver: zodResolver(loginSchema) });

  const { setLogin, setLoading } = useContext(Context);
  const [isOpenEyes, setIsOpenEyes] = useState(false);
  const router = useRouter();
  const PORT = process.env.NEXT_PUBLIC_API_URL;

  async function postForm(data: Inputs) {
    try {
      const response = await fetch(`${PORT}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!response.ok) {
        const errorResponse = await response.text();
        throw new Error("Hubo un error en la solicitud" + errorResponse);
      }
      document.cookie = "isLogin=true; path=/";
      setLogin(true);
      toast.success("Bienvenida", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
          height: "25px",
          width: "200px",
          backgroundColor: "#6666662f",
          fontFamily: " afacad",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
      });
      router.push("/");
    } catch (error) {
      toast.error("email o contraseñas invalidos, vuelve a intentarlo", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
          height: "50px",
          width: "300px",
          backgroundColor: "#6666662f",
          fontFamily: " afacad",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
      });
      throw new Error("Hubo un error en la solicitud", { cause: error });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(postForm)}
        className="grid justify-center mx-auto p-4 w-64 bg-gradient-to-t from-black/80 to-black/10 backdrop-blur-sm rounded-b z-50 animate-fade-in"
      >
        <label className="text-white  text-center m-6">LOGIN</label>

        <label className="text-white text-xs" htmlFor="email">
          EMAIL *
        </label>
        <input
          type="email"
          id="email"
          {...register("email")}
          className="rounded text-black"
        />
        {errors.email ? (
          <p className="text-red-500 text-xs">{errors.email?.message}</p>
        ) : (
          <p className="text-white text-xs my-2"> </p>
        )}

        <label className="text-white text-xs" htmlFor="password">
          PASSWORD *
        </label>
        <div className="relative">
          <input
            type={isOpenEyes ? "text" : "password"}
            id="password"
            {...register("password")}
            className="rounded text-black pr-10 w-full"
          />
          <button
            type="button"
            onClick={() => setIsOpenEyes((prev) => !prev)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black"
          >
            {isOpenEyes ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {errors.password?.message ? (
          <p className="text-red-500 text-xs">{errors.password?.message}</p>
        ) : (
          <p className="text-white text-xs my-2"></p>
        )}
        <button className="text-white border-gray-600 border-b m-auto w-20 h-7 hover:border-none flex justify-center items-center p-2 m-1 rounded-lg">
          sign in
        </button>
        <h3 className="text-xs text-white text-center">
          ¿no estas registrado? hacelo
          <button
            type="button"
            className="text-blue-500 m-1"
            onClick={() => setToggle(true)}
          >
            aqui
          </button>
        </h3>
        <h4 className="text-xs text-white text-center">
          campos marcados con (*) son obligatorios
        </h4>
      </form>
    </>
  );
};
