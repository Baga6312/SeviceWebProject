import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { IncidentsService } from './incidents.service';
import { Incident } from './incident.entity';
import { CreateIncidentInput } from './dto/create-incident.input';
import { UpdateStatusInput } from './dto/update-status.input';

@Resolver(() => Incident)
export class IncidentsResolver {
  constructor(private service: IncidentsService) {}

  @Mutation(() => Incident)
  declareIncident(@Args('input') input: CreateIncidentInput) {
    return this.service.create(input);
  }

  @Query(() => [Incident])
  getIncidents() {
    return this.service.findAll();
  }

  @Query(() => Incident)
  getIncident(@Args('id', { type: () => Int }) id: number) {
    return this.service.findOne(id);
  }

  @Mutation(() => Incident)
  updateIncidentStatus(@Args('input') input: UpdateStatusInput) {
    return this.service.updateStatus(input);
  }
}