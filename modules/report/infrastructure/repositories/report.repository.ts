import { ReportEntity } from "@report/domain/entities/report.entity";
import { ICreateReport } from "@report/domain/interfaces/create-report.interface";
import { IUpdateReport } from "@report/domain/interfaces/update-report.interface";

export interface ReportRepository {
  create(data: ICreateReport): Promise<ReportEntity>;
  delete(id: string, subscriberId: string): Promise<string>;
  findById(id: string, subscriberId: string): Promise<ReportEntity | null>;
  findAllBySubscriber(subscriberId: string): Promise<ReportEntity[]>;
  update(id: string, subscriberId: string, data: IUpdateReport): Promise<ReportEntity>;
}