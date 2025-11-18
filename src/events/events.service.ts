import { Injectable } from '@nestjs/common';

@Injectable()
export class EventsService {
  private clients: { id: number; response: any }[] = [];

  addClient(response) {
    const clientId = Date.now();
    this.clients.push({ id: clientId, response });
    return clientId;
  }

  removeClient(clientId: number) {
    this.clients = this.clients.filter(c => c.id !== clientId);
  }

  broadcast(data: any) {
    this.clients.forEach(client => {
      client.response.write(`data: ${JSON.stringify(data)}\n\n`);
    });
  }
}