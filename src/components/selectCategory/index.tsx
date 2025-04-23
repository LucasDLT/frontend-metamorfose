import { useContext } from "react";
import { Context, ICategory } from "@/context/context";

interface IselectCategoryProps {
  onChange: (selectedCategory: ICategory | null) => void;
  style?: React.CSSProperties;
  value?: string | null;
}

export const SelectCategory: React.FC<IselectCategoryProps> = ({
  onChange,
  style,
}) => {
  const { category } = useContext(Context);


  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategoryName = event.target.value === "" ? null : event.target.value;
    const selectedCategory = category?.find((cat) => cat.name === selectedCategoryName) || null;
    onChange(selectedCategory);
  };

  return (
    <>
      <select
        name="selectCategory"
        id="selectCategory"
        onChange={handleChange}
        style={style}
      >
        <option className="bg-black" value="">CATEGORIAS</option>
        {category.map((categoria: ICategory) => (
          <option className="bg-black " key={categoria.id} >
            {categoria.name.toUpperCase()}
          </option>
        ))}
      </select>
    </>
  );
};
