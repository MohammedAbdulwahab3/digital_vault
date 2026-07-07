"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
};

export type CartLine = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  category: string;
};

type Toast = { id: number; icon: string; message: string };

type StoreContextValue = {
  user: SessionUser | null;
  authReady: boolean;
  cart: CartLine[];
  wishlist: string[];
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addToCart: (line: CartLine) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCartLocal: () => void;
  toggleWishlist: (productId: string) => Promise<void>;
  toast: (icon: string, message: string) => void;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
};

const StoreContext = createContext<StoreContextValue | null>(null);

const CART_KEY = "pv_cart";
const WISHLIST_KEY = "pv_wishlist";

function readLocal<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);

  const toast = useCallback((icon: string, message: string) => {
    const id = ++toastId.current;
    setToasts((prev) => [...prev.slice(-2), { id, icon, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2600);
  }, []);

  const loadServerState = useCallback(async () => {
    const [cartRes, wishRes] = await Promise.all([
      fetch("/api/cart"),
      fetch("/api/wishlist"),
    ]);
    if (cartRes.ok) {
      const data = await cartRes.json();
      setCart(data.items ?? []);
    }
    if (wishRes.ok) {
      const data = await wishRes.json();
      setWishlist(data.productIds ?? []);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = res.ok ? await res.json() : { user: null };
      setUser(data.user);
      if (data.user) {
        // Merge any guest cart/wishlist into the account, then use server state
        const guestCart = readLocal<CartLine[]>(CART_KEY, []);
        const guestWish = readLocal<string[]>(WISHLIST_KEY, []);
        if (guestCart.length || guestWish.length) {
          await fetch("/api/cart/merge", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              cartProductIds: guestCart.map((c) => c.productId),
              wishlistProductIds: guestWish,
            }),
          });
          localStorage.removeItem(CART_KEY);
          localStorage.removeItem(WISHLIST_KEY);
        }
        await loadServerState();
      } else {
        setCart(readLocal<CartLine[]>(CART_KEY, []));
        setWishlist(readLocal<string[]>(WISHLIST_KEY, []));
      }
    } catch {
      setUser(null);
    } finally {
      setAuthReady(true);
    }
  }, [loadServerState]);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const persistGuestCart = (next: CartLine[]) => {
    localStorage.setItem(CART_KEY, JSON.stringify(next));
  };

  const addToCart = useCallback(
    async (line: CartLine) => {
      if (cart.some((c) => c.productId === line.productId)) {
        toast("ℹ️", "Already in your cart");
        setCartOpen(true);
        return;
      }
      setCart((prev) => {
        const next = [...prev, line];
        if (!user) persistGuestCart(next);
        return next;
      });
      toast("🛒", `${line.name} added to cart`);
      if (user) {
        await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: line.productId }),
        });
      }
    },
    [cart, user, toast]
  );

  const removeFromCart = useCallback(
    async (productId: string) => {
      setCart((prev) => {
        const next = prev.filter((c) => c.productId !== productId);
        if (!user) persistGuestCart(next);
        return next;
      });
      if (user) {
        await fetch(`/api/cart?productId=${productId}`, { method: "DELETE" });
      }
    },
    [user]
  );

  const clearCartLocal = useCallback(() => {
    setCart([]);
    if (typeof window !== "undefined") localStorage.removeItem(CART_KEY);
  }, []);

  const toggleWishlist = useCallback(
    async (productId: string) => {
      const has = wishlist.includes(productId);
      setWishlist((prev) => {
        const next = has ? prev.filter((id) => id !== productId) : [...prev, productId];
        if (!user) localStorage.setItem(WISHLIST_KEY, JSON.stringify(next));
        return next;
      });
      toast(has ? "💔" : "❤️", has ? "Removed from wishlist" : "Added to wishlist");
      if (user) {
        await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        });
      }
    },
    [wishlist, user, toast]
  );

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setCart([]);
    setWishlist([]);
    toast("👋", "Signed out");
    window.location.href = "/";
  }, [toast]);

  return (
    <StoreContext.Provider
      value={{
        user,
        authReady,
        cart,
        wishlist,
        cartOpen,
        setCartOpen,
        addToCart,
        removeFromCart,
        clearCartLocal,
        toggleWishlist,
        toast,
        refreshUser,
        logout,
      }}
    >
      {children}
      {/* Toast stack */}
      <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="glass-strong flex items-center gap-3 rounded-2xl px-4 py-3 text-sm shadow-2xl"
            >
              <span className="text-lg">{t.icon}</span>
              <span className="font-medium">{t.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
