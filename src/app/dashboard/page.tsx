"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import TableComponent from "@/components/table.component";
import AnalyticsChart from "@/components/analytic.component";
import { Product } from "@/types/page";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/sidebar.component";
import { useProfile } from "@/context/page";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { loading: load, user } = useProfile();

  useEffect(() => {

    // if (!load && !user) {
    //   router.push("/auth/login");
    //   return;
    // }
    fetch("https://dummyjson.com/products?limit=100")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products);
        setLoading(false);
      });
  }, []);

  const totalRevenue = products.reduce((acc, p) => acc + p.price * p.stock, 0);
  const averageRating = (products.reduce((acc, p) => acc + p.rating, 0) / products.length || 0).toFixed(2);
  const totalStock = products.reduce((acc, p) => acc + p.stock, 0);
  const totalCategories = new Set(products.map((p) => p.category)).size;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      {sidebarOpen && (
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      )}

      {/* Main Content */}
     
        {/* Header */}
        {/* <div className="flex justify-between items-center mb-4 ">
  
        </div> */}

        {/* Main Content */}
        <div className="flex-1 py-8 ml-0 overflow-y-scroll scroll-smooth h-screen p-6 space-y-6 transition-all duration-300">
          {/* Stats */}
        <div className="flex items-center  justify-start gap-4 ">
          <div className="bg-none mt-2" onClick={()=>setSidebarOpen(!sidebarOpen)}><i className={`fi fi-rr-angle-double-${sidebarOpen?"":"right"}`}></i></div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card><CardContent className="p-4"><div className="text-sm text-muted-foreground mb-1">Total Revenue</div><div className="text-2xl font-bold text-slate-600">${totalRevenue.toLocaleString()}</div><div className="text-sm text-green-400 mt-1">Price × Stock</div></CardContent></Card>
            <Card><CardContent className="p-4"><div className="text-sm text-muted-foreground mb-1">Avg. Rating</div><div className="text-2xl font-bold text-slate-600">{averageRating}</div><div className="text-sm text-blue-400 mt-1">Customer Score</div></CardContent></Card>
            <Card><CardContent className="p-4"><div className="text-sm text-muted-foreground mb-1">Total Stock</div><div className="text-2xl font-bold text-slate-600">{totalStock}</div><div className="text-sm text-yellow-400 mt-1">Inventory</div></CardContent></Card>
            <Card><CardContent className="p-4"><div className="text-sm text-muted-foreground mb-1">Categories</div><div className="text-2xl font-bold text-slate-600">{totalCategories}</div><div className="text-sm text-purple-400 mt-1">Segmented</div></CardContent></Card>
          </div>

          {/* Analytics Chart */}
          <AnalyticsChart productsList={products} />

          {/* Product Table */}
          <TableComponent productsList={products} setProductsList={setProducts} />
        </div>
    </div>
  );
}
