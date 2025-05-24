```tsx
import React, { useState, useEffect } from 'react';
import { useMarketStore } from '../../store/marketStore';
import { AlertCircle, DollarSign, History, User } from 'lucide-react';
import { CustomerInfo } from './CustomerInfo';
import { OrderForm } from './OrderForm';
import { TransactionHistory } from './TransactionHistory';
import { OrderSummary } from './OrderSummary';
import type { Order, ValidationError } from '../../types';

export function OrderEntry() {
  const { userBalance } = useMarketStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmitOrder = async (orderData: Order) => {
    setIsProcessing(true);
    setErrors([]);

    try {
      // Validate order
      const validationErrors = validateOrder(orderData);
      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        return;
      }

      // Process order
      await processOrder(orderData);
      
      // Clear form and show success
      setOrder(null);
      // Show success notification
    } catch (error: any) {
      setErrors([{ message: error.message }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const validateOrder = (orderData: Order): ValidationError[] => {
    const errors: ValidationError[] = [];

    // Check balance
    if (orderData.total > userBalance) {
      errors.push({
        field: 'total',
        message: 'Insufficient funds for this transaction'
      });
    }

    // Check quantity
    if (orderData.quantity <= 0) {
      errors.push({
        field: 'quantity',
        message: 'Quantity must be greater than 0'
      });
    }

    // Add other validations as needed

    return errors;
  };

  const processOrder = async (orderData: Order): Promise<void> => {
    // Implement order processing logic
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated delay
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Information */}
        <div className="lg:col-span-2">
          <CustomerInfo />
        </div>

        {/* Account Balance */}
        <div className="card">
          <div className="flex items-center space-x-2 mb-4">
            <DollarSign className="h-6 w-6 text-indigo-400" />
            <h2 className="text-2xl font-bold text-white">Account Balance</h2>
          </div>
          <div className="text-3xl font-bold text-white">
            CC {userBalance.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Order Form */}
      <OrderForm 
        onSubmit={handleSubmitOrder}
        isProcessing={isProcessing}
        errors={errors}
      />

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="bg-red-900/50 border border-red-700/50 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <h3 className="text-lg font-semibold text-red-400">Order Errors</h3>
          </div>
          <ul className="mt-2 space-y-1">
            {errors.map((error, index) => (
              <li key={index} className="text-red-300">
                {error.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Order Summary */}
      {order && (
        <OrderSummary order={order} />
      )}

      {/* Transaction History */}
      <TransactionHistory />
    </div>
  );
}
```