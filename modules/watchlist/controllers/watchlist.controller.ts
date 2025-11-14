import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Request, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@presentation/guards/auth.guard";
import { AddTickerDto } from "@shared/dto/watchlist/add-ticker.dto";
import { CreateWatchlistDto } from "@shared/dto/watchlist/create-watchlist.dto";
import { RemoveTickerDto } from "@shared/dto/watchlist/remove-ticker.dto";
import { UpdateWatchlistDto } from "@shared/dto/watchlist/update-watchlist.dto";
import { DeleteWatchlistUseCase } from "@watchlist/application/usecases/delete-watchlist.usecase";
import { CreateWatchlistUseCase } from "@watchlist/application/usecases/create-watchlist.usecase";
import { AddTickerUseCase } from "@watchlist/application/usecases/add-ticker.usecase";
import { RemoveTickerUseCase } from "@watchlist/application/usecases/remove-ticker.usecase";
import { GetWatchlistsUseCase } from "@watchlist/application/usecases/get-watchlists.usecase";
import { GetWatchlistByIdUseCase } from "@watchlist/application/usecases/get-watchlist-by-id.usecase";
import { UpdateWatchlistUseCase } from "@watchlist/application/usecases/update-watchlist.usecase";
import { IUserResponse } from "@shared/interfaces/user.interface";

@Controller('watchlist')
@UseGuards(AuthGuard)
export class WatchlistController {
  constructor(
    private readonly deleteWatchlistUseCase: DeleteWatchlistUseCase,
    private readonly createWatchlistUseCase: CreateWatchlistUseCase,
    private readonly addTickerUseCase: AddTickerUseCase,
    private readonly removeTickerUseCase: RemoveTickerUseCase,
    private readonly getWatchlistsUseCase: GetWatchlistsUseCase,
    private readonly getWatchlistByIdUseCase: GetWatchlistByIdUseCase,
    private readonly updateWatchlistUseCase: UpdateWatchlistUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateWatchlistDto, @Request() req: IUserResponse) {
    return this.createWatchlistUseCase.execute(dto.name, req.user.user_id, req.user.email);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Request() req: IUserResponse) {
    return this.getWatchlistsUseCase.execute(req.user.user_id);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string, @Request() req: IUserResponse) {
    return this.getWatchlistByIdUseCase.execute(id, req.user.user_id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() dto: UpdateWatchlistDto, @Request() req: IUserResponse) {
    return this.updateWatchlistUseCase.execute(id, dto, req.user.user_id);
  }

  @Post(':id/tickers')
  @HttpCode(HttpStatus.OK)
  async addTicker(@Param('id') id: string, @Body() dto: AddTickerDto, @Request() req: IUserResponse) {
    return this.addTickerUseCase.execute(id, dto.ticker, req.user.user_id);
  }

  @Delete(':id/tickers')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeTicker(@Param('id') id: string, @Body() dto: RemoveTickerDto, @Request() req: IUserResponse) {
    return this.removeTickerUseCase.execute(id, dto.ticker, req.user.user_id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @Request() req: IUserResponse) {
    return this.deleteWatchlistUseCase.execute(id, req.user.user_id);
  }
}