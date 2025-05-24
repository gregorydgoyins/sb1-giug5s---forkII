import React from 'react';
import { OptionsTrading as OptionsComponent } from '../components/OptionsTrading';

export function OptionsTrading() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white mb-6">Options Trading</h1>
      <OptionsComponent />
    </div>
  );
}