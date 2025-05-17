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
      className="animate-move-right"
      style={{
        color: "white",
        backgroundColor: "transparent",
        outline: "none",
        letterSpacing: "0.5px",
        position: "absolute",
        top: "10px",
        left: "-120px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "2rem",
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
