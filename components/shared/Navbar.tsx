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
  { name: "Shop", href: "/shop", icon: ShoppingBag },
  { name: "Collections", href: "/collections", icon: ShoppingBag },
  { name: "My Order", href: "/track-order", icon: Sparkles },
  { name: "About Us", href: "/about", icon: Info },
];

export default function Navbar() {
  const router = useRouter();

  // Temporary Static Cart Count (Desktop only request)
  const cartItemCount = 5;

  // Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${apiUrl}/api/products`, { signal });
        const data = await res.json();

        if (data.success) {
          const filtered = data.data.filter((product: Product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()),
          );
          setSearchResults(filtered.slice(0, 5));
        }
      } catch (error) {
        if (error instanceof Error) {
          if (error.name !== "AbortError") {
            console.error("Search error:", error.message);
          }
        } else {
          console.error("An unknown error occurred:", error);
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
    router.push(`/shop/${productId}`);
  };

  const handleViewAllResults = () => {
    setIsSearchOpen(false);
    router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
    setSearchQuery("");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-8">
        <div className="flex h-16 items-center justify-between">
          {/* 1. Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <ShoppingBag className="h-6 w-6 text-primary transition-transform group-hover:-rotate-12" />
              <span className="text-xl font-bold tracking-tight">AmarShop</span>
            </Link>
          </div>

          {/* 2. Desktop Navigation */}
          <nav className="flex items-center gap-8 text-sm font-medium absolute left-1/2 -translate-x-1/2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="transition-colors hover:text-primary text-muted-foreground"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* 3. Actions (Search, User, Cart) */}
          <div className="flex items-center gap-4">
            {/* Real-Time Search Dialog */}
            <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:text-primary"
                >
                  <Search className="h-5 w-5" />
                  <span className="sr-only">Search</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px] top-[15%] translate-y-0 gap-0 p-0 outline-none overflow-hidden">
                <DialogHeader className="sr-only">
                  <DialogTitle>Search Products</DialogTitle>
                </DialogHeader>

                <div className="flex items-center border-b px-4 py-3">
                  <Search className="mr-2 h-5 w-5 text-muted-foreground" />
                  <input
                    className="flex h-10 w-full rounded-md bg-transparent py-3 text-base outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                  {isLoading && (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground ml-2" />
                  )}
                </div>

                {searchQuery && (
                  <div className="max-h-[300px] overflow-y-auto p-2">
                    {searchResults.length > 0 ? (
                      <div className="space-y-1">
                        <p className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                          Products
                        </p>
                        {searchResults.map((product) => (
                          <div
                            key={product._id || product.id}
                            onClick={() =>
                              handleSearchNavigation(
                                (product._id || product.id) as string,
                              )
                            }
                            className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-muted cursor-pointer transition-colors group"
                          >
                            <div className="relative h-10 w-10 overflow-hidden rounded-md border bg-muted shrink-0">
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 overflow-hidden">
                              <p className="truncate text-sm font-medium text-foreground group-hover:text-primary">
                                {product.name}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {product.category}
                              </p>
                            </div>
                            <div className="text-sm font-bold text-foreground">
                              ৳{product.price}
                            </div>
                          </div>
                        ))}

                        <Button
                          variant="secondary"
                          className="w-full mt-2 h-9 text-xs"
                          onClick={handleViewAllResults}
                        >
                          View all results for "{searchQuery}"
                        </Button>
                      </div>
                    ) : (
                      !isLoading && (
                        <div className="py-10 text-center text-sm text-muted-foreground">
                          No products found for "{searchQuery}"
                        </div>
                      )
                    )}
                  </div>
                )}

                {!searchQuery && (
                  <div className="p-4 text-xs text-muted-foreground text-center">
                    Type to start searching...
                  </div>
                )}
              </DialogContent>
            </Dialog>

            {/* User Profile */}
            <Button
              variant="ghost"
              size="icon"
              className="flex hover:text-primary"
            >
              <User className="h-5 w-5" />
              <span className="sr-only">Account</span>
            </Button>

            {/* Cart Button (Static Count) */}
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:text-primary"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Cart</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground animate-in zoom-in-50">
                  {cartItemCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
