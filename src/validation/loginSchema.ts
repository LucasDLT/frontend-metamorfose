import {z} from "zod";

export const loginSchema = z.object({
    email: z.string()
    .email({message:"ingresa un correo electronico valido"}),
    password: z.string()
    .min(8,{message:"ingresa al menos 8 caracteres"})
}
)