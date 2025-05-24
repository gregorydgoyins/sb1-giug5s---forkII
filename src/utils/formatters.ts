export const formatCurrency = (value: number): string => {
  if (value >= 1000000) {
    return `CC ${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `CC ${(value / 1000).toFixed(1)}K`;
  }
  return `CC ${value.toFixed(2)}`;
};

export const formatPercentage = (value: number): string => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
};