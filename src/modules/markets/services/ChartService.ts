```typescript
import { createChart, IChartApi, ISeriesApi, LineStyle } from 'lightweight-charts';
import { MarketData, ChartConfig, Indicator } from '../types';
import { calculateIndicator } from '../utils/indicators';
import { ErrorHandler } from '../../../utils/errors';

export class ChartService {
  private chart: IChartApi;
  private candlestickSeries: ISeriesApi<'Candlestick'>;
  private volumeSeries: ISeriesApi<'Histogram'>;
  private indicatorSeries: Map<string, ISeriesApi<'Line'>>;
  private errorHandler: ErrorHandler;

  constructor(container: HTMLElement, config: ChartConfig) {
    this.errorHandler = ErrorHandler.getInstance();
    this.indicatorSeries = new Map();

    try {
      this.chart = createChart(container, {
        width: container.clientWidth,
        height: container.clientHeight,
        layout: {
          background: { color: config.theme === 'dark' ? '#1a1a1a' : '#ffffff' },
          textColor: config.theme === 'dark' ? '#d1d4dc' : '#000000',
        },
        grid: {
          vertLines: { visible: config.gridLines },
          horzLines: { visible: config.gridLines },
        },
        crosshair: {
          mode: config.crosshair ? 1 : 0,
        },
        timeScale: {
          timeVisible: true,
          secondsVisible: false,
        },
      });

      this.candlestickSeries = this.chart.addCandlestickSeries();
      this.volumeSeries = this.chart.addHistogramSeries({
        color: '#26a69a',
        priceFormat: {
          type: 'volume',
        },
        priceScaleId: '',
        scaleMargins: {
          top: 0.8,
          bottom: 0,
        },
      });

      this.setupResizeHandler(container);
    } catch (error) {
      this.errorHandler.handleError(error instanceof Error ? error : new Error(String(error)), {
        context: 'ChartService',
        type: 'initialization_error'
      });
    }
  }

  private setupResizeHandler(container: HTMLElement): void {
    const resizeObserver = new ResizeObserver(entries => {
      if (entries[0]) {
        const { width, height } = entries[0].contentRect;
        this.chart.applyOptions({ width, height });
      }
    });

    resizeObserver.observe(container);
  }

  public updateData(data: MarketData[]): void {
    try {
      this.candlestickSeries.setData(data.map(d => ({
        time: d.timestamp,
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close
      })));

      this.volumeSeries.setData(data.map(d => ({
        time: d.timestamp,
        value: d.volume,
        color: d.close >= d.open ? '#26a69a' : '#ef5350'
      })));
    } catch (error) {
      this.errorHandler.handleError(error instanceof Error ? error : new Error(String(error)), {
        context: 'ChartService',
        type: 'data_update_error'
      });
    }
  }

  public addIndicator(indicator: Indicator, data: MarketData[]): void {
    try {
      const indicatorData = calculateIndicator(indicator, data);
      const series = this.chart.addLineSeries({
        color: indicator.color,
        lineStyle: LineStyle.Solid,
        lineWidth: 2,
        priceScaleId: indicator.type === 'overlay' ? 'right' : indicator.id,
        scaleMargins: indicator.type === 'overlay' 
          ? undefined 
          : { top: 0.8, bottom: 0.2 },
      });

      series.setData(indicatorData.map(d => ({
        time: d.timestamp,
        value: d.value
      })));

      this.indicatorSeries.set(indicator.id, series);
    } catch (error) {
      this.errorHandler.handleError(error instanceof Error ? error : new Error(String(error)), {
        context: 'ChartService',
        type: 'indicator_error',
        indicator: indicator.name
      });
    }
  }

  public removeIndicator(indicatorId: string): void {
    const series = this.indicatorSeries.get(indicatorId);
    if (series) {
      this.chart.removeSeries(series);
      this.indicatorSeries.delete(indicatorId);
    }
  }

  public updateConfig(config: Partial<ChartConfig>): void {
    try {
      this.chart.applyOptions({
        layout: {
          background: { 
            color: config.theme === 'dark' ? '#1a1a1a' : '#ffffff' 
          },
          textColor: config.theme === 'dark' ? '#d1d4dc' : '#000000',
        },
        grid: {
          vertLines: { visible: config.gridLines },
          horzLines: { visible: config.gridLines },
        },
        crosshair: {
          mode: config.crosshair ? 1 : 0,
        },
      });
    } catch (error) {
      this.errorHandler.handleError(error instanceof Error ? error : new Error(String(error)), {
        context: 'ChartService',
        type: 'config_update_error'
      });
    }
  }

  public destroy(): void {
    this.chart.remove();
  }
}
```