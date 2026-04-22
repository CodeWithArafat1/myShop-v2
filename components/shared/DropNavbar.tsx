"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
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
  ChevronDown,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useCart } from "@/contexts/CartContext";

// --- TypeScript Interfaces ---
interface Product {
  _id?: string;
  id?: string;
  name: string;
  category: string;
  price: number;
  image: string;
}

interface NavLink {
  name: string;
  href: string;
  icon: any;
  subLinks?: { name: string; href: string }[];
}

// --- Base Static Links (Without Collections SubLinks initially) ---
const BASE_NAV_LINKS = [
  { name: "Home", href: "/", icon: Home },
  { name: "Shop", href: "/product", icon: ShoppingBag },
  { name: "Collections", href: "/collections", icon: Sparkles }, // SubLinks will be injected dynamically
  { name: "My Order", href: "/track-order", icon: ShoppingBag },
  { name: "Contact", href: "/contact", icon: Info },
  { name: "About Us", href: "/about", icon: Info },
];

export default function DropNavbar() {
  const router = useRouter();
  
  // --- Active Link Tracking ---
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams ? searchParams.get("category") : null;

  // --- Cart Context Integration ---
  const { cart, setIsOpen, isLoading: isCartLoading } = useCart();
  const totalItems = cart.reduce((total: number, item: any) => total + item.quantity, 0);

  // --- States ---
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMobileDropdown, setActiveMobileDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  
  // --- Dynamic Collections State ---
  const [dynamicCategories, setDynamicCategories] = useState<{ name: string; href: string }[]>([]);

  // --- Global Keyboard Shortcut for Search ---
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

  // --- Real-time Search Logic ---
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsLoadingSearch(false);
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchResults = async () => {
      setIsLoadingSearch(true);
      try {
        const apiUrl = "https://my-shop-t2x7.vercel.app/api/products";
        const res = await fetch(apiUrl, { signal });
        const data = await res.json();
        const productsArray = Array.isArray(data) ? data : data?.data || data?.products || [];

        const filtered = productsArray.filter((product: Product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          product.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(filtered.slice(0, 5));
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Search error:", error.message);
        }
      } finally {
        setIsLoadingSearch(false);
      }
    };

    const delayDebounceFn = setTimeout(fetchResults, 300);
    return () => {
      clearTimeout(delayDebounceFn);
      controller.abort();
    };
  }, [searchQuery]);

  // --- Dynamic Categories Fetching (Optimized with Session Storage) ---
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cachedData = sessionStorage.getItem("shop_products_cache");
        let products = [];

        if (cachedData) {
          products = JSON.parse(cachedData);
        } else {
          const res = await fetch("https://my-shop-t2x7.vercel.app/api/products");
          const data = await res.json();
          products = Array.isArray(data) ? data : data?.data || data?.products || [];
          
          if (products.length > 0) {
            sessionStorage.setItem("shop_products_cache", JSON.stringify(products));
          }
        }

        const uniqueCategories = [...new Set(products.map((p: any) => p.category).filter(Boolean))];
        const subLinks = uniqueCategories.map((cat: any) => ({
          name: cat,
          href: `/product?category=${encodeURIComponent(cat)}` 
        }));

        setDynamicCategories(subLinks);
      } catch (error) {
        console.error("Failed to load navbar categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // --- Merge Base Links with Dynamic Collections ---
  const navLinks = useMemo(() => {
    return BASE_NAV_LINKS.map(link => {
      if (link.name === "Collections" && dynamicCategories.length > 0) {
        return { ...link, subLinks: dynamicCategories };
      }
      return link;
    });
  }, [dynamicCategories]);

  // --- Handlers ---
  const handleSearchNavigation = (productId: string) => {
    setIsSearchOpen(false);
    setSearchQuery("");
    router.push(`/product/${productId}`);
  };

  const handleViewAllResults = () => {
    setIsSearchOpen(false);
    router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
    setSearchQuery("");
  };

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveMobileDropdown(null);
  }, [pathname, searchParams]); // Close menu on route change

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo & Mobile Menu Toggle */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              className="md:hidden p-2 -ml-2 text-muted-foreground hover:text-[#16a34a] transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            
            <Link href="/" className="flex items-center gap-2 group">
              <ShoppingBag className="h-6 w-6 text-[#16a34a] transition-transform group-hover:-rotate-12" />
              <span className="text-xl sm:text-2xl font-black tracking-tight text-foreground">AmarShop</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => {
              // Check if main link is active
              const isMainActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));

              return (
                <div key={link.name} className="relative group">
                  <Link
                    href={link.href}
                    className={`flex items-center gap-1.5 transition-colors hover:text-[#16a34a] py-6 ${
                      isMainActive ? "text-[#16a34a] font-bold" : "text-muted-foreground hover:font-semibold"
                    }`}
                  >
                    {link.name}
                    {link.subLinks && link.subLinks.length > 0 && (
                      <ChevronDown className="h-4 w-4 transition-transform duration-300 group-hover:-rotate-180" />
                    )}
                  </Link>

                  {/* Pure CSS Zero-Lag Dropdown */}
                  {link.subLinks && link.subLinks.length > 0 && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-[calc(100%-0.5rem)] w-48 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 ease-out z-50">
                      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-2 flex flex-col gap-1 mt-1 relative before:absolute before:-top-2 before:left-0 before:w-full before:h-4 max-h-80 overflow-y-auto">
                        {link.subLinks.map((subLink) => {
                          // Check if sublink (category) is active
                          const isSubLinkActive = currentCategory === subLink.name;
                          
                          return (
                            <Link
                              key={subLink.name}
                              href={subLink.href}
                              className={`px-3 py-2 text-sm hover:text-[#16a34a] hover:bg-[#16a34a]/10 hover:font-medium rounded-lg transition-all capitalize ${
                                isSubLinkActive ? "text-[#16a34a] bg-[#16a34a]/10 font-bold" : "text-gray-600"
                              }`}
                            >
                              {subLink.name}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Actions (Search, User, Cart) */}
          <div className="flex items-center gap-1 sm:gap-4">
            {/* Search Dialog */}
            <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:text-[#16a34a] hover:bg-[#16a34a]/10">
                  <Search className="h-5 w-5" />
                  <span className="sr-only">Search</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px] top-[15%] translate-y-0 gap-0 p-0 outline-none overflow-hidden rounded-xl">
                {/* Search dialog content kept unchanged */}
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
                  {!isLoadingSearch && !searchQuery && (
                    <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                      <span className="text-xs">⌘</span>K
                    </kbd>
                  )}
                  {isLoadingSearch && (
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
                              <p className="text-xs text-gray-500 truncate mt-0.5 capitalize">
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
                      !isLoadingSearch && (
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

            {/* User Profile */}
            <Button variant="ghost" size="icon" className="hidden sm:flex hover:text-[#16a34a] hover:bg-[#16a34a]/10">
              <User className="h-5 w-5" />
              <span className="sr-only">Account</span>
            </Button>

            {/* Cart Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(true)}
              className="relative hover:text-[#16a34a] hover:bg-[#16a34a]/10"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Cart</span>
              {!isCartLoading && totalItems > 0 && (
                <span className="absolute 0 top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm animate-in zoom-in-50">
                  {totalItems}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-background border-b shadow-xl animate-in slide-in-from-top-2 flex flex-col z-40 max-h-[calc(100vh-4rem)] overflow-y-auto">
          <nav className="flex flex-col p-4 gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const hasSubLinks = link.subLinks && link.subLinks.length > 0;
              const isOpen = activeMobileDropdown === link.name;
              
              // Check if main link is active (for Mobile)
              const isMainActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));

              return (
                <div key={link.name} className="flex flex-col">
                  <div
                    className={`flex items-center justify-between px-4 py-3 rounded-xl hover:bg-[#16a34a]/10 transition-colors cursor-pointer group ${
                      isMainActive ? "bg-[#16a34a]/10" : ""
                    }`}
                    onClick={() => {
                      if (hasSubLinks) {
                        setActiveMobileDropdown(isOpen ? null : link.name);
                      } else {
                        router.push(link.href);
                        setIsMobileMenuOpen(false);
                      }
                    }}
                  >
                    <div className={`flex items-center gap-3 text-sm font-medium group-hover:text-[#16a34a] ${isMainActive ? "text-[#16a34a]" : "text-foreground"}`}>
                      <Icon className={`w-5 h-5 group-hover:text-[#16a34a] ${isMainActive ? "text-[#16a34a]" : "text-muted-foreground"}`} />
                      {link.name}
                    </div>
                    {hasSubLinks && (
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180 text-[#16a34a]" : "text-muted-foreground"}`} />
                    )}
                  </div>

                  {/* Mobile SubLinks Accordion */}
                  {hasSubLinks && (
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-64 opacity-100 mt-1" : "max-h-0 opacity-0"}`}>
                      <div className="flex flex-col gap-1 pl-12 pr-4 border-l-2 border-[#16a34a]/20 ml-6 py-1">
                        {link.subLinks!.map((subLink) => {
                          // Check if sublink (category) is active (Mobile)
                          const isSubLinkActive = currentCategory === subLink.name;
                          
                          return (
                            <Link
                              key={subLink.name}
                              href={subLink.href}
                              className={`py-2 text-sm hover:text-[#16a34a] hover:font-medium transition-colors capitalize ${
                                isSubLinkActive ? "text-[#16a34a] font-bold" : "text-muted-foreground"
                              }`}
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {subLink.name}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            
            <div className="h-px bg-border my-2" />
            <Link
              href="/profile"
              className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl hover:bg-[#16a34a]/10 hover:text-[#16a34a] transition-colors ${
                pathname === "/profile" ? "bg-[#16a34a]/10 text-[#16a34a]" : "text-foreground"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <User className={`w-5 h-5 ${pathname === "/profile" ? "text-[#16a34a]" : "text-muted-foreground"}`} />
              My Account
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}