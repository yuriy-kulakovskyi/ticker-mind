import { NotFoundException } from "@nestjs/common";
import { SubscriberService } from "@subscriber/application/services/subscriber.service";

export async function ensureSubscriberExists(userId: string, subscriberEmail: string, subscriberService: SubscriberService): Promise<void> {
  try {
    await subscriberService.findById(userId);
  } catch (error) {
    if (error instanceof NotFoundException) {
      await subscriberService.create(userId, subscriberEmail);
    } else {
      throw error; 
    }
  }
}