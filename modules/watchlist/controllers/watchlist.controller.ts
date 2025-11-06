import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from "@nestjs/common";
import { AuthGuard } from "presentation/guards/auth.guard";
import { AddTickerDto } from "shared/dto/watchlist/add-ticker.dto";
import { CreateWatchlistDto } from "shared/dto/watchlist/create-watchlist.dto";
import { RemoveTickerDto } from "shared/dto/watchlist/remove-ticker.dto";
import { UpdateWatchlistDto } from "shared/dto/watchlist/update-watchlist.dto";
import { WatchlistUseCase } from "../application/usecases/watchlist.usecase";

@Controller('watchlist')
@UseGuards(AuthGuard)
export class WatchlistController {
  constructor(private readonly watchlistUseCase: WatchlistUseCase) {}

  @Post()
  async create(@Body() dto: CreateWatchlistDto, @Request() req) {
    return this.watchlistUseCase.createWatchlist(dto.name, req.user.id);
  }

  @Get()
  async findAll(@Request() req) {
    return this.watchlistUseCase.getWatchlists(req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.watchlistUseCase.getWatchlistById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateWatchlistDto) {
    return this.watchlistUseCase.updateWatchlist(id, dto);
  }

  @Post(':id/tickers')
  async addTicker(@Param('id') id: string, @Body() dto: AddTickerDto) {
    return this.watchlistUseCase.addTicker(id, dto.ticker);
  }

  @Delete(':id/tickers')
  async removeTicker(@Param('id') id: string, @Body() dto: RemoveTickerDto) {
    return this.watchlistUseCase.removeTicker(id, dto.ticker);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.watchlistUseCase.deleteWatchlist(id);
  }
}