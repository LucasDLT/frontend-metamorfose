'use client'
import {FormLogin} from "@/components/FormLogin"
import {FormRegister} from "@/components/FormRegister"
import { useState, useEffect, useRef, useContext } from "react"
import {useRouter} from "next/navigation"
import { checkSession } from "@/helpers/checkSession"
import { Context } from "@/context/context"

export default function Forms(){
    const [toggle, setToggle] = useState<boolean>(false);
    const router = useRouter();
    const hasRun = useRef(false)
    const {login} = useContext(Context);



    useEffect(() => {
        if(!login){
            return
        }
        const checkLogged = async ()=>{
           const isLogged = await checkSession()
           if(isLogged){
                 router.push("/");
           }    
        }
        if (!hasRun.current) {
            hasRun.current = true;
            checkLogged();
            
        }
       
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