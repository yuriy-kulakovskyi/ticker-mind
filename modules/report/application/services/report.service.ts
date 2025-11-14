import { Injectable, NotFoundException } from "@nestjs/common";
import { ReportEntity } from "@report/domain/entities/report.entity";
import { ICreateReport } from "@report/domain/interfaces/create-report.interface";
import { IUpdateReport } from "@report/domain/interfaces/update-report.interface";
import { PrismaReportRepository } from "@report/infrastructure/repositories/prisma-report.repository";
import { ReportRepository } from "@report/infrastructure/repositories/report.repository";
import { ensureSubscriberExists } from "@shared/utils/subscriber-helper.util";
import { SubscriberService } from "@subscriber/application/services/subscriber.service";

@Injectable()
export class ReportService implements ReportRepository {
  constructor(
    private readonly reportRepository: PrismaReportRepository,
    private readonly subscriberService: SubscriberService
  ) {}

  async create(data: ICreateReport): Promise<ReportEntity> {
    await ensureSubscriberExists(data.subscriberId, data.subscriberEmail, this.subscriberService);

    return this.reportRepository.create(data);
  }

  async findAllBySubscriber(subscriberId: string): Promise<ReportEntity[]> {
    return this.reportRepository.findAllBySubscriber(subscriberId);
  }

  async findById(id: string, subscriberId: string): Promise<ReportEntity | null> {
    return this.reportRepository.findById(id, subscriberId);
  }

  async delete(id: string, subscriberId: string): Promise<string> {
    return this.reportRepository.delete(id, subscriberId);
  }

  async update(id: string, subscriberId: string, data: IUpdateReport): Promise<ReportEntity> {
    return this.reportRepository.update(id, subscriberId, data);
  }
}