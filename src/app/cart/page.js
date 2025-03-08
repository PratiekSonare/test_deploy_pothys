"use client"
import React from 'react';
import { useCart } from './CartContext'; // Adjust the path as necessary
import { Button } from "@/components/ui/button"; // Import Shadcn UI Button
import { Card } from "@/components/ui/card"; // Import Shadcn UI Card
import { Separator } from "@/components/ui/separator"; // Import Shadcn UI Separator

const Cart = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cartItems.map((item, index) => (
            <Card key={item.id || index} className="mb-4 p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p className="text-gray-600">Price: ₹{item.price}</p>
                  <p className="text-gray-600">Quantity: {item.quantity}</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => removeFromCart(item.id)}
                  aria-label={`Remove ${item.name} from cart`}
                >
                  Remove
                </Button>
              </div>
            </Card>
          ))}
          <Separator className="my-4" />
          <div className="flex justify-between">
            <Button variant="outline" onClick={clearCart}>
              Clear Cart
            </Button>
            <Button variant="solid" className="bg-blue-600 text-white">
              Checkout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;