
export interface IsActiveFotoBtnProps {
    onClickActive: () => void;
    onClickInactive: () => void;
}


export const IsActiveFotoBtn: React.FC<IsActiveFotoBtnProps> = ({onClickActive, onClickInactive}) => {
    return (
      <ul  style={{
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
      }}>

        <button className=" text-white text-[13px]" onClick={onClickActive} >Activas</button>
        <button className=" text-white text-[13px]" onClick={onClickInactive} >Inactivas</button>

      </ul>
    );
};