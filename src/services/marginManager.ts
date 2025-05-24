import type { Position, MarginCall, MarginStatus } from '../types';

export class MarginManager {
  private readonly INITIAL_MARGIN = 0.5; // 50% initial margin
  private readonly MAINTENANCE_MARGIN = 0.25; // 25% maintenance margin
  private readonly MARGIN_CALL_BUFFER = 0.05; // 5% buffer before margin call
  private readonly LIQUIDATION_THRESHOLD = 0.15; // 15% equity remaining triggers liquidation
  
  private readonly CHECK_INTERVAL = 5 * 60 * 1000; // Check every 5 minutes
  private positions: Map<string, Position> = new Map();
  private marginCalls: MarginCall[] = [];

  constructor() {
    setInterval(() => this.checkMargins(), this.CHECK_INTERVAL);
  }

  public addPosition(position: Position): void {
    this.positions.set(position.id, position);
  }

  public updatePosition(position: Position): void {
    this.positions.set(position.id, {
      ...position,
      marginStatus: this.calculateMarginStatus(position)
    });
  }

  private calculateMarginStatus(position: Position): MarginStatus {
    const equity = position.value - position.debt;
    const marginRatio = equity / position.value;

    if (marginRatio <= this.LIQUIDATION_THRESHOLD) {
      return 'liquidation';
    } else if (marginRatio <= this.MAINTENANCE_MARGIN) {
      return 'call';
    } else if (marginRatio <= this.MAINTENANCE_MARGIN + this.MARGIN_CALL_BUFFER) {
      return 'warning';
    }
    return 'healthy';
  }

  private checkMargins(): void {
    this.positions.forEach(position => {
      const status = this.calculateMarginStatus(position);
      
      if (status === 'call' && !this.hasActiveMarginCall(position.id)) {
        this.issueMarginCall(position);
      } else if (status === 'liquidation') {
        this.liquidatePosition(position);
      }
    });
  }

  private hasActiveMarginCall(positionId: string): boolean {
    return this.marginCalls.some(call => 
      call.positionId === positionId && !call.resolved);
  }

  private issueMarginCall(position: Position): void {
    const requiredDeposit = this.calculateRequiredDeposit(position);
    
    const marginCall: MarginCall = {
      id: crypto.randomUUID(),
      positionId: position.id,
      userId: position.userId,
      amount: requiredDeposit,
      deadline: this.calculateDeadline(),
      resolved: false,
      issued: new Date()
    };

    this.marginCalls.push(marginCall);
    this.notifyUser(marginCall);
  }

  private calculateRequiredDeposit(position: Position): number {
    const currentEquity = position.value - position.debt;
    const requiredEquity = position.value * this.INITIAL_MARGIN;
    return requiredEquity - currentEquity;
  }

  private calculateDeadline(): Date {
    const deadline = new Date();
    deadline.setHours(deadline.getHours() + 24); // 24-hour deadline
    return deadline;
  }

  private liquidatePosition(position: Position): void {
    // Implement forced liquidation logic
    // This should be done gradually to minimize market impact
    this.initiateOrderedLiquidation(position);
  }

  private initiateOrderedLiquidation(position: Position): void {
    // Break down position into smaller chunks
    const chunks = this.calculateLiquidationChunks(position);
    
    // Schedule liquidation orders
    chunks.forEach((chunk, index) => {
      setTimeout(() => {
        this.executeLiquidationOrder(chunk);
      }, index * 2 * 60 * 1000); // 2-minute intervals
    });
  }

  private calculateLiquidationChunks(position: Position): Position[] {
    const numChunks = Math.ceil(position.value / 100000); // 100k per chunk
    const chunks: Position[] = [];
    
    const chunkSize = position.quantity / numChunks;
    for (let i = 0; i < numChunks; i++) {
      chunks.push({
        ...position,
        quantity: chunkSize,
        value: position.value / numChunks
      });
    }
    
    return chunks;
  }

  private executeLiquidationOrder(chunk: Position): void {
    // Implement market order execution
    // Should include slippage protection
  }

  private notifyUser(marginCall: MarginCall): void {
    // Implement user notification system
    console.log(`Margin call issued: ${JSON.stringify(marginCall)}`);
  }
}