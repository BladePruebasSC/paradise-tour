export interface Combo {
  id: string;
  title: string;
  description: string;
  tourIds: string[];
  originalPrice: number;
  discountedPrice: number;
  discount: number;
  image: string;
}

export const combos: Combo[] = [
  {
    id: "combo-1",
    title: "Aventura Completa",
    description: "Snorkel en Cozumel + Tour en Catamarán - El combo perfecto para disfrutar del mar",
    tourIds: ["1", "2"],
    originalPrice: 180,
    discountedPrice: 150,
    discount: 17,
    image: "/src/assets/tour-snorkeling.jpg"
  },
  {
    id: "combo-2",
    title: "Cultura y Naturaleza",
    description: "Ruinas Mayas + Aventura en la Selva - Descubre la historia y la naturaleza",
    tourIds: ["3", "4"],
    originalPrice: 200,
    discountedPrice: 165,
    discount: 18,
    image: "/src/assets/tour-ruins.jpg"
  }
];
