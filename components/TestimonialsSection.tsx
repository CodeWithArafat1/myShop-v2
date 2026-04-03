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
import { TestimonialCard,Testimonial } from "./shared/cards/TestimonialCard";



// --- Demo Data ---
const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Fatima Rahman",
    message:
      "Absolutely love the quality! The Jamdani saree I ordered was beyond my expectations. Will definitely order again.",
  },
  {
    id: "2",
    name: "Nusrat Jahan",
    message:
      "Fast delivery and beautiful packaging. The silk saree is so elegant and the color is exactly as shown.",
  },
  {
    id: "3",
    name: "Ayesha Siddiqua",
    message:
      "Best saree shop online! Great collection and the customer service is amazing. Highly recommended.",
  },
  {
    id: "4",
    name: "Sadia Islam",
    message:
      "Very satisfied with my purchase. Fabric quality is top-notch and delivery was super quick.",
  },
];

export default function TestimonialsSection() {
  const [api, setApi] = React.useState<CarouselApi>();

  // 🔥 Autoplay 3s
  const autoplay = React.useRef(
    Autoplay({
      delay: 3000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    })
  );

  return (
    <section className="py-20">
      <div className="container mx-auto px-12">

        {/* --- Header --- */}
        <div className="text-center mb-12">
          <p className="text-green-600 text-xs font-semibold tracking-widest uppercase mb-2">
            Testimonials
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
            What Our Customers Say
          </h2>
        </div>

        {/* --- Carousel --- */}
        <div className="relative">

          <Carousel
            setApi={setApi}
            plugins={[autoplay.current]}
            opts={{ align: "start", loop: true }}
          >
            <CarouselContent className="-ml-4 py-3">
              {testimonials.map((item) => (
                <CarouselItem
                  key={item.id}
                  className="pl-4 basis-[90%] sm:basis-1/2 lg:basis-1/3"
                >
                  <TestimonialCard  testimonial={item} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* --- LEFT ARROW (Desktop only) --- */}
          <button
            onClick={() => api?.scrollPrev()}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-md w-10 h-10 rounded-full items-center justify-center hover:bg-gray-100 transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* --- RIGHT ARROW (Desktop only) --- */}
          <button
            onClick={() => api?.scrollNext()}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-md w-10 h-10 rounded-full items-center justify-center hover:bg-gray-100 transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

        </div>
      </div>
    </section>
  );
}