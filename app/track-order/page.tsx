"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, Package, Truck, CheckCircle2, Clock, MapPin, Phone, Hash, ArrowRight, Loader2, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


// --- Interfaces ---
interface OrderItem {
  name: string;
  image: string;
  quantity: number;
  price: number;
}

interface OrderStatus {
  id: string;
  orderNumber: string;
  status: string;
  items: OrderItem[];
  date: string;
  estimatedDelivery: string;
  timeline: { label: string; date: string; done: boolean; icon: React.ReactNode }[];
}

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const urlOrderId = searchParams.get("orderId");

  const [query, setQuery] = useState("");
  const [result, setResult] = useState<OrderStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [searchMethod, setSearchMethod] = useState<"order" | "mobile">("order");
  
  // Local Storage History State
  const [orderHistory, setOrderHistory] = useState<string[]>([]);

  // Load history from local storage (Using "my_orders" key)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const localHistory = JSON.parse(localStorage.getItem("my_orders") || "[]");
      setOrderHistory(localHistory.reverse());

      if (urlOrderId) {
        setSearchMethod("order");
        setQuery(urlOrderId);
        fetchOrder(urlOrderId, "order");
      }
    }
  }, [urlOrderId]);

  // Generate dynamic timeline based on live status
  const generateTimeline = (status: string, date: string) => {
    const s = status?.toLowerCase() || "";
    let currentLevel = 0;
    if (s.includes("processing") || s.includes("pending")) currentLevel = 1;
    if (s.includes("shipped")) currentLevel = 2;
    if (s.includes("transit")) currentLevel = 3;
    if (s.includes("delivered")) currentLevel = 4;

    const orderDate = date ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "N/A";

    return [
      { label: "Order Placed", date: orderDate, done: currentLevel >= 0, icon: <Package className="w-4 h-4" /> },
      { label: "Processing", date: currentLevel >= 1 ? "Done" : "Pending", done: currentLevel >= 1, icon: <Clock className="w-4 h-4" /> },
      { label: "Shipped", date: currentLevel >= 2 ? "Done" : "Pending", done: currentLevel >= 2, icon: <Truck className="w-4 h-4" /> },
      { label: "In Transit", date: currentLevel >= 3 ? "Done" : "Pending", done: currentLevel >= 3, icon: <MapPin className="w-4 h-4" /> },
      { label: "Delivered", date: currentLevel >= 4 ? "Delivered" : "Est. Delivery", done: currentLevel >= 4, icon: <CheckCircle2 className="w-4 h-4" /> },
    ];
  };

  const fetchOrder = async (searchQuery: string, method: "order" | "mobile") => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    setLoading(true);
    setNotFound(false);
    setResult(null);

    try {
      let apiUrl = `https://my-shop-t2x7.vercel.app/api/orders/track/${trimmed}`;
      if (method === "mobile") {
        apiUrl = `https://my-shop-t2x7.vercel.app/api/orders/track?phone=${trimmed}`;
      }

      const res = await fetch(apiUrl);
      const data = await res.json();

      if (data.success && data.data) {
        const orderData = Array.isArray(data.data) ? data.data[0] : data.data;

        if (!orderData) {
          setNotFound(true);
          return;
        }

        const dateStr = orderData.createdAt || orderData.date || new Date().toISOString();

        setResult({
          id: orderData._id || orderData.id,
          orderNumber: orderData._id || orderData.id,
          status: orderData.status?.toLowerCase() || "processing",
          items: orderData.items || [],
          date: new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          estimatedDelivery: "Estimated 3-5 Days", 
          timeline: generateTimeline(orderData.status, dateStr)
        });

        // Save new searches to Local Storage History
        if (method === "order") {
          const currentHistory = JSON.parse(localStorage.getItem("my_orders") || "[]");
          if (!currentHistory.includes(trimmed)) {
            const newHistory = [...currentHistory, trimmed];
            localStorage.setItem("my_orders", JSON.stringify(newHistory));
            setOrderHistory(newHistory.reverse());
          }
        }
      } else {
        setNotFound(true);
      }
    } catch (error) {
      console.error(error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handleTrack = () => fetchOrder(query, searchMethod);

  // Quick track from History
  const handleHistoryClick = (id: string) => {
    setSearchMethod("order");
    setQuery(id);
    fetchOrder(id, "order");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const statusColor = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("processing") || s.includes("pending")) return "bg-yellow-500/15 text-yellow-600 border-yellow-500/30";
    if (s.includes("shipped")) return "bg-blue-500/15 text-blue-600 border-blue-500/30";
    if (s.includes("transit")) return "bg-primary/15 text-primary border-primary/30";
    if (s.includes("delivered")) return "bg-emerald-500/15 text-emerald-600 border-emerald-500/30";
    if (s.includes("cancel")) return "bg-red-500/15 text-red-600 border-red-500/30";
    return "bg-muted text-muted-foreground";
  };

  return (
    <div className="min-h-screen">
     

      {/* Hero & Search Section */}
      <section className="pt-28 pb-10 sm:pt-36 sm:pb-16 bg-transparent">
        <div className="container-main px-4 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Truck className="w-4 h-4" />
            Track Your Order
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Where's My <span className="text-primary">Order?</span>
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg mb-10">
            Enter your order number or registered mobile number to track your shipment in real-time.
          </p>

          {/* Search Card */}
          <Card className="border-border/60 shadow-lg relative overflow-hidden mb-8">
            {loading && (
              <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            )}
            
            <CardContent className="p-6 sm:p-8">
              <Tabs
                defaultValue="order"
                value={searchMethod}
                onValueChange={(v) => {
                  setSearchMethod(v as "order" | "mobile");
                  setQuery("");
                  setResult(null);
                  setNotFound(false);
                }}
              >
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="order" className="gap-2">
                    <Hash className="w-4 h-4" /> Order Number
                  </TabsTrigger>
                  <TabsTrigger value="mobile" className="gap-2">
                    <Phone className="w-4 h-4" /> Mobile Number
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="order">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Input
                      placeholder="e.g. 65b2a3..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleTrack()}
                      className="h-12 text-base"
                    />
                    <Button onClick={handleTrack} disabled={loading} size="lg" className="gap-2 shrink-0">
                      <Search className="w-4 h-4" /> Track
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="mobile">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Input
                      placeholder="e.g. 01712345678"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleTrack()}
                      className="h-12 text-base"
                      type="tel"
                    />
                    <Button onClick={handleTrack} disabled={loading} size="lg" className="gap-2 shrink-0">
                      <Search className="w-4 h-4" /> Track
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Local Storage Orders History */}
          {!result && orderHistory.length > 0 && (
            <div className="animate-fade-in text-left bg-card border border-border/60 rounded-xl p-5 shadow-sm">
              <h3 className="flex items-center gap-2 text-sm font-bold text-foreground mb-4">
                <History className="w-4 h-4 text-primary" /> Your Recent Orders
              </h3>
              <div className="flex flex-wrap gap-2">
                {orderHistory.slice(0, 5).map((id, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleHistoryClick(id)}
                    className="flex items-center gap-2 bg-muted hover:bg-primary/10 border border-transparent hover:border-primary/30 px-4 py-2 rounded-lg text-sm font-medium text-foreground hover:text-primary transition-all"
                  >
                    <Hash className="w-3.5 h-3.5 opacity-50" />
                    {id.slice(-6).toUpperCase()}
                    <ArrowRight className="w-3.5 h-3.5 opacity-50 ml-1" />
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>

      {/* Result Section */}
      <section className="pb-20 px-4">
        <div className="max-w-2xl mx-auto">
          {notFound && (
            <Card className="border-destructive/30 bg-destructive/5 animate-fade-in">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                  <Search className="w-7 h-7 text-destructive" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">Order Not Found</h3>
                <p className="text-muted-foreground text-sm">
                  We couldn't find an order with that {searchMethod === "order" ? "order number" : "mobile number"}. Please double-check and try again.
                </p>
              </CardContent>
            </Card>
          )}

          {result && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Order Info & Items */}
              <Card className="overflow-hidden border-border/60 shadow-md">
                <CardHeader className="bg-muted/50 border-b pb-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1 font-medium">Order ID</p>
                      <h3 className="font-heading font-bold text-foreground text-lg">#{result.id}</h3>
                    </div>
                    <span className={`text-sm font-bold px-4 py-1.5 rounded-full border capitalize shrink-0 ${statusColor(result.status)}`}>
                      {result.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-border">
                    {result.items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex flex-col sm:flex-row p-5 sm:p-6 gap-5">
                        <div className="w-full sm:w-32 h-32 sm:h-auto bg-muted shrink-0 rounded-xl overflow-hidden border">
                          <img 
                            src={item.image || "/placeholder.png"} 
                            alt={item.name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                          <h4 className="font-bold text-foreground text-lg leading-tight mb-2">{item.name}</h4>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {item.selectedSize && (
                              <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-1 rounded">
                                Size: {item.selectedSize}
                              </span>
                            )}
                            {item.selectedColor && (
                              <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-1 rounded">
                                Color: {item.selectedColor}
                              </span>
                            )}
                          </div>
                          <div className="flex justify-between items-end mt-auto">
                            <div>
                              <p className="text-muted-foreground text-xs">Qty: {item.quantity}</p>
                            </div>
                            <p className="font-bold text-primary text-xl">৳{item.price?.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-muted/30 p-5 sm:p-6 border-t flex justify-between items-center">
                     <span className="font-bold text-muted-foreground">Total Amount:</span>
                     <span className="text-2xl font-black text-primary">
                       ৳{result.items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0).toLocaleString()}
                     </span>
                  </div>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card className="border-border/60 shadow-md">
                <CardContent className="p-6 sm:p-8">
                  <h3 className="font-heading font-bold text-lg text-foreground mb-8 border-b pb-4">Shipment Progress</h3>
                  <div className="space-y-0">
                    {result.timeline.map((step, i, arr) => (
                      <div key={i} className="flex gap-5">
                        {/* Connector */}
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors shadow-sm ${
                            step.done
                              ? "bg-primary border-primary text-primary-foreground"
                              : "bg-card border-border text-muted-foreground"
                          }`}>
                            {step.icon}
                          </div>
                          {i < arr.length - 1 && (
                            <div className={`w-0.5 h-12 my-1 ${step.done ? "bg-primary/50" : "bg-border"}`} />
                          )}
                        </div>
                        {/* Info */}
                        <div className="pt-2 pb-6">
                          <p className={`text-base font-bold ${step.done ? "text-foreground" : "text-muted-foreground"}`}>
                            {step.label}
                          </p>
                          <p className="text-sm text-muted-foreground mt-0.5">{step.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Help */}
              <Card className="bg-primary/5 border-primary/20 shadow-sm">
                <CardContent className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-center sm:text-left">
                    <p className="font-bold text-foreground text-base">Need help with this order?</p>
                    <p className="text-sm text-muted-foreground mt-0.5">Our support team is here for you 24/7</p>
                  </div>
                  <Link href="/contact" className="w-full sm:w-auto">
                    <Button className="gap-1.5 shrink-0 w-full sm:w-auto">
                      Contact Us <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

            </div>
          )}
        </div>
      </section>

    
    </div>
  );
}

// Next.js Search Params Wrapper (Suspense)
export default function TrackOrder() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-sm text-muted-foreground animate-pulse">Loading tracking system...</p>
      </div>
    }>
      <TrackOrderContent />
    </Suspense>
  );
}