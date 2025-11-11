import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Request, UseGuards } from "@nestjs/common";
import { UpdateSubscriberUseCase } from "../application/usecases/update-subscriber.usecase";
import { CreateSubscriberUseCase } from "../application/usecases/create-subscriber.usecase";
import { DeleteSubscriberUseCase } from "../application/usecases/delete-subscriber.usecase";
import { ReadSubscriberUseCase } from "../application/usecases/read-subscriber.usecase";
import { CreateSubscriberDto } from "shared/dto/subscriber/create-subscriber.dto";
import { UpdateSubscriberDto } from "shared/dto/subscriber/update-subscriber.dto";
import { AuthGuard } from "presentation/guards/auth.guard";
import { GetMeUseCase } from "../application/usecases/get-me.usecase";

@Controller("subscriber")
export class SubscriberController {
  constructor(
    private readonly updateSubscriberUseCase: UpdateSubscriberUseCase,
    private readonly createSubscriberUseCase: CreateSubscriberUseCase,
    private readonly deleteSubscriberUseCase: DeleteSubscriberUseCase,
    private readonly readSubscriberUseCase: ReadSubscriberUseCase,
    private readonly getMeUseCase: GetMeUseCase
  ) {}

  @Get("/me")
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async getMySubscriber(@Request() req) {
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
  async createSubscriber(@Body() createSubscriberDto: CreateSubscriberDto, @Request() req) {
    return this.createSubscriberUseCase.execute(req.user.user_id, req.user.email, createSubscriberDto.displayName);
  }

  @Patch()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async updateSubscriber(@Body() updateSubscriberDto: UpdateSubscriberDto, @Request() req) {
    return this.updateSubscriberUseCase.execute(req.user.user_id, updateSubscriberDto.displayName);
  }

  @Delete()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async deleteSubscriber(@Request() req) {
    return this.deleteSubscriberUseCase.execute(req.user.user_id);
  }
}