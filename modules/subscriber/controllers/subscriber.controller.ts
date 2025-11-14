import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Request, UseGuards } from "@nestjs/common";
import { UpdateSubscriberUseCase } from "@subscriber/application/usecases/update-subscriber.usecase";
import { CreateSubscriberUseCase } from "@subscriber/application/usecases/create-subscriber.usecase";
import { DeleteSubscriberUseCase } from "@subscriber/application/usecases/delete-subscriber.usecase";
import { ReadSubscriberUseCase } from "@subscriber/application/usecases/read-subscriber.usecase";
import { CreateSubscriberDto } from "@shared/dto/subscriber/create-subscriber.dto";
import { UpdateSubscriberDto } from "@shared/dto/subscriber/update-subscriber.dto";
import { AuthGuard } from "@presentation/guards/auth.guard";
import { GetMeUseCase } from "@subscriber/application/usecases/get-me.usecase";
import { IUserResponse } from "@shared/interfaces/user.interface";
import { GetAllSubscribersUseCase } from "@subscriber/application/usecases/get-all-subscribers.usecase";
import { CacheKey, CacheTTL } from "@nestjs/cache-manager";

@Controller("subscriber")
@CacheKey('subscriber')
@CacheTTL(300)
export class SubscriberController {
  constructor(
    private readonly updateSubscriberUseCase: UpdateSubscriberUseCase,
    private readonly createSubscriberUseCase: CreateSubscriberUseCase,
    private readonly deleteSubscriberUseCase: DeleteSubscriberUseCase,
    private readonly readSubscriberUseCase: ReadSubscriberUseCase,
    private readonly getMeUseCase: GetMeUseCase,
    private readonly getAllSubscribersUseCase: GetAllSubscribersUseCase
  ) {}

  @Get("/me")
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async getMySubscriber(@Request() req: IUserResponse) {
    return this.getMeUseCase.execute(req.user.user_id);
  }

  @Get("/:id")
  @HttpCode(HttpStatus.OK)
  async getSubscriber(@Param("id") id: string) {
    return this.readSubscriberUseCase.execute(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createSubscriber(@Body() createSubscriberDto: CreateSubscriberDto, @Request() req: IUserResponse) {
    return this.createSubscriberUseCase.execute(req.user.user_id, req.user.email, createSubscriberDto.displayName);
  }

  @Patch()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async updateSubscriber(@Body() updateSubscriberDto: UpdateSubscriberDto, @Request() req: IUserResponse) {
    return this.updateSubscriberUseCase.execute(req.user.user_id, updateSubscriberDto.displayName);
  }

  @Delete()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSubscriber(@Request() req: IUserResponse) {
    return this.deleteSubscriberUseCase.execute(req.user.user_id);
  }
}