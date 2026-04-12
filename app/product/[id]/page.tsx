"use client";

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  memo,
} from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingCart,
  ChevronRight,
  ChevronLeft,
  Minus,
  Plus,
  Check,
  X,
  ZoomIn,
  ZoomOut,
  ArrowLeft,
  Expand,
} from "lucide-react";
import { ProductCard } from "@/components/shared/cards/ProductCard";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

// ─────────────────────────────────────────────
import { useCart } from "@/contexts/CartContext";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
export interface Product {
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
  discount?: string;
}

// ─────────────────────────────────────────────
// Module-level session cache
// ─────────────────────────────────────────────
const getCache = (): Map<string, Product[]> => {
  if (typeof globalThis !== "undefined") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const g = globalThis as any;
    if (!g.__pdCache) g.__pdCache = new Map<string, Product[]>();
    return g.__pdCache as Map<string, Product[]>;
  }
  return new Map();
};

async function fetchAllProducts(): Promise<Product[]> {
  const cache = getCache();
  const CACHE_KEY = "all_products";
  if (cache.has(CACHE_KEY)) return cache.get(CACHE_KEY)!;

  const res = await fetch("https://my-shop-t2x7.vercel.app/api/products", {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);

  const data: unknown = await res.json();
  const arr: Product[] = Array.isArray(data)
    ? (data as Product[])
    : ((data as Record<string, unknown>)?.data as Product[]) ||
      ((data as Record<string, unknown>)?.products as Product[]) ||
      [];

  cache.set(CACHE_KEY, arr);
  return arr;
}

// ─────────────────────────────────────────────
// Skeleton
// ─────────────────────────────────────────────
function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-gray-100 rounded-xl ${className}`}>
      <div className="pd-shimmer absolute inset-0" />
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
        <div className="flex flex-col gap-3">
          <Skeleton className="w-full aspect-square rounded-2xl sm:rounded-3xl" />
          <div className="hidden sm:flex gap-2.5">
            {[0, 1, 2].map((i) => <Skeleton key={i} className="w-20 h-24 shrink-0" />)}
          </div>
        </div>
        <div className="flex flex-col gap-4 pt-1">
          <Skeleton className="w-24 h-5 rounded-full" />
          <Skeleton className="w-full h-9 rounded-xl" />
          <Skeleton className="w-2/3 h-9 rounded-xl" />
          <Skeleton className="w-full h-20 mt-1 rounded-xl" />
          <Skeleton className="w-36 h-11 mt-2 rounded-xl" />
          <div className="flex gap-3 mt-1">
            {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="w-11 h-11 rounded-full" />)}
          </div>
          <div className="flex gap-2 mt-1">
            {[0, 1, 2].map((i) => <Skeleton key={i} className="w-16 h-10 rounded-xl" />)}
          </div>
          <div className="flex gap-3 mt-2">
            <Skeleton className="flex-1 h-14 rounded-2xl" />
            <Skeleton className="flex-1 h-14 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Trust badge data
// ─────────────────────────────────────────────
const TRUST_BADGES = [
  { label: "Free Delivery", sub: "Orders ৳5000+", emoji: "🚚" },
  { label: "Easy Return",   sub: "7-day policy",  emoji: "🔄" },
  { label: "100% Genuine",  sub: "Authenticated", emoji: "🛡️" },
] as const;

// ─────────────────────────────────────────────
// Fullscreen Modal
// ─────────────────────────────────────────────
interface FullscreenModalProps {
  images: string[];
  current: number;
  productName: string;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onDotClick: (idx: number) => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
  dragOffset: number;
}

const FullscreenModal = memo(function FullscreenModal({
  images,
  current,
  productName,
  onClose,
  onPrev,
  onNext,
  onDotClick,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  dragOffset,
}: FullscreenModalProps) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, onNext, onPrev]);

  return (
    <div className="fs-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <TransformWrapper key={current} initialScale={1} minScale={1} maxScale={4} centerZoomedOut>
        {({ zoomIn, zoomOut, state }) => (
          <>
            <div className="fs-topbar" onClick={(e) => e.stopPropagation()}>
              <div className="fs-controls-left">
                <button type="button" aria-label="Zoom in" className="fs-icon-btn" onClick={() => zoomIn()}>
                  <ZoomIn size={18} />
                </button>
                <button type="button" aria-label="Zoom out" className="fs-icon-btn" onClick={() => zoomOut()}>
                  <ZoomOut size={18} />
                </button>
                {state.scale !== 1 && <span className="fs-zoom-label">{Math.round(state.scale * 100)}%</span>}
              </div>
              {images.length > 1 && <span className="fs-counter">{current + 1} / {images.length}</span>}
              <button type="button" aria-label="Close fullscreen viewer" className="fs-icon-btn fs-close-btn" onClick={onClose}>
                <X size={22} />
              </button>
            </div>

            <div className="fs-image-area" onClick={(e) => e.stopPropagation()} onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
              {images.length > 1 && (
                <button type="button" aria-label="Previous image" className="fs-arrow fs-arrow-left" onClick={(e) => { e.stopPropagation(); onPrev(); }}>
                  <ChevronLeft size={28} />
                </button>
              )}

              <div className="fs-img-wrapper" style={{ transform: `translateX(${dragOffset}px)`, transition: dragOffset !== 0 ? "none" : "transform 0.25s ease", width: "100%", height: "100%" }}>
                <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }} contentStyle={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div className="fs-img-container" style={{ cursor: state.scale > 1 ? "grab" : "default" }}>
                    <Image src={images[current]} alt={`${productName} — image ${current + 1}`} fill sizes="min(90vw, 900px)" className="fs-img" priority draggable={false} />
                  </div>
                </TransformComponent>
              </div>

              {images.length > 1 && (
                <button type="button" aria-label="Next image" className="fs-arrow fs-arrow-right" onClick={(e) => { e.stopPropagation(); onNext(); }}>
                  <ChevronRight size={28} />
                </button>
              )}
            </div>

            {images.length > 1 && (
              <div className="fs-bottom" onClick={(e) => e.stopPropagation()}>
                <div className="fs-dots">
                  {images.map((_, idx) => (
                    <button key={idx} type="button" onClick={() => onDotClick(idx)} className={`fs-dot ${idx === current ? "fs-dot-active" : ""}`} />
                  ))}
                </div>
                <div className="fs-thumbs">
                  {images.map((img, idx) => (
                    <button key={idx} type="button" onClick={() => onDotClick(idx)} className={`fs-thumb-btn ${idx === current ? "fs-thumb-active" : ""}`}>
                      <Image src={img} alt={`${productName} thumbnail ${idx + 1}`} width={64} height={74} sizes="64px" className="fs-thumb-img" loading={idx === current ? "eager" : "lazy"} draggable={false} />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </TransformWrapper>
    </div>
  );
});

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
export default function ProductDetail() {
  const params = useParams<{ id: string }>();
  const productId = params?.id ?? "";

  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [rawImages, setRawImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [dragOffset, setDragOffset] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchCurrentX = useRef<number | null>(null);

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const allImages = useMemo(
    () => Array.from(new Set(rawImages)).filter(Boolean),
    [rawImages]
  );

  useEffect(() => {
    if (!productId) return;
    let cancelled = false;
    setLoading(true);
    setError(false);

    fetchAllProducts()
      .then((arr) => {
        if (cancelled) return;
        const found = arr.find((p) => p._id === productId) ?? null;
        if (!found) { setError(true); setLoading(false); return; }

        setProduct(found);
        setRawImages([found.image, ...(found.images ?? [])]);
        setSelectedColor(found.colors?.[0] ?? "");
        setSelectedSize(found.sizes?.[0] ?? "");

        const same = arr.filter((p) => p._id !== productId && p.category === found.category).slice(0, 4);
        const others = arr.filter((p) => p._id !== productId && p.category !== found.category).slice(0, 4 - same.length);
        setRelatedProducts([...same, ...others]);
        setLoading(false);
      })
      .catch(() => { if (!cancelled) { setError(true); setLoading(false); } });

    return () => { cancelled = true; };
  }, [productId]);

  const goPrev = useCallback(() => { setSelectedImage((i) => (i === 0 ? allImages.length - 1 : i - 1)); setDragOffset(0); }, [allImages.length]);
  const goNext = useCallback(() => { setSelectedImage((i) => (i + 1) % allImages.length); setDragOffset(0); }, [allImages.length]);
  const goDot = useCallback((idx: number) => { setSelectedImage(idx); setDragOffset(0); }, []);

  const onTouchStart = useCallback((e: React.TouchEvent) => { touchStartX.current = e.targetTouches[0].clientX; touchCurrentX.current = e.targetTouches[0].clientX; setDragOffset(0); }, []);
  const onTouchMove = useCallback((e: React.TouchEvent) => { if (touchStartX.current === null) return; const x = e.targetTouches[0].clientX; touchCurrentX.current = x; setDragOffset(Math.max(-120, Math.min(120, x - touchStartX.current))); }, []);
  const onTouchEnd = useCallback(() => { if (touchStartX.current === null || touchCurrentX.current === null) return; const delta = touchStartX.current - touchCurrentX.current; setDragOffset(0); if (delta > 50) goNext(); else if (delta < -50) goPrev(); touchStartX.current = null; touchCurrentX.current = null; }, [goNext, goPrev]);

  const openFullscreen  = useCallback(() => { setIsFullscreen(true); setDragOffset(0); }, []);
  const closeFullscreen = useCallback(() => { setIsFullscreen(false); setDragOffset(0); }, []);

  const handleAddToCart = useCallback(() => {
    if (!product) return;

    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: allImages[selectedImage] || product.image,
      selectedColor: selectedColor || undefined,
      selectedSize: selectedSize || undefined,
    });

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  }, [product, quantity, selectedColor, selectedSize, allImages, selectedImage, addToCart]);

  const discount = product ? product.discount ? parseInt(product.discount, 10) : product.oldPrice && product.oldPrice > product.price ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0 : 0;
  const totalPrice    = product ? product.price * quantity : 0;
  const totalOldPrice = product?.oldPrice ? product.oldPrice * quantity : 0;
  const savings       = totalOldPrice > totalPrice ? totalOldPrice - totalPrice : 0;

  if (loading) return <> <style suppressHydrationWarning>{CSS_BASE}</style> <div className="min-h-screen"> <div className="h-14 sm:h-16" /> <ProductSkeleton /> </div> </>;
  if (error || !product) return <> <style suppressHydrationWarning>{CSS_BASE}</style> <div className="min-h-screen flex flex-col items-center justify-center gap-5 px-4 text-center"> <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center"> <X className="w-9 h-9 text-green-400" /> </div> <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Product Not Found</h1> <Link href="/product"> <button type="button" className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-7 py-3 rounded-full transition-all shadow-lg shadow-green-200 hover:-translate-y-0.5"> <ArrowLeft className="w-4 h-4" /> Back to Shop </button> </Link> </div> </>;

  return (
    <>
      <style suppressHydrationWarning>{CSS_BASE}</style>

      {isFullscreen && (
        <FullscreenModal images={allImages} current={selectedImage} productName={product.name} onClose={closeFullscreen} onPrev={goPrev} onNext={goNext} onDotClick={goDot} onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} dragOffset={dragOffset} />
      )}

      <div className="pd min-h-screen">
        <div className="border-b border-gray-100 pt-16 sm:pt-20 pb-3">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs sm:text-sm text-gray-400 flex-wrap">
              <Link href="/" className="hover:text-green-700 transition-colors">Home</Link> <ChevronRight className="w-3 h-3 text-gray-300 shrink-0" />
              <Link href="/product" className="hover:text-green-700 transition-colors">Shop</Link> <ChevronRight className="w-3 h-3 text-gray-300 shrink-0" />
              <span className="text-gray-700 font-medium truncate max-w-[160px] sm:max-w-xs md:max-w-md">{product.name}</span>
            </nav>
          </div>
        </div>

        <section className="py-8 sm:py-12 lg:py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 items-start">
              <div className="w-full flex flex-col gap-3 lg:sticky lg:top-24">
                <div className="pd-gallery relative rounded-2xl sm:rounded-3xl overflow-hidden aspect-square border border-gray-100 cursor-zoom-in group" onClick={openFullscreen} onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
                  <Image src={allImages[selectedImage]} alt={product.name} fill priority quality={85} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px" className="pd-gallery-img object-cover" />
                  {allImages.length > 1 && (
                    <>
                      <Image key={`pre-next-${(selectedImage + 1) % allImages.length}`} src={allImages[(selectedImage + 1) % allImages.length]} alt="" fill aria-hidden="true" className="opacity-0 pointer-events-none" sizes="1px" loading="eager" />
                      <Image key={`pre-prev-${(selectedImage - 1 + allImages.length) % allImages.length}`} src={allImages[(selectedImage - 1 + allImages.length) % allImages.length]} alt="" fill aria-hidden="true" className="opacity-0 pointer-events-none" sizes="1px" loading="eager" />
                    </>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center pointer-events-none">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 text-white rounded-full p-3 backdrop-blur-sm"><Expand size={20} /></div>
                  </div>
                  {product.isNew && <span className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 px-2.5 py-1 bg-green-500 text-white text-[10px] sm:text-xs font-bold rounded-full uppercase tracking-wide shadow-lg">New</span>}
                  {discount > 0 && <span className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 px-2.5 py-1 bg-red-500 text-white text-[10px] sm:text-xs font-bold rounded-full shadow-lg">-{discount}%</span>}
                  {allImages.length > 1 && (
                    <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 sm:hidden pointer-events-none z-10">
                      {allImages.map((_, idx) => ( <span key={idx} className={`block rounded-full transition-all duration-300 ${selectedImage === idx ? "w-5 h-1.5 bg-green-500" : "w-1.5 h-1.5 bg-white/60"}`} /> ))}
                    </div>
                  )}
                </div>

                {allImages.length > 1 && (
                  <div className="hidden sm:flex gap-2.5 overflow-x-auto pb-1 pd-hide-scroll">
                    {allImages.map((img, i) => (
                      <button key={i} type="button" aria-label={`View image ${i + 1}`} onClick={() => setSelectedImage(i)} className={`pd-thumb shrink-0 relative w-20 h-24 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === i ? "border-green-500 ring-2 ring-green-200" : "border-gray-200 hover:border-green-300"}`}>
                        <Image src={img} alt={`${product.name} thumbnail ${i + 1}`} fill sizes="80px" quality={70} loading={i === 0 ? "eager" : "lazy"} className="object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-5 sm:gap-6">
                <div>
                  <span className="inline-block text-[10px] sm:text-xs font-bold text-green-700 uppercase tracking-[0.14em] bg-green-50 border border-green-200 px-3 py-1 rounded-full mb-3">{product.category}</span>
                  <h1 className="pd-title text-2xl sm:text-3xl lg:text-4xl font-extrabold text-green-700 leading-tight">{product.name}</h1>
                </div>

                <p className="text-gray-500 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">{product.description}</p>

                <div className="flex flex-wrap items-end gap-3 py-4 border-t border-b border-gray-100">
                  <span className="text-3xl sm:text-4xl font-extrabold text-green-600 tabular-nums">৳{totalPrice.toLocaleString()}</span>
                  {totalOldPrice > totalPrice && (
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-lg text-gray-400 line-through tabular-nums">৳{totalOldPrice.toLocaleString()}</span>
                      <span className="px-2.5 py-0.5 bg-red-50 text-red-500 text-xs font-bold rounded-full border border-red-100 whitespace-nowrap">Save ৳{savings.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                {product.colors?.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Color: <span className="text-green-700 normal-case font-semibold tracking-normal capitalize ml-1">{selectedColor}</span></p>
                    <div className="flex flex-wrap gap-2.5">
                      {product.colors.map((color) => {
                        const isLight = ["white", "#fff", "#ffffff"].includes(color.toLowerCase());
                        return (
                          <button key={color} type="button" aria-label={`Select color ${color}`} title={color} onClick={() => setSelectedColor(color)} className={`pd-color relative w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 shadow-sm ${selectedColor === color ? "ring-[3px] ring-green-500 ring-offset-2 border-transparent" : "border-gray-200"}`} style={{ backgroundColor: color }}>
                            {selectedColor === color && <Check className={`w-4 h-4 absolute inset-0 m-auto drop-shadow ${isLight ? "text-gray-800" : "text-white"}`} />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {product.sizes?.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Size</p>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size) => (
                        <button key={size} type="button" aria-label={`Select size ${size}`} onClick={() => setSelectedSize(size)} className={`pd-size px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold border-2 capitalize transition-all ${selectedSize === size ? "bg-green-600 text-white border-green-600 shadow-md shadow-green-100" : "bg-white text-gray-600 border-gray-200 hover:border-green-400 hover:text-green-700"}`}>
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Quantity</p>
                  <div className="inline-flex items-center bg-gray-50 border-2 border-gray-200 rounded-2xl">
                    <button type="button" aria-label="Decrease quantity" onClick={() => setQuantity((q) => Math.max(1, q - 1))} disabled={quantity <= 1} className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center text-green-600 hover:bg-gray-100 rounded-l-2xl disabled:opacity-30 disabled:cursor-not-allowed transition-colors"><Minus className="w-4 h-4" /></button>
                    <span className="w-10 sm:w-12 text-center font-bold text-gray-900 text-base sm:text-lg select-none">{quantity}</span>
                    <button type="button" aria-label="Increase quantity" onClick={() => setQuantity((q) => Math.min(10, q + 1))} disabled={quantity >= 10} className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center text-green-600 hover:bg-gray-100 rounded-r-2xl disabled:opacity-30 disabled:cursor-not-allowed transition-colors"><Plus className="w-4 h-4" /></button>
                  </div>
                  {quantity >= 10 && <p className="text-[11px] text-amber-500 mt-1.5 font-medium">Maximum 10 items per order</p>}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button type="button" onClick={handleAddToCart} className="pd-cart flex-1 inline-flex items-center justify-center gap-2.5 text-white font-semibold text-sm sm:text-base rounded-2xl px-6 py-3.5 sm:py-4 min-h-[52px] sm:min-h-[56px]">
                    {addedToCart ? <><Check className="w-4 h-4 sm:w-5 sm:h-5" /> Added to Cart!</> : <><ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" /> Add to Cart</>}
                  </button>
                  <button type="button" className="pd-buy flex-1 inline-flex items-center justify-center gap-2.5 font-semibold text-sm sm:text-base rounded-2xl px-6 py-3.5 sm:py-4 min-h-[52px] sm:min-h-[56px]">Buy Now</button>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:gap-3 p-3 sm:p-4 rounded-2xl border border-gray-100">
                  {TRUST_BADGES.map(({ emoji, label, sub }) => (
                    <div key={label} className="flex flex-col items-center text-center gap-1.5">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-green-50 flex items-center justify-center text-base sm:text-lg">{emoji}</div>
                      <p className="text-[10px] sm:text-xs font-bold text-gray-700">{label}</p>
                      <p className="text-[9px] sm:text-[10px] text-gray-400">{sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {relatedProducts.length > 0 && (
          <section className="py-10 sm:py-14 lg:py-16 border-t border-gray-100">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-6 sm:mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-7 bg-gradient-to-b from-green-400 to-green-700 rounded-full" />
                  <h2 className="pd-title text-xl sm:text-2xl lg:text-3xl font-bold text-green-800">You May Also Like</h2>
                </div>
                <Link href="/product" className="text-xs sm:text-sm font-semibold text-green-600 hover:text-green-800 transition-colors flex items-center gap-1">View all <ChevronRight className="w-3.5 h-3.5" /></Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
                {relatedProducts.map((p) => <ProductCard key={p._id} product={p} />)}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────
const CSS_BASE = `
  @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
  .pd-shimmer { background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.65) 50%, transparent 100%); animation: shimmer 1.3s infinite; }
  .pd { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
  .pd-title { font-family: Georgia, "Times New Roman", serif; }
  .pd-gallery-img { transition: transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important; }
  .pd-gallery:hover .pd-gallery-img { transform: scale(1.04) !important; }
  .pd-thumb { transition: all 0.18s ease; }
  .pd-thumb:hover { transform: translateY(-2px); }
  .pd-color { transition: transform 0.18s ease; }
  .pd-color:hover { transform: scale(1.1); }
  .pd-size { transition: all 0.18s ease; }
  .pd-size:hover:not([class*="bg-green"]) { transform: translateY(-1px); }
  .pd-cart { background: linear-gradient(135deg, #16a34a 0%, #15803d 60%, #166534 100%); box-shadow: 0 4px 16px rgba(22,163,74,0.28); border: none; cursor: pointer; transition: all 0.22s ease; }
  .pd-cart:hover { background: linear-gradient(135deg, #15803d 0%, #166534 100%); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(22,163,74,0.38); }
  .pd-cart:active { transform: translateY(0); }
  .pd-buy { border: 2px solid #16a34a; color: #16a34a; background: transparent; cursor: pointer; transition: all 0.22s ease; }
  .pd-buy:hover { background: #16a34a; color: #fff; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(22,163,74,0.25); }
  .pd-buy:active { transform: translateY(0); }
  .pd-hide-scroll::-webkit-scrollbar { display: none; }
  .pd-hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
  .fs-backdrop { position: fixed; inset: 0; z-index: 9999; display: flex; flex-direction: column; background: rgba(0, 0, 0, 0.88); backdrop-filter: blur(18px) saturate(0.6); -webkit-backdrop-filter: blur(18px) saturate(0.6); animation: fs-fadein 0.22s ease; }
  @keyframes fs-fadein { from { opacity: 0; } to { opacity: 1; } }
  .fs-topbar { flex-shrink: 0; height: 64px; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; gap: 12px; background: linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 100%); z-index: 10; margin-top: 59px; }
  @media (min-width: 640px) { .fs-topbar { padding: 0 28px; height: 72px; } }
  .fs-controls-left { display: flex; align-items: center; gap: 8px; }
  .fs-zoom-label { color: rgba(255,255,255,0.5); font-size: 12px; margin-left: 4px; font-variant-numeric: tabular-nums; }
  .fs-counter { color: rgba(255,255,255,0.6); font-size: 13px; font-weight: 600; letter-spacing: 0.05em; position: absolute; left: 50%; transform: translateX(-50%); }
  .fs-icon-btn { display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; border: none; cursor: pointer; color: #fff; background: rgba(255,255,255,0.12); backdrop-filter: blur(8px); transition: background 0.15s, transform 0.12s; flex-shrink: 0; }
  .fs-icon-btn:hover { background: rgba(255,255,255,0.22); transform: scale(1.08); }
  .fs-icon-btn:active { transform: scale(0.95); }
  .fs-close-btn:hover { background: rgba(220,38,38,0.75) !important; }
  .fs-image-area { flex: 1; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; touch-action: pan-y; user-select: none; }
  .fs-img-wrapper { display: flex; align-items: center; justify-content: center; will-change: transform; }
  .fs-img-container { position: relative; width: min(90vw, 900px); height: calc(100vh - 220px); max-height: 800px; }
  .fs-img-container img { border-radius: 12px !important; box-shadow: 0 32px 80px rgba(0,0,0,0.5) !important; object-fit: contain !important; animation: fs-imgappear 0.25s ease; }
  @keyframes fs-imgappear { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
  .fs-arrow { position: absolute; top: 50%; transform: translateY(-50%); z-index: 5; display: flex; align-items: center; justify-content: center; width: 48px; height: 48px; border-radius: 50%; border: none; cursor: pointer; color: #fff; background: rgba(255,255,255,0.12); backdrop-filter: blur(8px); transition: background 0.15s, transform 0.15s; }
  .fs-arrow:hover { background: rgba(255,255,255,0.25); transform: translateY(-50%) scale(1.1); }
  .fs-arrow:active { transform: translateY(-50%) scale(0.95); }
  .fs-arrow-left  { left: 12px; }
  .fs-arrow-right { right: 12px; }
  @media (min-width: 640px) { .fs-arrow { width: 56px; height: 56px; } .fs-arrow-left  { left: 20px; } .fs-arrow-right { right: 20px; } }
  .fs-bottom { flex-shrink: 0; display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 12px 16px 20px; background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%); }
  @media (min-width: 640px) { .fs-bottom { padding: 16px 24px 28px; gap: 12px; } }
  .fs-dots { display: flex; align-items: center; gap: 8px; }
  .fs-dot { width: 8px; height: 8px; border-radius: 9999px; border: none; cursor: pointer; background: rgba(255,255,255,0.35); transition: all 0.2s ease; padding: 0; }
  .fs-dot:hover { background: rgba(255,255,255,0.65); }
  .fs-dot-active { width: 24px; background: #4ade80 !important; box-shadow: 0 0 8px rgba(74,222,128,0.6); }
  .fs-thumbs { display: flex; gap: 8px; overflow-x: auto; max-width: 100%; padding-bottom: 2px; -ms-overflow-style: none; scrollbar-width: none; }
  .fs-thumbs::-webkit-scrollbar { display: none; }
  .fs-thumb-btn { flex-shrink: 0; width: 52px; height: 60px; border-radius: 10px; overflow: hidden; border: 2px solid transparent; cursor: pointer; transition: all 0.18s ease; opacity: 0.55; padding: 0; background: none; }
  .fs-thumb-btn:hover { opacity: 0.85; transform: translateY(-2px); }
  .fs-thumb-active { border-color: #4ade80 !important; opacity: 1 !important; box-shadow: 0 0 0 2px rgba(74,222,128,0.4); }
  .fs-thumb-btn img { width: 100% !important; height: 100% !important; object-fit: cover !important; display: block !important; }
  @media (min-width: 640px) { .fs-thumb-btn { width: 64px; height: 74px; } }
`;