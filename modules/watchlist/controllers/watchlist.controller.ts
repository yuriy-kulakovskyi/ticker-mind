import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from "@nestjs/common";
import { AuthGuard } from "presentation/guards/auth.guard";
import { WatchlistService } from "../application/services/watchlist.service";
import { UpdateWatchlistDto } from "shared/dto/watchlist/update-watchlist.dto";
import { AddTickerDto } from "shared/dto/watchlist/add-ticker.dto";
import { RemoveTickerDto } from "shared/dto/watchlist/remove-ticker.dto";
import { CreateWatchlistDto } from "shared/dto/watchlist/create-watchlist.dto";

@Controller('watchlist')
@UseGuards(AuthGuard)
export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) {}

  @Post()
  async create(@Body() dto: CreateWatchlistDto, @Request() req) {
    return this.watchlistService.createWatchlist(
      dto.name, 
      req.user.user_id,
      req.user.email
    );
  }

  @Get()
  async findAll(@Request() req) {
    return this.watchlistService.getWatchlists(req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.watchlistService.getWatchlistById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateWatchlistDto) {
    return this.watchlistService.updateWatchlist(id, dto);
  }

  @Post(':id/tickers')
  async addTicker(@Param('id') id: string, @Body() dto: AddTickerDto) {
    return this.watchlistService.addTicker(id, dto.ticker);
  }

  @Delete(':id/tickers')
  async removeTicker(@Param('id') id: string, @Body() dto: RemoveTickerDto) {
    return this.watchlistService.removeTicker(id, dto.ticker);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.watchlistService.deleteWatchlist(id);
  }
}