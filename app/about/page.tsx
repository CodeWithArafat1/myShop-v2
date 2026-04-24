import Image from "next/image";
import Link from "next/link";
import { 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  Heart, 
  Award, 
  ArrowRight,
  Target,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "About Us | AmarShop",
  description: "Discover the story behind AmarShop, your trusted destination for authentic and high-quality products.",
};

const STATS = [
  { label: "Happy Customers", value: "50K+" },
  { label: "Authentic Products", value: "10K+" },
  { label: "Partner Brands", value: "200+" },
  { label: "Years of Trust", value: "5+" },
];

const CORE_VALUES = [
  {
    icon: ShieldCheck,
    title: "100% Genuine Products",
    description: "We source our products directly from brands and authorized distributors to ensure authenticity and premium quality.",
  },
  {
    icon: Truck,
    title: "Fast & Secure Delivery",
    description: "Experience lightning-fast delivery right to your doorstep with our dedicated and secure logistics network.",
  },
  {
    icon: Heart,
    title: "Customer First",
    description: "Your satisfaction is our ultimate goal. Our dedicated support team is always ready to assist you 24/7.",
  },
  {
    icon: Award,
    title: "Best Price Guarantee",
    description: "Enjoy premium products at the most competitive prices, with exclusive deals and discounts every day.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-green-50/50">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />
        <div className="container mx-auto px-4 md:px-8 relative z-10 max-w-[1200px]">
          <div className="text-center max-w-3xl mx-auto flex flex-col items-center">
            <span className="inline-flex items-center justify-center p-3 bg-green-100 rounded-full mb-6">
              <ShoppingBag className="w-8 h-8 text-green-600" />
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
              Redefining Your <br className="hidden md:block" />
              <span className="text-green-600">Shopping Experience</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-10">
              Welcome to AmarShop, where quality meets convenience. We are dedicated to bringing you the best products, seamless shopping, and unparalleled customer service.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full pt-8 border-t border-gray-200">
              {STATS.map((stat, index) => (
                <div key={index} className="flex flex-col items-center gap-1">
                  <h3 className="text-3xl md:text-4xl font-black text-gray-900">{stat.value}</h3>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Story & Mission Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 md:px-8 max-w-[1200px]">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative aspect-square sm:aspect-video lg:aspect-square rounded-3xl overflow-hidden bg-gray-100 shadow-2xl">
              {/* Replace src with your actual company image if you have one */}
              <Image
                src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop"
                alt="AmarShop Team and Warehouse"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                <div className="text-white">
                  <p className="font-bold text-xl mb-1">Founded in 2019</p>
                  <p className="text-white/80 text-sm">Starting from a small room to a nationwide platform.</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-bold uppercase tracking-widest mb-4">
                  <Target className="w-4 h-4" /> Our Mission
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  Empowering Lifestyles Through Quality & Trust
                </h2>
                <p className="text-gray-600 leading-relaxed text-lg">
                  AmarShop was born out of a simple idea: to make premium, authentic products accessible to everyone. We believe that shopping online should be a joyful, secure, and hassle-free experience. 
                </p>
                <p className="text-gray-600 leading-relaxed text-lg mt-4">
                  We meticulously curate our collections, partnering only with verified brands and sellers. Every product that reaches your door has passed our strict quality checks, because you deserve nothing but the best.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
                <div className="flex gap-4">
                  <div className="w-12 h-12 shrink-0 rounded-2xl bg-blue-50 flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Community First</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">Building a platform driven by the needs of our amazing community.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 shrink-0 rounded-2xl bg-amber-50 flex items-center justify-center">
                    <Award className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Excellence</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">Striving for excellence in every package we deliver.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 lg:py-28 bg-gray-50 border-y border-gray-100">
        <div className="container mx-auto px-4 md:px-8 max-w-[1200px]">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose AmarShop?</h2>
            <p className="text-gray-600 text-lg">
              We don't just sell products; we build relationships. Here is what makes us different.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {CORE_VALUES.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md hover:border-green-200 transition-all group">
                  <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors">
                    <Icon className="w-7 h-7 text-green-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-sm">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 md:px-8 max-w-[1200px]">
          <div className="bg-gray-900 rounded-[2.5rem] overflow-hidden relative">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-green-500 rounded-full blur-3xl opacity-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-blue-500 rounded-full blur-3xl opacity-20 pointer-events-none" />
            
            <div className="relative z-10 px-6 py-16 md:py-24 text-center flex flex-col items-center">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 max-w-2xl leading-tight">
                Ready to upgrade your shopping experience?
              </h2>
              <p className="text-gray-400 text-lg mb-10 max-w-xl">
                Join thousands of happy customers and explore our latest collections with exclusive deals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/product">
                  <Button className="h-14 px-8 rounded-full bg-green-600 hover:bg-green-500 text-white font-bold text-base w-full sm:w-auto flex items-center gap-2 group shadow-lg shadow-green-900/20 cursor-pointer">
                    Start Shopping
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" className="h-14 px-8 rounded-full border-gray-700 hover:bg-gray-800 text-black cursor-pointer hover:text-white font-bold text-base w-full sm:w-auto">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}