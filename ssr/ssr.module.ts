import { Module } from '@nestjs/common';
import { SsrController } from './ssr.controller';
import { SsrRenderer } from './server/ssr.renderer';
import { HttpModule } from '@nestjs/axios';
import { SsrAuthGuard } from '@presentation/guards/ssr-auth.guard';
import { SsrService } from './ssr.service';
import { SubscriberModule } from '@subscriber/subscriber.module';
import { ReportModule } from '@report/report.module';

@Module({
  imports: [HttpModule, SubscriberModule, ReportModule],
  controllers: [SsrController],
  providers: [SsrRenderer, SsrAuthGuard, SsrService],
})

export class SsrModule {}