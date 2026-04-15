import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  namespace: '/simulation',
  cors: {
    origin: '*',
  },
})
export class SimulationGateway {
  @WebSocketServer()
  private server!: Server;

  emitSimulationStarted(payload: unknown): void {
    this.server.emit('simulation.started', payload);
  }

  emitSimulationScoreUpdated(payload: unknown): void {
    this.server.emit('simulation.score.updated', payload);
  }

  emitSimulationFinished(payload: unknown): void {
    this.server.emit('simulation.finished', payload);
  }

  emitSimulationRestarted(payload: unknown): void {
    this.server.emit('simulation.restarted', payload);
  }
}
