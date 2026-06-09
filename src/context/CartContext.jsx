import { createContext, useState, useEffect, useCallback } from 'react';
import API from '../api/axios';
import useAuth from '../hooks/useAuth';
import toast from 'react-hot-toast';

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const getCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      return;
    }
    setLoading(true);
    try {
      const { data } = await API.get('/cart');
      setCartItems(data.data?.items || []);
    } catch {
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    getCart();
  }, [getCart]);

  const addToCart = async (productId, qty = 1, size, color) => {
    try {
      const { data } = await API.post('/cart', { productId, qty, size, color });
      setCartItems(data.data?.items || []);
      toast.success('Added to cart!');
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
      throw error;
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const { data } = await API.delete(`/cart/item/${productId}`);
      setCartItems(data.data?.items || []);
      toast.success('Removed from cart');
      return data;
    } catch (error) {
      toast.error('Failed to remove item');
      throw error;
    }
  };

  const updateCartItem = async (productId, qty) => {
    try {
      const { data } = await API.put(`/cart/item/${productId}`, { qty });
      setCartItems(data.data?.items || []);
      return data;
    } catch (error) {
      toast.error('Failed to update cart');
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      await API.delete('/cart');
      setCartItems([]);
    } catch {
      toast.error('Failed to clear cart');
    }
  };

  const cartCount = cartItems.reduce((sum, item) => sum + (item.qty || 1), 0);

  return (
    <CartContext.Provider value={{
      cartItems, loading, cartCount,
      addToCart, removeFromCart, updateCartItem, clearCart, getCart
    }}>
      {children}
    </CartContext.Provider>
  );
};
