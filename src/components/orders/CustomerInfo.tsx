```tsx
import React from 'react';
import { User, MapPin, CreditCard } from 'lucide-react';

export function CustomerInfo() {
  return (
    <div className="card">
      <div className="flex items-center space-x-2 mb-6">
        <User className="h-6 w-6 text-indigo-400" />
        <h2 className="text-2xl font-bold text-white">Customer Information</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Personal Details</h3>
          <div>
            <label className="block text-sm font-medium text-gray-400">Name</label>
            <p className="text-white">John Doe</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400">Player ID</label>
            <p className="text-white">#123456789</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400">Email</label>
            <p className="text-white">john.doe@example.com</p>
          </div>
        </div>

        {/* Shipping Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Shipping Address</h3>
          <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
            <div className="flex items-center space-x-2 mb-2">
              <MapPin className="h-4 w-4 text-indigo-400" />
              <span className="text-white font-medium">Primary Address</span>
            </div>
            <p className="text-gray-300">123 Comic Street</p>
            <p className="text-gray-300">Apartment 4B</p>
            <p className="text-gray-300">New York, NY 10001</p>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-4 md:col-span-2">
          <h3 className="text-lg font-semibold text-white">Payment Methods</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
              <div className="flex items-center space-x-2 mb-2">
                <CreditCard className="h-4 w-4 text-indigo-400" />
                <span className="text-white font-medium">Primary Card</span>
              </div>
              <p className="text-gray-300">**** **** **** 4242</p>
              <p className="text-gray-300">Expires 12/25</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```