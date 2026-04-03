"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { ProductCard } from "./shared/cards/ProductCard";

type Product = {
  _id: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  colors: string[];
  sizes: string[];
  image: string;
  images: string[];
  isNew: boolean;
  isFeatured: boolean;
  description: string;
  createdAt: string;
};

const products: Product[] = [
  {
    _id: "1",
    name: "রয়েল ব্লু সিল্ক শাড়ি",
    category: "সিল্ক",
    price: 2850,
    oldPrice: 3500,
    colors: [],
    sizes: [],
    image:
      "https://res.cloudinary.com/dfyst8kiy/image/upload/v1770733078/amarshop_products/xfiakqw8d90wex7zfbll.webp",
    images: [],
    isNew: false,
    isFeatured: true,
    description: "",
    createdAt: "",
  },
  {
    _id: "2",
    name: "এলিগ্যান্ট গ্রিন জামদানি",
    category: "জামদানি",
    price: 3200,
    oldPrice: 4000,
    colors: [],
    sizes: [],
    image:
      "https://res.cloudinary.com/dfyst8kiy/image/upload/v1770733078/amarshop_products/xfiakqw8d90wex7zfbll.webp",
    images: [],
    isNew: true,
    isFeatured: false,
    description: "",
    createdAt: "",
  },
  {
    _id: "3",
    name: "ঐতিহ্যবাহী সাদা ও সবুজ শাড়ি",
    category: "কটন",
    price: 2500,
    oldPrice: 3200,
    colors: [],
    sizes: [],
    image:
      "https://res.cloudinary.com/dfyst8kiy/image/upload/v1770733078/amarshop_products/xfiakqw8d90wex7zfbll.webp",
    images: [],
    isNew: false,
    isFeatured: false,
    description: "",
    createdAt: "",
  },
  {
    _id: "4",
    name: "প্রিমিয়াম কটন শাড়ি",
    category: "কটন",
    price: 1850,
    oldPrice: 2400,
    colors: [],
    sizes: [],
    image:
      "https://res.cloudinary.com/dfyst8kiy/image/upload/v1770733078/amarshop_products/xfiakqw8d90wex7zfbll.webp",
    images: [],
    isNew: false,
    isFeatured: false,
    description: "",
    createdAt: "",
  },
];

export default function FeaturedProducts() {
  const [api, setApi] = React.useState<CarouselApi>();

  const autoplay = React.useRef(
    Autoplay({
      delay: 3000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    })
  );

  return (
    <section className="py-16">
      <div className="container mx-auto px-12">

        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">
            নির্বাচিত প্রোডাক্টসমূহ
          </h2>
          <p className="text-gray-500 mt-2">
            আমাদের নতুন কালেকশন থেকে বাছাইকৃত শাড়িসমূহ
          </p>
        </div>

        <div className="relative">

          <Carousel
            setApi={setApi}
            plugins={[autoplay.current]}
            opts={{ align: "start", loop: true }}
          >
            <CarouselContent className="-ml-4">
              {products.map((product) => (
                <CarouselItem
                  key={product._id}
                  className="pl-4 basis-[85%] sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                >
                  <ProductCard product={product} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          <button
            onClick={() => api?.scrollPrev()}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-md w-10 h-10 rounded-full hidden md:flex items-center justify-center hover:bg-gray-100 transition z-10"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => api?.scrollNext()}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-md w-10 h-10 rounded-full hidden md:flex items-center justify-center hover:bg-gray-100 transition z-10"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

        </div>
      </div>
    </section>
  );
}