import { Module } from '@nestjs/common';

import { MarketModule } from 'modules/market/market.module';
import { NotificationModule } from 'modules/notification/notification.module';
import { ReportModule } from 'modules/report/report.module';
import { SsrModule } from 'modules/ssr/ssr.module';
import { SubscriberModule } from 'modules/subscriber/subscriber.module';
import { WatchlistModule } from 'modules/watchlist/watchlist.module';

@Module({
  imports: [
    MarketModule,
    WatchlistModule,
    NotificationModule,
    SubscriberModule,
    SsrModule,
    ReportModule,
  ],
})

export class AppModule {}
