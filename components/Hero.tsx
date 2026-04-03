import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const HeroSection = () => {
  return (
    <section
      id="home"
      className="relative pt-20 sm:pt-24 section-padding overflow-hidden min-h-[90vh] flex items-center"
      style={{ background: "var(--gradient-hero)" }}
    >
      {/* Decorative blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse pointer-events-none transform-gpu" />
      <div 
        className="absolute bottom-10 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse pointer-events-none transform-gpu" 
        style={{ animationDelay: "1s" }} 
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none transform-gpu" />

      <div className="container-main relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Content */}
          <div className="space-y-7 animate-fade-in-up">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold backdrop-blur-sm">
              <Sparkles className="w-4 h-4" />
              New Collection 2026
            </span>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-[1.1] tracking-tight">
              Discover{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-primary">Elegance</span>
                <span className="absolute bottom-1 left-0 w-full h-3 bg-primary/15 rounded-full -z-0" />
              </span>
              <br />
              in Every <span className="text-primary">Saree</span>
            </h1>

            <p className="text-muted-foreground text-lg sm:text-xl max-w-lg leading-relaxed">
              Premium quality sarees crafted for the modern woman. Blending
              tradition with contemporary style.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Button
                size="lg"
                className="gap-2 text-base px-8 h-13 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 transform-gpu"
              >
                Shop Now <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8 h-13 rounded-full hover:scale-105 transition-all duration-300 transform-gpu"
              >
                Browse Collection
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-6 sm:gap-10 pt-6">
              {[
                { value: "500+", label: "Happy Customers" },
                { value: "200+", label: "Saree Designs" },
                { value: "4.9★", label: "Customer Rating" },
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-6 sm:gap-10">
                  <div className="text-center sm:text-left">
                    <p className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
                      {stat.value}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                      {stat.label}
                    </p>
                  </div>
                  {i < 2 && <div className="w-px h-10 bg-border hidden sm:block" />}
                </div>
              ))}
            </div>
          </div>

          {/* Right Image Content */}
          <div 
            className="relative flex justify-center lg:justify-end animate-fade-in-up transform-gpu" 
            style={{ animationDelay: "0.3s" }}
          >
            <div className="relative">
              {/* Outer glow ring */}
              <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-primary/20 via-transparent to-accent/20 blur-xl pointer-events-none" />

              {/* Rotated accent card */}
              <div className="absolute -inset-2 rounded-[2.5rem] rotate-3 bg-gradient-to-br from-primary/15 to-accent/10 border border-primary/10 pointer-events-none transform-gpu" />

              {/* Main image - Optimized with next/image */}
              <div className="relative w-80 h-[26rem] sm:w-96 sm:h-[30rem] lg:w-[26rem] lg:h-[34rem] rounded-[2rem] overflow-hidden shadow-2xl bg-muted/20">
                <Image
                  src="https://res.cloudinary.com/dfyst8kiy/image/upload/v1770733078/amarshop_products/xfiakqw8d90wex7zfbll.webp"
                  alt="Model wearing elegant saree from Saree"
                  fill
                  priority // Crucial for Hero images (LCP)
                  sizes="(max-width: 768px) 320px, (max-width: 1024px) 384px, 416px"
                  className="object-cover"
                  // placeholder="blur" টি এখান থেকে মুছে ফেলা হয়েছে
                />
              </div>

              {/* Floating badge top-right */}
              <div 
                className="absolute -top-3 -right-3 bg-card/90 backdrop-blur-md border border-border rounded-2xl px-4 py-3 shadow-lg animate-bounce transform-gpu" 
                style={{ animationDuration: "3s" }}
              >
                <p className="text-xs text-muted-foreground">Starting from</p>
                <p className="font-heading text-lg font-bold text-primary">৳1,299</p>
              </div>

              {/* Floating badge bottom-left */}
              <div className="absolute -bottom-3 -left-3 bg-card/90 backdrop-blur-md border border-border rounded-2xl px-4 py-3 shadow-lg flex items-center gap-2 transform-gpu">
                <div className="flex -space-x-2">
                  {[0, 1, 2].map((i) => (
                    <div 
                      key={i} 
                      className="w-7 h-7 rounded-full bg-primary/20 border-2 border-card" 
                    />
                  ))}
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">500+ Happy</p>
                  <p className="text-[10px] text-muted-foreground">Customers</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;