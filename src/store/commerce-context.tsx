"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "@/types/product.types";
import { products } from "@/features/shop/data/products.data";

export type CartLine = { id: string; quantity: number };

export type CommerceContextValue = {
  cart: CartLine[];
  wishlist: string[];
  cartCount: number;
  cartTotal: number;
  addToCart: (id: string, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  toggleWishlist: (id: string) => void;
  clearCart: () => void;
  productFor: (id: string) => Product | undefined;
  toast: string;
};

const CommerceContext = createContext<CommerceContextValue | null>(null);
const CART_KEY = "apv-cart";
const WISHLIST_KEY = "apv-wishlist";

function readStored<T>(key: string, fallback: T): T {
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function CommerceProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setCart(readStored<CartLine[]>(CART_KEY, []));
      setWishlist(readStored<string[]>(WISHLIST_KEY, []));
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (ready) window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, ready]);

  useEffect(() => {
    if (ready) window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  }, [wishlist, ready]);

  const announce = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  }, []);

  const addToCart = useCallback((id: string, quantity = 1) => {
    setCart((current) => {
      const existing = current.find((line) => line.id === id);
      if (existing) {
        return current.map((line) => (line.id === id ? { ...line, quantity: line.quantity + quantity } : line));
      }
      return [...current, { id, quantity }];
    });
    announce("Product added to cart");
  }, [announce]);

  const removeFromCart = useCallback((id: string) => {
    setCart((current) => current.filter((line) => line.id !== id));
    announce("Product removed from cart");
  }, [announce]);

  const setQuantity = useCallback((id: string, quantity: number) => {
    if (quantity < 1) return;
    setCart((current) => current.map((line) => (line.id === id ? { ...line, quantity } : line)));
  }, []);

  const toggleWishlist = useCallback((id: string) => {
    setWishlist((current) => {
      const exists = current.includes(id);
      announce(exists ? "Removed from wishlist" : "Saved to wishlist");
      return exists ? current.filter((item) => item !== id) : [...current, id];
    });
  }, [announce]);

  const value = useMemo<CommerceContextValue>(() => ({
    cart,
    wishlist,
    cartCount: cart.reduce((sum, line) => sum + line.quantity, 0),
    cartTotal: cart.reduce((sum, line) => {
      const product = products.find((item) => item.id === line.id);
      return sum + (product?.price ?? 0) * line.quantity;
    }, 0),
    addToCart,
    removeFromCart,
    setQuantity,
    toggleWishlist,
    clearCart: () => {
      setCart([]);
      announce("Cart cleared");
    },
    productFor: (id) => products.find((item) => item.id === id),
    toast,
  }), [addToCart, cart, removeFromCart, setQuantity, toast, toggleWishlist, wishlist, announce]);

  return (
    <CommerceContext.Provider value={value}>
      {children}
      <div className={`site-toast ${toast ? "is-visible" : ""}`} role="status" aria-live="polite">{toast}</div>
    </CommerceContext.Provider>
  );
}

export function useCommerce() {
  const context = useContext(CommerceContext);
  if (!context) throw new Error("useCommerce must be used inside CommerceProvider");
  return context;
}
