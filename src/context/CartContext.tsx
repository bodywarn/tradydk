import React, { createContext, useContext, useState, useEffect } from 'react';

export interface LogoPosition {
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export type PrintType = 'dtg' | 'broderi' | 'screen' | 'embroidery' | 'vinyl';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
  customLogo?: string;
  logoPosition?: LogoPosition;
  decorationSide?: 'front' | 'back' | 'both';
  decorationArea?: 'full' | 'chest';
  printType?: string;        
  printExtraPrice?: number; 
  basePrice?: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, size: string, color: string, customLogo?: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number, customLogo?: string) => void;
  getCartTotal: () => number;
  clearCart: () => void;
  getTierPriceForProduct: (productId: string, basePrice: number, tierPrices?: any[]) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          const parsed = JSON.parse(savedCart);
          if (Array.isArray(parsed)) setCartItems(parsed);
        }
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      } finally {
        setIsLoading(false);
      }
    };
    const timer = setTimeout(loadCart, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem('cart', JSON.stringify(cartItems));
      } catch (error) {
        console.error('Error saving cart:', error);
      }
    }
  }, [cartItems, isLoading]);

  const getItemGroupKey = (item: CartItem): string =>
    [
      item.productId,
      item.customLogo      || 'no-logo',
      item.decorationSide  || 'no-side',
      item.decorationArea  || 'no-area',
      item.printType       || 'no-print',
    ].join('|');

  const getTierPriceForProduct = (productId: string, basePrice: number, tierPrices?: any[]): number => {
    if (!tierPrices?.length) return basePrice;

    const groupQuantities = new Map<string, number>();
    cartItems
      .filter(item => item.productId === productId)
      .forEach(item => {
        const key = getItemGroupKey(item);
        groupQuantities.set(key, (groupQuantities.get(key) ?? 0) + item.quantity);
      });

    const maxQuantity = Math.max(...Array.from(groupQuantities.values()), 0);
    const validTiers  = tierPrices.filter(tp => tp.price > 0);
    if (!validTiers.length) return basePrice;

    const match = validTiers.find(tier =>
      maxQuantity >= tier.minQuantity &&
      (tier.maxQuantity === null || maxQuantity <= tier.maxQuantity)
    );
    return match ? match.price : basePrice;
  };

  const addToCart = (item: CartItem) => {
    if (!item.productId || !item.name || item.quantity <= 0) return;

    setCartItems(prev => {
      const idx = prev.findIndex(c =>
        c.productId      === item.productId &&
        c.size           === item.size &&
        c.color          === item.color &&
        c.customLogo     === item.customLogo &&
        c.decorationSide === item.decorationSide &&
        c.decorationArea === item.decorationArea &&
        c.printType      === item.printType
      );

      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + item.quantity };
        return updated;
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (productId: string, size: string, color: string, customLogo?: string) => {
    setCartItems(prev =>
      prev.filter(item =>
        !(item.productId === productId &&
          item.size      === size &&
          item.color     === color &&
          item.customLogo === customLogo)
      )
    );
  };

  const updateQuantity = (
    productId: string, size: string, color: string,
    quantity: number, customLogo?: string
  ) => {
    if (quantity <= 0) { removeFromCart(productId, size, color, customLogo); return; }
    setCartItems(prev =>
      prev.map(item =>
        item.productId  === productId &&
        item.size       === size &&
        item.color      === color &&
        item.customLogo === customLogo
          ? { ...item, quantity }
          : item
      )
    );
  };

  const getCartTotal = () =>
    cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  return (
    <CartContext.Provider value={{
      cartItems, addToCart, removeFromCart,
      updateQuantity, getCartTotal, clearCart,
      getTierPriceForProduct,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};