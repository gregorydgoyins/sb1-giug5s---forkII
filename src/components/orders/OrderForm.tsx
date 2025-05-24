```tsx
import React, { useState, useEffect } from 'react';
import { ShoppingCart, AlertCircle } from 'lucide-react';
import type { Order, ValidationError } from '../../types';

interface OrderFormProps {
  onSubmit: (order: Order) => void;
  isProcessing: boolean;
  errors: ValidationError[];
}

export function OrderForm({ onSubmit, isProcessing, errors }: OrderFormProps) {
  const [formData, setFormData] = useState<Partial<Order>>({
    quantity: 1,
    price: 0,
    total: 0
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      // Recalculate total
      if (name === 'quantity' || name === 'price') {
        newData.total = (Number(newData.quantity) || 0) * (Number(newData.price) || 0);
      }
      return newData;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as Order);
  };

  const getFieldError = (fieldName: string): string | undefined => {
    return errors.find(error => error.field === fieldName)?.message;
  };

  return (
    <div className="card">
      <div className="flex items-center space-x-2 mb-6">
        <ShoppingCart className="h-6 w-6 text-indigo-400" />
        <h2 className="text-2xl font-bold text-white">Order Details</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Asset Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Asset
            </label>
            <select 
              name="asset"
              className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white"
              onChange={(e) => setFormData(prev => ({ ...prev, asset: e.target.value }))}
            >
              <option value="">Select Asset</option>
              <option value="ASM300">Amazing Spider-Man #300</option>
              <option value="BAT457">Batman #457</option>
              <option value="XMN141">X-Men #141</option>
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Quantity
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
              className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white"
            />
            {getFieldError('quantity') && (
              <p className="mt-1 text-sm text-red-400">{getFieldError('quantity')}</p>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Price (CC)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white"
            />
          </div>

          {/* Total */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Total (CC)
            </label>
            <input
              type="number"
              name="total"
              value={formData.total}
              readOnly
              className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white"
            />
            {getFieldError('total') && (
              <p className="mt-1 text-sm text-red-400">{getFieldError('total')}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isProcessing}
          className={`w-full p-4 rounded-lg font-medium transition-colors ${
            isProcessing
              ? 'bg-slate-700/50 text-gray-500 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          {isProcessing ? 'Processing...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
}
```