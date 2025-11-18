import { Controller, Get, Req, Res } from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  sse(@Req() req, @Res() res) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const clientId = this.eventsService.addClient(res);

    req.on('close', () => {
      this.eventsService.removeClient(clientId);
      res.end();
    });
  }
}