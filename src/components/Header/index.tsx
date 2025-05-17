import Image from "next/image";
import Titulo from "../../../public/Titulo.png";
import Navbar from "../Navbar";
import { LogoutBtn } from "../LogoutBtn";

export default function Header() {
  return (
    <div className="relative z-50 ">
      <Image
        src={Titulo}
        alt={"Titulo Metamorphose"}
        width={500}
        height={400}
        className="flex justify-left w-[21%] " 
      />
      <LogoutBtn />
      <Navbar  />
    </div>
  );
}
