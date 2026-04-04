"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  User,
  Search,
  ShoppingBag,
  Home,
  Sparkles,
  Info,
  Loader2,
  Menu,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// --- TypeScript Interfaces ---
interface Product {
  _id?: string;
  id?: string;
  name: string;
  category: string;
  price: number;
  image: string;
}

// --- Static Data ---
const NAV_LINKS = [
  { name: "Home", href: "/", icon: Home },
  { name: "Shop", href: "/product", icon: ShoppingBag },
  { name: "Collections", href: "/collections", icon: Sparkles },
  { name: "My Order", href: "/track-order", icon: ShoppingBag },
  { name: "Contact", href: "/contact", icon: Info },
  { name: "About Us", href: "/about", icon: Info },
];

export default function Navbar() {
  const router = useRouter();

  // Temporary Static Cart Count
  const cartItemCount = 5;

  // --- States ---
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // --- Global Keyboard Shortcut for Search (Ctrl+K / Cmd+K) ---
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsSearchOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // --- Real-time Search Logic with AbortController ---
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchResults = async () => {
      setIsLoading(true);
      try {
        // Connected directly to your live API
        const apiUrl = "https://my-shop-t2x7.vercel.app/api/products";
        const res = await fetch(apiUrl, { signal });
        const data = await res.json();

        // Ensure we get the correct array format
        const productsArray = Array.isArray(data) ? data : data?.data || data?.products || [];

        const filtered = productsArray.filter((product: Product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          product.category.toLowerCase().includes(searchQuery.toLowerCase()) // Also searches by category
        );
        setSearchResults(filtered.slice(0, 5));
      } catch (error) {
        if (error instanceof Error) {
          if (error.name !== "AbortError") {
            console.error("Search error:", error.message);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(fetchResults, 300);

    return () => {
      clearTimeout(delayDebounceFn);
      controller.abort();
    };
  }, [searchQuery]);

  const handleSearchNavigation = (productId: string) => {
    setIsSearchOpen(false);
    setSearchQuery("");
    router.push(`/product/${productId}`); // Navigates to product detail page
  };

  const handleViewAllResults = () => {
    setIsSearchOpen(false);
    router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
    setSearchQuery("");
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [router]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* 1. Logo & Mobile Menu Toggle */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              className="md:hidden p-2 -ml-2 text-muted-foreground hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            
            <Link href="/" className="flex items-center gap-2 group">
              <ShoppingBag className="h-6 w-6 text-[#16a34a] transition-transform group-hover:-rotate-12" />
              <span className="text-xl sm:text-2xl font-black tracking-tight text-foreground">AmarShop</span>
            </Link>
          </div>

          {/* 2. Desktop Navigation (Hidden on Mobile) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium absolute left-1/2 -translate-x-1/2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="transition-colors hover:text-[#16a34a] text-muted-foreground hover:font-semibold"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* 3. Actions (Search, User, Cart) */}
          <div className="flex items-center gap-1 sm:gap-4">
            
            {/* Global Real-Time Search Dialog */}
            <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:text-[#16a34a] hover:bg-[#16a34a]/10"
                >
                  <Search className="h-5 w-5" />
                  <span className="sr-only">Search</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px] top-[15%] translate-y-0 gap-0 p-0 outline-none overflow-hidden rounded-xl">
                <DialogHeader className="sr-only">
                  <DialogTitle>Search Products</DialogTitle>
                </DialogHeader>

                <div className="flex items-center border-b px-4 py-3 bg-white">
                  <Search className="mr-3 h-5 w-5 text-[#16a34a]" />
                  <input
                    className="flex h-12 w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
                    placeholder="Search for sarees, dresses, or categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                  {!isLoading && !searchQuery && (
                    <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                      <span className="text-xs">⌘</span>K
                    </kbd>
                  )}
                  {isLoading && (
                    <Loader2 className="h-5 w-5 animate-spin text-[#16a34a]" />
                  )}
                </div>

                {searchQuery && (
                  <div className="max-h-[350px] overflow-y-auto p-2 bg-gray-50/50">
                    {searchResults.length > 0 ? (
                      <div className="space-y-1">
                        <p className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-gray-500">
                          Top Results
                        </p>
                        {searchResults.map((product) => (
                          <div
                            key={product._id || product.id}
                            onClick={() => handleSearchNavigation((product._id || product.id) as string)}
                            className="flex items-center gap-4 rounded-xl px-3 py-2 hover:bg-white hover:shadow-sm cursor-pointer transition-all group border border-transparent hover:border-gray-100"
                          >
                            <div className="relative h-12 w-12 overflow-hidden rounded-lg border bg-muted shrink-0">
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                sizes="48px"
                                className="object-cover group-hover:scale-105 transition-transform"
                              />
                            </div>
                            <div className="flex-1 overflow-hidden">
                              <p className="truncate text-sm font-bold text-gray-900 group-hover:text-[#16a34a] transition-colors">
                                {product.name}
                              </p>
                              <p className="text-xs text-gray-500 truncate mt-0.5">
                                {product.category}
                              </p>
                            </div>
                            <div className="text-sm font-black text-[#16a34a]">
                              ৳{product.price.toLocaleString()}
                            </div>
                          </div>
                        ))}

                        <Button
                          className="w-full mt-3 h-10 bg-white text-[#16a34a] border border-[#16a34a] hover:bg-[#16a34a] hover:text-white transition-colors"
                          onClick={handleViewAllResults}
                        >
                          View all results for "{searchQuery}"
                        </Button>
                      </div>
                    ) : (
                      !isLoading && (
                        <div className="py-14 text-center">
                          <Search className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                          <p className="text-sm font-medium text-gray-900">No results found</p>
                          <p className="text-xs text-gray-500 mt-1">We couldn't find anything for "{searchQuery}"</p>
                        </div>
                      )
                    )}
                  </div>
                )}
              </DialogContent>
            </Dialog>

            {/* User Profile (Hidden on very small screens) */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:flex hover:text-[#16a34a] hover:bg-[#16a34a]/10"
            >
              <User className="h-5 w-5" />
              <span className="sr-only">Account</span>
            </Button>

            {/* Cart Button */}
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:text-[#16a34a] hover:bg-[#16a34a]/10"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Cart</span>
              {cartItemCount > 0 && (
                <span className="absolute 0 top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm animate-in zoom-in-50">
                  {cartItemCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* --- Mobile Navigation Menu (Slide Down Overlay) --- */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-background border-b shadow-xl animate-in slide-in-from-top-2 flex flex-col z-40 max-h-[calc(100vh-4rem)] overflow-y-auto">
          <nav className="flex flex-col p-4 gap-2">
            {NAV_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground rounded-xl hover:bg-[#16a34a]/10 hover:text-[#16a34a] transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="w-5 h-5 text-muted-foreground" />
                  {link.name}
                </Link>
              );
            })}
            <div className="h-px bg-border my-2" />
            <Link
              href="/profile"
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground rounded-xl hover:bg-[#16a34a]/10 hover:text-[#16a34a] transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <User className="w-5 h-5 text-muted-foreground" />
              My Account
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}