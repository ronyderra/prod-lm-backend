import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getDefault() {
    return {
      message: 'Location Management API',
      version: '1.0.0',
      endpoints: {
        health: '/health',
        locations: '/locations',
        osm: '/osm',
      },
    };
  }

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}

