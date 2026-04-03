"use client";

import { Star } from "lucide-react";

export interface Testimonial {
  id: string;
  name: string;
  message: string;
}

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const initials = testimonial.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-2xl p-10 shadow-sm shadow-green-100/80 border border-gray-100 h-full flex flex-col justify-between">

      {/* Stars */}
      <div className="flex gap-1 mb-4 text-green-500">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-green-500" />
        ))}
      </div>

      {/* Message */}
      <p className="text-gray-600 text-sm leading-relaxed mb-6">
        `{testimonial.message}`
    
      </p>

      {/* User */}
      <div className="flex items-center gap-3 mt-auto">
        <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-semibold">
          {initials}
        </div>
        <span className="text-gray-900 font-medium text-sm">
          {testimonial.name}
        </span>
      </div>
    </div>
  );
}