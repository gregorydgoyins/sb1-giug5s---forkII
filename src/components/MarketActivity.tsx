import React from 'react';
import { Activity, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

const mockActivities = [
  {
    id: '1',
    type: 'trade',
    asset: 'Amazing Spider-Man #300',
    price: 2500,
    quantity: 2,
    direction: 'buy',
    timestamp: '2 min ago',
    impact: 'positive'
  },
  {
    id: '2',
    type: 'market',
    asset: 'DC Comics Bond',
    price: 3200,
    change: -2.5,
    timestamp: '5 min ago',
    impact: 'negative'
  },
  {
    id: '3',
    type: 'trade',
    asset: 'Todd McFarlane Options',
    price: 150,
    quantity: 5,
    direction: 'sell',
    timestamp: '10 min ago',
    impact: 'neutral'
  }
];

export function MarketActivity() {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Activity className="h-6 w-6 text-indigo-400" />
          <h2 className="text-2xl font-bold text-white">Market Activity</h2>
        </div>
        <select className="bg-slate-700 text-white text-sm border-slate-600 rounded-lg px-3 py-2">
          <option>All Activity</option>
          <option>Trades</option>
          <option>Market Events</option>
          <option>Price Changes</option>
        </select>
      </div>

      <div className="space-y-4">
        {mockActivities.map((activity) => (
          <div key={activity.id} className="bg-slate-700/50 border border-slate-600/50 rounded-lg p-4 hover:bg-slate-700 transition-colors">
            <div className="flex justify-between items-start">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${
                  activity.impact === 'positive' ? 'bg-green-900/50 border border-green-700/50' :
                  activity.impact === 'negative' ? 'bg-red-900/50 border border-red-700/50' :
                  'bg-slate-800/50 border border-slate-700/50'
                }`}>
                  {activity.type === 'trade' ? (
                    <DollarSign className={`h-5 w-5 ${
                      activity.impact === 'positive' ? 'text-green-400' :
                      activity.impact === 'negative' ? 'text-red-400' :
                      'text-gray-400'
                    }`} />
                  ) : (
                    activity.change > 0 ? (
                      <TrendingUp className="h-5 w-5 text-green-400" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-red-400" />
                    )
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{activity.asset}</h3>
                  <p className="text-sm text-gray-400">
                    {activity.type === 'trade' ? (
                      `${activity.direction.toUpperCase()} ${activity.quantity} @ CC ${activity.price.toLocaleString()}`
                    ) : (
                      `${activity.change > 0 ? '+' : ''}${activity.change}% Price Change`
                    )}
                  </p>
                </div>
              </div>
              <span className="text-sm text-gray-400">{activity.timestamp}</span>
            </div>

            {activity.type === 'trade' && (
              <div className="mt-3 text-sm">
                <span className="text-gray-400">Total Value: </span>
                <span className="text-white font-medium">
                  CC {(activity.price * activity.quantity).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-center">
        <button className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors">
          View More Activity →
        </button>
      </div>
    </div>
  );
}