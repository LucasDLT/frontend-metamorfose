import Image from "next/image";
import Titulo from "../../../public/Titulo.png";
import Navbar from "../Navbar";

export default function Header() {
  return (
    <div className="flex justify-center relative z-50">
      <Image
        src={Titulo}
        alt={"Titulo Metamorphose"}
        width={350}
        height={100}
        className="flex justify-center mx-auto w-65" 
      />
      <Navbar  />
    </div>
  );
}
