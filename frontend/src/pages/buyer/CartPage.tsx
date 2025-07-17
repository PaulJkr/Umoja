import React from "react";
import { useCartStore } from "../../context/cartStore";
import { Minus, Plus, Trash2, ShoppingCart, Loader } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CartPage = () => {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    checkout,
    isCheckingOut,
  } = useCartStore();

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">🛒 My Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          <ShoppingCart className="w-10 h-10 mx-auto mb-4" />
          <p>Your cart is empty.</p>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {cartItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <h2 className="font-semibold text-gray-800">{item.name}</h2>
                    <p className="text-gray-500 text-sm">
                      KES {item.price.toFixed(2)} x {item.quantity}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => decreaseQuantity(item.id)}
                    className="bg-gray-100 p-2 rounded-lg hover:bg-gray-200 transition"
                  >
                    <Minus className="w-4 h-4 text-gray-700" />
                  </button>
                  <span className="font-medium">{item.quantity}</span>
                  <button
                    onClick={() => increaseQuantity(item.id)}
                    className="bg-gray-100 p-2 rounded-lg hover:bg-gray-200 transition"
                  >
                    <Plus className="w-4 h-4 text-gray-700" />
                  </button>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="ml-4 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 bg-gray-50 border border-gray-200 rounded-xl p-6">
            <div className="flex justify-between items-center text-lg font-medium text-gray-800 mb-4">
              <span>Total:</span>
              <span>KES {total.toFixed(2)}</span>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={clearCart}
                className="px-5 py-3 rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-700 transition"
              >
                Clear Cart
              </button>
              <button
                onClick={checkout}
                disabled={isCheckingOut}
                className="px-5 py-3 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 disabled:opacity-50 transition"
              >
                {isCheckingOut ? (
                  <div className="flex items-center space-x-2">
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  "Checkout"
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
