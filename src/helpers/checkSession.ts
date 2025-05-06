import { toast } from "sonner";

const PORT = process.env.NEXT_PUBLIC_API_URL;

export const checkSession = async () => {
  const response = await fetch(`${PORT}/session`, {
    credentials: "include",
  });
  const data = await response.json();
  console.log("data", data);
  
  data.autenticated &&
    toast.error("Ya estas logueado", {
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
  return data.autenticated;
};
