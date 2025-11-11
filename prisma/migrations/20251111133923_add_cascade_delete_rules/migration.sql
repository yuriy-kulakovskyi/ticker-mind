-- DropForeignKey
ALTER TABLE "public"."Candle" DROP CONSTRAINT "Candle_marketId_fkey";

-- DropForeignKey
ALTER TABLE "public"."NotificationSubscriber" DROP CONSTRAINT "NotificationSubscriber_notificationId_fkey";

-- DropForeignKey
ALTER TABLE "public"."NotificationSubscriber" DROP CONSTRAINT "NotificationSubscriber_subscriberId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Watchlist" DROP CONSTRAINT "Watchlist_subscriberId_fkey";

-- DropForeignKey
ALTER TABLE "public"."WatchlistItem" DROP CONSTRAINT "WatchlistItem_watchlistId_fkey";

-- AddForeignKey
ALTER TABLE "NotificationSubscriber" ADD CONSTRAINT "NotificationSubscriber_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "Notification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationSubscriber" ADD CONSTRAINT "NotificationSubscriber_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "Subscriber"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Watchlist" ADD CONSTRAINT "Watchlist_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "Subscriber"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchlistItem" ADD CONSTRAINT "WatchlistItem_watchlistId_fkey" FOREIGN KEY ("watchlistId") REFERENCES "Watchlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candle" ADD CONSTRAINT "Candle_marketId_fkey" FOREIGN KEY ("marketId") REFERENCES "Market"("id") ON DELETE CASCADE ON UPDATE CASCADE;
