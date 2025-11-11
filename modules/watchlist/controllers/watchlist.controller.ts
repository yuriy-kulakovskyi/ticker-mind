import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Request, UseGuards } from "@nestjs/common";
import { AuthGuard } from "presentation/guards/auth.guard";
import { AddTickerDto } from "shared/dto/watchlist/add-ticker.dto";
import { CreateWatchlistDto } from "shared/dto/watchlist/create-watchlist.dto";
import { RemoveTickerDto } from "shared/dto/watchlist/remove-ticker.dto";
import { UpdateWatchlistDto } from "shared/dto/watchlist/update-watchlist.dto";
import { DeleteWatchlistUseCase } from "../application/usecases/delete-watchlist.usecase";
import { CreateWatchlistUseCase } from "../application/usecases/create-watchlist.usecase";
import { AddTickerUseCase } from "../application/usecases/add-ticker.usecase";
import { RemoveTickerUseCase } from "../application/usecases/remove-ticker.usecase";
import { GetWatchlistsUseCase } from "../application/usecases/get-watchlists.usecase";
import { GetWatchlistByIdUseCase } from "../application/usecases/get-watchlist-by-id.usecase";
import { UpdateWatchlistUseCase } from "../application/usecases/update-watchlist.usecase";

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
  async create(@Body() dto: CreateWatchlistDto, @Request() req) {
    if (req.user.user_id) {
      return this.createWatchlistUseCase.execute(dto.name, req.user.user_id);
    }
    throw new NotFoundException('User is not found');
  }

  @Get()
  async findAll(@Request() req) {
    if (req.user.user_id) {
      return this.getWatchlistsUseCase.execute(req.user.user_id);
    }
    throw new NotFoundException('User is not found');
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    if (req.user.user_id) {
      return this.getWatchlistByIdUseCase.execute(id, req.user.user_id);
    }
    throw new NotFoundException('User is not found');
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateWatchlistDto, @Request() req) {
    if (req.user.user_id) {
      return this.updateWatchlistUseCase.execute(id, dto, req.user.user_id);
    }
    throw new NotFoundException('User is not found');
  }

  @Post(':id/tickers')
  async addTicker(@Param('id') id: string, @Body() dto: AddTickerDto, @Request() req) {
    if (req.user.user_id) {
      return this.addTickerUseCase.execute(id, dto.ticker, req.user.user_id);
    }
    throw new NotFoundException('User is not found');
  }

  @Delete(':id/tickers')
  async removeTicker(@Param('id') id: string, @Body() dto: RemoveTickerDto, @Request() req) {
    if (req.user.user_id) {
      return this.removeTickerUseCase.execute(id, dto.ticker, req.user.user_id);
    }
    throw new NotFoundException('User is not found');
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    if (req.user.user_id) {
      return this.deleteWatchlistUseCase.execute(id, req.user.user_id);
    }
    throw new NotFoundException('User is not found');
  }
}