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
import { TestimonialCard, Testimonial } from "./shared/cards/TestimonialCard";

// --- Demo Data ---
const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "ফাতিমা রহমান",
    message:
      "কোয়ালিটি এক কথায় অসাধারণ! আমি যে জামদানি শাড়িটি অর্ডার করেছিলাম তা আমার প্রত্যাশার চেয়েও অনেক ভালো ছিল। অবশ্যই আবার অর্ডার করব।",
  },
  {
    id: "2",
    name: "নুসরাত জাহান",
    message:
      "খুব দ্রুত ডেলিভারি পেয়েছি এবং প্যাকেজিংটাও সুন্দর ছিল। সিল্কের শাড়িটি অত্যন্ত সুন্দর এবং রঙ ঠিক ছবির মতোই।",
  },
  {
    id: "3",
    name: "আয়েশা সিদ্দিকা",
    message:
      "অনলাইনে সেরা শাড়ির দোকান! দুর্দান্ত কালেকশন এবং তাদের কাস্টমার সার্ভিসও অসাধারণ। সবাইকে সুপারিশ করছি।",
  },
  {
    id: "4",
    name: "সাদিয়া ইসলাম",
    message:
      "আমার কেনাকাটায় আমি খুবই সন্তুষ্ট। কাপড়ের কোয়ালিটি দুর্দান্ত এবং ডেলিভারি খুব দ্রুত ছিল।",
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
            গ্রাহকদের মতামত
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
            আমাদের গ্রাহকরা কী বলছেন
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