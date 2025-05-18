import Image from "next/image";
import Titulo from "../../../public/Titulo.png";
import Navbar from "../Navbar";
import { LogoutBtn } from "../LogoutBtn";

export default function Header() {
  return (
    <header className="relative w-screen px-4 py-2 flex flex-col sm:flex-row items-center  sm:items-center sm:justify-between gap-4">
      <div className="flex items-center justify-center w-screen lg:flex justify-between ">
        <Image
          src={Titulo}
          alt="Titulo Metamorphose"
          width={500}
          height={400}
          className="w-[200px] sm:w-[300px] md:w-[300px] lg:w-[300px] xl:w-[300px]"
        />
        <LogoutBtn />
      </div>

      <div className="flex items-center justify-center sm:justify-end gap-4 flex-wrap">
        <Navbar />
      </div>
    </header>
  );
}

