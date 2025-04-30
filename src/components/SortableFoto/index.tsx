
// components/SortableFotoCard.tsx
"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";
import { Ifotos } from "@/context/context";

type Props = {
  foto: Ifotos;
  onClick: () => void;
};

export function SortableFotoCard({ foto, onClick }: Props) {
    if (!foto.id) {
        throw new Error('foto.id is required');
      }
    const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: foto.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="border rounded-md p-2 w-[200px] h-[200px] bg-white shadow hover:scale-105 transition"
      onClick={onClick}
    >
      {foto.url ? (
  <Image
    src={typeof foto.url === "string" ? foto.url : URL.createObjectURL(foto.url)}
    alt={foto.title || "Foto"}
    width={200}
    height={200}
    className="object-cover w-full h-full"
  />
) : (
  <div>No image available</div>
)}
    </div>
  );
}
