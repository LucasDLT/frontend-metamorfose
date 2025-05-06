'use client'
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { Context } from "@/context/context";
import { useContext } from "react";
import { useRouter } from "next/navigation";


export const LogoutBtn = () => {

      const router = useRouter();
      const { login, setLogin } = useContext(Context);
      const PORT = process.env.NEXT_PUBLIC_API_URL;

      const handleLogout = async () => {
        try {
          const response = await fetch(`${PORT}/logout`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          });
          if (!response.ok) {
            const errorResponse = await response.text();
            throw new Error("Hubo un error en la solicitud" + errorResponse);
          }
          setLogin(false);
          const data = await response.json();
          console.log("sesion cerrada", data);
          
          toast.warning("Adios!", {
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
          router.push("/");
        } catch (error) {
          console.error("Error al cerrar sesión:", error);
        }
      }
   
    
    return(
        <>
        {login === true && (
            <div className="relative">
              <button  onClick={handleLogout}>
                <LogOut className=" h7 w-4 hover:text-gray-500 hover:scale-110 transition duration-300 ease-in-out absolute top-[-65px] right-11" />
                
              </button>
            </div>
          )}
        </>
    )
}