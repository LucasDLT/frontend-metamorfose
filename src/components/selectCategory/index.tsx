import { useContext } from "react";
import { Context, ICategory } from "@/context/context";
import { usePathname } from "next/navigation";

export interface IselectCategoryProps {
  onChange: (selectedCategory: ICategory | null) => void;
  style?: React.CSSProperties;
  value?: string | null;
  clasName?: string;
  onRequestDeleteCategory?: (  categoryId: number) => void;
}

export const SelectCategory: React.FC<IselectCategoryProps> = ({
  onChange,
  style,
  value
}) => {
  const { category } = useContext(Context);
  const path = usePathname();
  const isMultimediaPage = path === "/navegacion/multimedia";
  const isMultimediaDetail = path.startsWith("/multimedia/") && path !== "/multimedia";

  const titleSelect = isMultimediaPage
    ? "Total de fotos"
    : isMultimediaDetail
      ? "Selecciona una categoría"
      : "Categorías";

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategoryName = event.target.value === "" ? null : event.target.value;
    const selectedCategory = category?.find((cat) => cat.name === selectedCategoryName) || null;
    onChange(selectedCategory);
  };

 
  return (

    <select
      name="selectCategory"
      id="selectCategory"
      onChange={handleChange}
      style={style}
      value={value || ""}
      className="bg-black text-white  rounded"
    >
      <option className="bg-black text-white" >{titleSelect}</option>
      {category.map((categoria: ICategory) => (
        <option className="bg-black" key={categoria.id} value={categoria.name}>
          {categoria.name.toUpperCase()}
        </option>
      ))}
    </select>
  );
};
