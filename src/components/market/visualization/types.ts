export interface ChartData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface ChartOptions {
  timeframe: string;
  showVolume: boolean;
  showMA20: boolean;
  showMA50: boolean;
  showBollingerBands: boolean;
}

export interface ChartTheme {
  background: string;
  textColor: string;
  gridColor: string;
  upColor: string;
  downColor: string;
  volumeColor: string;
  crosshairColor: string;
}