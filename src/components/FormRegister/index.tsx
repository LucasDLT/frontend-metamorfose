"use client";
import { useState } from "react";
import { validateForm } from "@/helpers/validate";
import { Ierror } from "@/types/error.t";
import { Iuser } from "@/types/user.t";
import { toast } from "sonner";



interface IformRegisterProps {
  setToggle: React.Dispatch<React.SetStateAction<boolean>>;
}

export const FormRegister:React.FC<IformRegisterProps>=({setToggle})=> {
  const [form, setForm] = useState<Iuser>({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Ierror>({});



  const PORT = process.env.NEXT_PUBLIC_API_URL;

  function handleChange(event: React.FocusEvent<HTMLInputElement>) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }



  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors(validateForm(form));

    if (Object.keys(errors).length) {
      console.log(errors);

      return
    }
    const { confirmPassword, ...formData } = form;
    void confirmPassword
    try {
      const response = await fetch(`${PORT}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorResponse = await response.json();
        const errorMessage = errorResponse.message;
        console.error("Error en la solicitud:", errorMessage);
        throw new Error( errorMessage);
      }
      toast.success(`Registro exitoso` ,{ style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
        height: "25px",
        width: "200px",
        backgroundColor: "#6666662f",
        fontFamily:" afacad",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }});
      setToggle(false);
    }  catch (error: unknown) {
  if (error instanceof Error) {
    if (error.message.includes("Failed to fetch")) {
      toast.error("No se pudo conectar con el servidor. Intenta espera 60seg y vuelve a intentar.", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
          height: "40px",
          width: "300px",
          backgroundColor: "#6666662f",
          fontFamily: "afacad",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
      });
    } else {
      toast.error(error.message, {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
          height: "30px",
          width: "300px",
          backgroundColor: "#6666662f",
          fontFamily: "afacad",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
      });
    }
  }
}


  };

  return (
    <form
      id="formRegister"
      onSubmit={handleSubmit}
      method="post"
      className="grid justify-center mx-auto p-4 w-64 bg-gradient-to-t from-black/80 to-black/10 backdrop-blur-sm rounded-b z-50 animate-fade-in"
    >
      <label className="text-white p-4 text-center">REGISTRATE</label>

      <label className="text-xs">EMAIL *</label>
      <input
        type="text"
        value={form.email}
        name="email"
        placeholder=""
        onChange={handleChange}
       className="rounded text-black"
      />
      {errors.email ? <p className="text-red-500 text-xs">{errors.email}</p> : <p className="text-white text-xs my-2"></p>}

      <label className="text-xs mt-4">CONTRASEÑA *</label>
      <input
        type="text"
        value={form.password}
        name="password"
        placeholder=""
        onChange={handleChange}
        className="rounded text-black"
      />
      {errors.password ? <p className="text-red-500 text-xs">{errors.password}</p> : <p className="text-white text-xs my-2"></p>}

      <label className="text-xs mt-4">CONFIRMAR *</label>
      <input
        type="text"
        value={form.confirmPassword}
        name="confirmPassword"
        placeholder=""
        onChange={handleChange}
        className="rounded text-black"
      />
      {errors.confirmPassword ? (
        <p className="text-red-500 text-xs">{errors.confirmPassword}</p>
      ) : (
        <p className="text-white text-xs my-2"></p>
      )}

      <button className="text-white text-sm  border-gray-600 border-b m-auto w-1/2 h-8  rounded-full p-1 hover:border-none">
        registrarse
      </button>
      <h3 className="text-xs text-white text-center">
        ¿Ya tenes cuenta? directamente logueate 
        <button type="button" className="text-blue-500 m-1" onClick={() => setToggle(false)}>aqui</button>
      </h3>
      <h4 className="text-xs text-white text-justify ">
        campos marcados con (*) son obligatorios.
        <br />
        La contraseña debe tener al menos 8 caracteres, incluir al menos una letra y un número
      </h4>
    </form>
  );
}
