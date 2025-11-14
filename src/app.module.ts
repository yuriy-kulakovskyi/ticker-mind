import { Module } from '@nestjs/common';

import { MarketModule } from '@market/market.module';
import { NotificationModule } from '@notification/notification.module';
import { ReportModule } from '@report/report.module';
import { SubscriberModule } from '@subscriber/subscriber.module';
import { WatchlistModule } from '@watchlist/watchlist.module';
import { PrismaService } from '@prisma/prisma.service';
import { HttpModule } from '@nestjs/axios';
import { AuthGuard } from '@presentation/guards/auth.guard';
import { CacheModule } from '@nestjs/cache-manager';
import { ScheduleModule } from '@nestjs/schedule';
import { SsrModule } from 'ssr/ssr.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    MarketModule,
    WatchlistModule,
    NotificationModule,
    SubscriberModule,
    ReportModule,
    HttpModule,
    SsrModule,
    CacheModule.register(),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 3,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 20
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100
      }
    ]),
  ],
  providers: [
    PrismaService, 
    AuthGuard,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ]
})

export class AppModule {}
