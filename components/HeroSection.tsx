"use client";

import Image from "next/image";
import { ArrowRight, Sparkles, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import CountUp from "react-countup";

const infoArr = [
  { value: 500, suffix: "+", label: "সন্তুষ্ট গ্রাহক", decimals: 0 },
  { value: 200, suffix: "+", label: "শাড়ির ডিজাইন", decimals: 0 },
  { value: 4.9, suffix: "★", label: "গ্রাহক রেটিং", decimals: 1 },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden py-16 sm:py-24 selection:bg-green-100 selection:text-green-900">
      {/* --- Optimized CSS Animations --- */}
      <style>{`
        @keyframes heroFadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroFloatSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes heroFloatFast {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-fade-in-up {
          opacity: 0;
          animation: heroFadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* --- Atmospheric Background Glows --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-green-200/30 rounded-full blur-[120px] animate-pulse [animation-duration:5s]" />
        <div className="absolute bottom-[5%] right-[-5%] w-[400px] h-[400px] bg-green-200/30 rounded-full blur-[100px] animate-pulse [animation-duration:7s]" />
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* ================= LEFT SIDE: TEXT & ACTIONS ================= */}
          <div className="max-w-xl">
            {/* Top Badge */}
            <div className="animate-fade-in-up inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 text-green-700 text-xs font-semibold mb-6 ring-1 ring-green-600/10 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-green-500" />
              নতুন কালেকশন ২০২৬
            </div>

            {/* Main Heading */}
            <h1
              className="animate-fade-in-up text-5xl sm:text-6xl md:text-[64px] font-bold text-gray-900 leading-[1.1] mb-6 font-serif text-balance"
              style={{ animationDelay: "0.1s" }}
            >
              <span className="text-green-600">স্বপ্ন ছোঁয়া</span>
              <br />– রঙে রঙে আপনার{" "}
              <span className="text-green-600">স্বপ্ন</span>
            </h1>

            {/* Description */}
            <p
              className="animate-fade-in-up text-gray-500 text-lg sm:text-xl mb-10 leading-relaxed max-w-md text-balance"
              style={{ animationDelay: "0.2s" }}
            >
              আধুনিক নারীদের জন্য নিখুঁতভাবে তৈরি প্রিমিয়াম কোয়ালিটির শাড়ি।
              যেখানে রয়েছে ঐতিহ্য এবং আধুনিকতার এক অপূর্ব সংমিশ্রণ।
            </p>

            {/* Buttons (8px rounded = rounded-lg) */}
            <div
              className="animate-fade-in-up flex flex-wrap items-center gap-4 mb-14"
              style={{ animationDelay: "0.3s" }}
            >
              {/* Primary Button */}
              <Button className="bg-green-600 hover:bg-green-700 text-white h-13 px-8 rounded-lg text-base font-medium transition-all duration-300 shadow-lg shadow-green-600/25 group hover:shadow-xl hover:-translate-y-0.5">
                এখনই কিনুন
                <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>

              {/* Video Modal Trigger */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-white/50 backdrop-blur-sm border-gray-200 hover:border-green-600 hover:text-green-700 hover:bg-green-50 text-gray-700 h-13 px-8 rounded-lg text-base font-medium transition-all duration-300 hover:-translate-y-0.5 group"
                  >
                    <PlayCircle className="w-5 h-5 mr-2 text-green-600 group-hover:scale-110 transition-transform duration-300" />
                    আমাদের গল্প
                  </Button>
                </DialogTrigger>

                {/* Video Modal Content */}
                <DialogContent className="sm:max-w-3xl p-1 bg-black/95 border-none shadow-2xl rounded-2xl overflow-hidden">
                  <DialogTitle className="sr-only">Our Story Video</DialogTitle>
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black">
                    {/* Replace src with your actual YouTube Embed URL */}
                    <iframe
                      className="absolute top-0 left-0 w-full h-full"
                      src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                      title="Our Story"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Stats Row */}
            <div
              className="animate-fade-in-up flex items-center gap-8 sm:gap-12"
              style={{ animationDelay: "0.4s" }}
            >
              {infoArr.map((stat, idx) => (
                <div key={idx} className="relative flex items-center">
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-green-600 tracking-tight">
                      <CountUp
                        end={stat.value}
                        decimals={stat.decimals}
                        duration={2.5}
                        delay={0.5}
                        enableScrollSpy
                        scrollSpyOnce
                      />
                      {stat.suffix}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">
                      {stat.label}
                    </p>
                  </div>
                  {/* Divider line for first two items */}
                  {idx !== 2 && (
                    <div className="absolute -right-4 sm:-right-6 w-px h-12 bg-gray-200 hidden sm:block" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ================= RIGHT SIDE: IMAGE & BADGES ================= */}
          <div
            className="animate-fade-in-up relative flex justify-center lg:justify-end mt-12 lg:mt-0 pl-4 sm:pl-10"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="relative w-full max-w-[420px] group">
              {/* Decorative Rotated Backdrop */}
              <div className="absolute inset-0 bg-green-100 rounded-[2rem] transform rotate-3 translate-x-4 translate-y-3 -z-10 transition-all duration-500 group-hover:rotate-6 group-hover:translate-x-5" />

              {/* Main Image Container */}
              <div className="relative w-full aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl bg-white border-8 border-white z-10 transition-transform duration-500 group-hover:-translate-y-1">
                <Image
                  src="https://res.cloudinary.com/dfyst8kiy/image/upload/v1770733078/amarshop_products/xfiakqw8d90wex7zfbll.webp"
                  alt="Woman wearing elegant green saree"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 420px"
                  className="object-cover object-top hover:scale-105 transition-transform duration-1000 ease-out"
                />
              </div>

              {/* Top Right Floating Badge */}
              <div
                className="absolute -top-6 -right-4 sm:-right-8 bg-white/95 backdrop-blur-xl rounded-2xl px-5 py-3.5 shadow-xl border border-white/40 z-20"
                style={{ animation: "heroFloatFast 3s ease-in-out infinite" }}
              >
                <p className="text-[11px] text-gray-500 font-medium mb-0.5">
                  শুরু হচ্ছে
                </p>
                <p className="text-green-600 font-bold text-base tracking-tight">
                  ৳১,২৯৯
                </p>
              </div>

              {/* Bottom Left Floating Badge */}
              <div
                className="absolute -bottom-6 -left-4 sm:-left-8 bg-white/95 backdrop-blur-xl rounded-2xl px-5 py-4 shadow-xl border border-white/40 flex items-center gap-3.5 z-20"
                style={{
                  animation: "heroFloatSlow 4s ease-in-out infinite",
                  animationDelay: "1s",
                }}
              >
                {/* Overlapping Avatars/Circles */}
                <div className="flex -space-x-2.5">
                  <div className="w-9 h-9 rounded-full bg-green-100 border-2 border-white shadow-sm" />
                  <div className="w-9 h-9 rounded-full bg-green-200 border-2 border-white shadow-sm" />
                  <div className="w-9 h-9 rounded-full bg-green-300 border-2 border-white shadow-sm flex items-center justify-center text-[10px] font-bold text-green-800">
                    +
                  </div>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 leading-tight">
                    <CountUp
                      end={500}
                      duration={2.5}
                      delay={0.8}
                      enableScrollSpy
                      scrollSpyOnce
                    />
                    + সন্তুষ্ট
                  </p>
                  <p className="text-[11px] font-medium text-gray-500 mt-0.5">
                    গ্রাহক
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
