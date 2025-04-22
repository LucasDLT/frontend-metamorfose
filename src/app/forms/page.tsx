'use client'
import {FormLogin} from "@/components/FormLogin"
import {FormRegister} from "@/components/FormRegister"
import { useState } from "react"

export default function Forms(){
    const [toggle, setToggle] = useState<boolean>(false);

    return(
        <main className="grid grid-cols-1 gap-4 mt-16 font-afacad ">
            {
                !toggle
                ?<FormLogin setToggle={setToggle}/>
                :<FormRegister setToggle={setToggle}/>
            }
        </main>
    )
}