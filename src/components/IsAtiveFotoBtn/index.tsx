export interface IsActiveFotoBtnProps {
  onClickActive: () => void;
  onClickInactive: () => void;
  onClickAll: () => void;
  
}

export const IsActiveFotoBtn: React.FC<IsActiveFotoBtnProps> = ({
  onClickActive,
  onClickInactive,
  onClickAll,
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
        sm:right-[105%]
        md:right-[103%]
        lg:right-[102%]
        xl:right-[101.5%]

     "
      style={{
        color: "white",
        backgroundColor: "transparent",
        outline: "none",
        letterSpacing: "0.5px",
       
      }}
    >
      <button className="transform hover:translate-x-[10%] transition duration-300 ease-in-out text-white text-[13px]" onClick={onClickAll}>
        Todas
      </button>
      <button className="transform hover:translate-x-[10%] transition duration-300 ease-in-out text-white text-[13px]" onClick={onClickActive}>
        subidas
      </button>
      <button className="transform hover:translate-x-[10%] transition duration-300 ease-in-out text-white text-[13px]" onClick={onClickInactive}>
        borradores
      </button>
    </ul>
  );
};
