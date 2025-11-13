import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { LocationsModule } from './modules/location/locations.module';
import { GeoModule } from './modules/geo/geo.module';
import { MongoDbModule } from './database/mongodb.module';
import { RedisModule } from './database/redis/redis.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60,
          limit: 20,
        },
      ],
    }),

    MongoDbModule,
    RedisModule,
    LocationsModule,
    GeoModule,
  ],

  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}