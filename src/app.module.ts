import { Module } from '@nestjs/common';

import { MarketModule } from '@market/market.module';
import { NotificationModule } from '@notification/notification.module';
import { ReportModule } from '@report/report.module';
import { SsrModule } from '@ssr/ssr.module';
import { SubscriberModule } from '@subscriber/subscriber.module';
import { WatchlistModule } from '@watchlist/watchlist.module';
import { PrismaService } from '@prisma/prisma.service';
import { HttpModule } from '@nestjs/axios';
import { AuthGuard } from '@presentation/guards/auth.guard';
import { CacheModule } from '@nestjs/cache-manager';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    MarketModule,
    WatchlistModule,
    NotificationModule,
    SubscriberModule,
    SsrModule,
    ReportModule,
    HttpModule,
    CacheModule.register(),
    ScheduleModule.forRoot(),
  ],
  providers: [PrismaService, AuthGuard]
})

export class AppModule {}
