import {
  DiscoveredClassWithMeta,
  DiscoveryService,
} from '@golevelup/nestjs-discovery';
import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { JOB_METADATA_KEY } from '../decorators/job.decorator';
import { AbstractJob } from './abstract.job';
import { JobMetadata } from '../interfaces/job-metadata.interface';

@Injectable()
export class JobsService implements OnModuleInit {
  private jobs: DiscoveredClassWithMeta<JobMetadata>[] = [];
  constructor(private readonly discoveryService: DiscoveryService) {}
  async onModuleInit() {
    this.jobs = await this.discoveryService.providersWithMetaAtKey<JobMetadata>(
      JOB_METADATA_KEY
    );
  }

  async getJobs() {
    return this.jobs.map((job) => job.meta);
  }

  async executeJob(jobName: string) {
    const job = this.jobs.find((j) => j.meta.name === jobName);
    if (!job) {
      throw new BadRequestException(`Job with name ${jobName} not found`);
    }
    await (job.discoveredClass.instance as AbstractJob).execute();
    return job.meta;
  }
}
