import { INotification } from "./notification.interface";

export interface IUpdateNotification extends Partial<INotification> {
  id: string;
  userId: string;
}