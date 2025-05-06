'use client'
import {FormLogin} from "@/components/FormLogin"
import {FormRegister} from "@/components/FormRegister"
import { useState, useEffect } from "react"
import {useRouter} from "next/navigation"
import { checkSession } from "@/helpers/checkSession"

export default function Forms(){
    const [toggle, setToggle] = useState<boolean>(false);
    const router = useRouter();



    useEffect(() => {
        const checkLogged = async ()=>{
           const isLogged = await checkSession()
           if(isLogged){
                 router.push("/");
           }
        }
checkLogged()
       
    }, [])

    return(
        <main className="mt-16 font-afacad ">
            {
                !toggle
                ?<FormLogin setToggle={setToggle}/>
                :<FormRegister setToggle={setToggle}/>
            }
        </main>
    )
}