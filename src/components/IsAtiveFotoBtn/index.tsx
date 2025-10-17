export interface IsActiveFotoBtnProps {
  onClickActive: () => void;
  onClickInactive: () => void;
  onClickAll: () => void;
  active: "all" | "active" | "inactive";
}

export const IsActiveFotoBtn: React.FC<IsActiveFotoBtnProps> = ({
  onClickActive,
  onClickInactive,
  onClickAll,
  active,
}) => {
  return (
    <ul
      className="absolute
        top-[10px]
        right-[105%]
        flex
        flex-col
        items-center
        justify-left
        align-center
        animate-fade-in
        gap-10
        text-gray-400
        sm:right-[105%]
        md:right-[103%]
        lg:right-[102%]
        xl:right-[101.5%]


     "
      style={{
        backgroundColor: "transparent",
        outline: "none",
        letterSpacing: "0.5px",
       
      }}
    >
      <button className={`transform hover:translate-x-[10%] transition duration-300 ease-in-out text-[13px] ${active === "all" ? "text-white":""}`} onClick={onClickAll}>
        coleccion
      </button>
      <button className={`transform hover:translate-x-[10%] transition duration-300 ease-in-out text-[13px] ${active === "active" ? "text-white":""}`} onClick={
        onClickActive}>
        portfolio
      </button>
      <button className={`transform hover:translate-x-[10%] transition duration-300 ease-in-outtext-[13px] ${active === "inactive" ? "text-white":""}`} onClick={onClickInactive}>
        borradores
      </button>
    </ul>
  );
};
