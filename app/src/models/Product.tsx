import { StaticImageData } from "next/image";

export interface Product {
  name: string;
  price: number;
  description: string;
  imgUrl: StaticImageData;
}
