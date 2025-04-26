'use client'
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { Context } from "@/context/context";
import { useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";


export const LogoutBtn = () => {

      const router = useRouter();
      const { token, setToken } = useContext(Context);
    const logOut = () => {
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
        setToken(null);
        router.push("/");
      };
    
    return(
        <>
        {token && (
            <div className="relative">
              <Link href={"/"} onClick={logOut}>
                <LogOut className=" h7 w-4 hover:text-gray-500 hover:scale-110 transition duration-300 ease-in-out absolute top-[-65px] right-11" />
                
              </Link>
            </div>
          )}
        </>
    )
}