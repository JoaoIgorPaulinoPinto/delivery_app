import { StaticImageData } from "next/image";

export interface Product {
  id: number;
  name: string;
  price: number;
  // category: string;
  description: string;
  imgUrl: StaticImageData;
  quantity?: number;
  obs?: string;
}
