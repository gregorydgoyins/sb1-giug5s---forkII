```typescript
export interface Order {
  id?: string;
  asset: string;
  quantity: number;
  price: number;
  total: number;
  timestamp?: Date;
  status?: 'pending' | 'completed' | 'failed';
}

export interface ValidationError {
  field?: string;
  message: string;
}
```