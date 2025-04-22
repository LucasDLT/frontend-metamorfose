import { Iuser } from "../types/user.t";
import { Ierror, IformErrors } from "../types/error.t";
import { Ifotos } from "@/context/context";
import { toast } from "sonner";

// Función para validar el formulario login
export const validateForm = (form: Iuser): Ierror => {
  const errors: Ierror = {};

  // Expresiones regulares
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // Al menos 8 caracteres, una letra y un número
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Expresión regular para validar un correo electrónico

  // Validar 'email'
  if (!form.email) {
    errors.email = "El correo electrónico es obligatorio";
  } else if (!emailRegex.test(form.email)) {
    errors.email = "El correo electrónico no es válido";
  }

  // Validar 'password'
  if (!form.password) {
    errors.password = "La contraseña es obligatoria";
  } else if (!passwordRegex.test(form.password)) {
    errors.password = "La contraseña debe tener al menos 8 caracteres, incluir al menos una letra y un número";
  }

  // Validar 'confirmPassword'
  if (form.confirmPassword && form.password?.trim() !== form.confirmPassword.trim()) {
    errors.confirmPassword = "Las contraseñas no coinciden";
  }

  return errors;
};


//validacion de la carga de imagenes
export const validateCargaImgen = (form:Ifotos):IformErrors => {
  const errors: IformErrors = {};
  const tiposPermitidos = ["image/jpeg", "image/png", "image/gif", "image/jpg", "image/webp", "image/avif"];

  if(!form.title) {
    errors.title = "El nombre de la imagen es obligatorio";
  }

  

  if(!form.category || !form.category.name  ) {
    errors.category = "La categoría de la imagen es obligatoria";
  }

  if(!form.createdAt) {
    errors.createdAt = "La fecha de carga de la imagen es obligatoria";
  }

  if(!form.url) {
    errors.url = "La imagen es obligatoria";
  }


  if (!form.url) {
    errors.url = "La imagen es obligatoria";
  } else if (form.url instanceof File && (!form.url.type || !tiposPermitidos.includes(form.url.type))) {
    errors.url = "Formato de imagen no permitido";
  }
  



  return errors
};