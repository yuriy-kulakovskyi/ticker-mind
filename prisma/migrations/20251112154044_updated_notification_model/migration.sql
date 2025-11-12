/*
  Warnings:

  - You are about to drop the `NotificationSubscriber` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `subscriberId` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."NotificationSubscriber" DROP CONSTRAINT "NotificationSubscriber_notificationId_fkey";

-- DropForeignKey
ALTER TABLE "public"."NotificationSubscriber" DROP CONSTRAINT "NotificationSubscriber_subscriberId_fkey";

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "isRead" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "subscriberId" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."NotificationSubscriber";

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "Subscriber"("id") ON DELETE CASCADE ON UPDATE CASCADE;
