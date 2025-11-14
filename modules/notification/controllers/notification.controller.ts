import { CacheKey, CacheTTL } from "@nestjs/cache-manager";
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Request, UseGuards } from "@nestjs/common";
import { CreateNotificationUseCase } from "@notification/application/usecases/create-notification.usecase";
import { DeleteNotificationUseCase } from "@notification/application/usecases/delete-notification.usecase";
import { GetNotificationByIdUseCase } from "@notification/application/usecases/get-notification-by-id.usecase";
import { GetNotificationsUseCase } from "@notification/application/usecases/get-notifications.usecase";
import { UpdateNotificationUseCase } from "@notification/application/usecases/update-notification.usecase";
import { AuthGuard } from "@presentation/guards/auth.guard";
import { CreateNotificationDto } from "@shared/dto/notification/create-notification.dto";
import { UpdateNotificationDto } from "@shared/dto/notification/update-notification.dto";
import { IUserResponse } from "@shared/interfaces/user.interface";

@Controller("notification")
@CacheKey('notification')
@CacheTTL(300)
@UseGuards(AuthGuard)
export class NotificationController {
  constructor(
    private readonly createNotificationUseCase: CreateNotificationUseCase,
    private readonly updateNotificationUseCase: UpdateNotificationUseCase,
    private readonly getNotificationsUseCase: GetNotificationsUseCase,
    private readonly deleteNotificationUseCase: DeleteNotificationUseCase,
    private readonly getNotificationByIdUseCase: GetNotificationByIdUseCase
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createNotification(@Body() data: CreateNotificationDto, @Request() req: IUserResponse) {
    return this.createNotificationUseCase.execute(data, req.user.user_id, req.user.email);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updateNotification(@Param('id') id: string, @Body() data: UpdateNotificationDto, @Request() req: IUserResponse) {
    return this.updateNotificationUseCase.execute({ id, ...data, userId: req.user.user_id });
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getNotifications(@Request() req: IUserResponse) {
    return this.getNotificationsUseCase.execute(req.user.user_id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteNotification(@Param('id') id: string, @Request() req: IUserResponse) {
    return this.deleteNotificationUseCase.execute(req.user.user_id, id);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getNotification(@Param('id') id: string, @Request() req: IUserResponse) {
    return this.getNotificationByIdUseCase.execute(req.user.user_id, id);
  }
}