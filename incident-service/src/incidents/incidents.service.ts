import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Incident } from './incident.entity';
import { CreateIncidentInput } from './dto/create-incident.input';
import { UpdateStatusInput } from './dto/update-status.input';
import axios from 'axios';

@Injectable()
export class IncidentsService {
  constructor(@InjectRepository(Incident) private repo: Repository<Incident>) {}

  private async notify(userId: number, message: string, type: string) {
    try {
      await axios.post(
        `${process.env.NOTIF_SERVICE || 'http://localhost:3002'}/graphql`,
        {
          query: `mutation { sendNotification(input: { userId: ${userId}, message: "${message}", type: "${type}" }) { id } }`,
        },
      );
    } catch (e) {
      console.error('Notification failed:', e.message);
    }
  }

  async create(input: CreateIncidentInput): Promise<Incident> {
    const incident = this.repo.create(input);
    const saved = await this.repo.save(incident);
    await this.notify(
      input.reportedBy,
      `Incident declared: ${input.type} at ${input.location}`,
      'INCIDENT',
    );
    return saved;
  }

  async findAll(): Promise<Incident[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number): Promise<Incident> {
    const incident = await this.repo.findOne({ where: { id } });
    if (!incident) throw new NotFoundException('Incident not found');
    return incident;
  }

  async updateStatus(input: UpdateStatusInput): Promise<Incident> {
    await this.repo.update(input.id, { status: input.status });
    const incident = await this.findOne(input.id);
    await this.notify(
      incident.reportedBy,
      `Incident #${input.id} status updated to ${input.status}`,
      'INCIDENT_UPDATE',
    );
    return incident;
  }
}
