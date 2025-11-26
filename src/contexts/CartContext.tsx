import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem } from "@/types/tour";

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (tourId: string) => void;
  updateItem: (tourId: string, updates: Partial<CartItem>) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.tour.id === item.tour.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = item;
        return updated;
      }
      return [...prev, item];
    });
  };

  const removeItem = (tourId: string) => {
    setItems((prev) => prev.filter((item) => item.tour.id !== tourId));
  };

  const updateItem = (tourId: string, updates: Partial<CartItem>) => {
    setItems((prev) =>
      prev.map((item) =>
        item.tour.id === tourId ? { ...item, ...updates } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce(
    (sum, item) => sum + item.adults + item.children + item.infants,
    0
  );

  const totalPrice = items.reduce((sum, item) => {
    const tourTotal =
      item.tour.priceAdult * item.adults +
      item.tour.priceChild * item.children +
      item.tour.priceInfant * item.infants;
    return sum + tourTotal;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateItem,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
