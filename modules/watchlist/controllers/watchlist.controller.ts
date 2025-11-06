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
    return this.watchlistUseCase.createWatchlist(dto.name, req.user.user_id);
  }

  @Get()
  async findAll(@Request() req) {
    return this.watchlistUseCase.getWatchlists(req.user.user_id);
  }

    @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    return this.watchlistUseCase.getWatchlistById(id, req.user.user_id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateWatchlistDto, @Request() req) {
    return this.watchlistUseCase.updateWatchlist(id, dto, req.user.id);
  }

  @Post(':id/tickers')
  async addTicker(@Param('id') id: string, @Body() dto: AddTickerDto, @Request() req) {
    return this.watchlistUseCase.addTicker(id, dto.ticker, req.user.id);
  }

  @Delete(':id/tickers')
  async removeTicker(@Param('id') id: string, @Body() dto: RemoveTickerDto, @Request() req) {
    return this.watchlistUseCase.removeTicker(id, dto.ticker, req.user.id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    return this.watchlistUseCase.deleteWatchlist(id, req.user.id);
  }
}