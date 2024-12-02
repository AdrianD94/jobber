import { Module } from '@nestjs/common';
import { FibonnaciJob } from './jobs/fibonnaci/fibonacci.job';
import { DiscoveryModule } from '@golevelup/nestjs-discovery';
import { JobsService } from './jobs.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_PACKAGE_NAME } from '@jobber/grpc';
import { join } from 'path';
import { PulsarModule } from '@jobber/pulsar';
import { JobsResolver } from './jobs.resolver';

@Module({
  imports: [
    DiscoveryModule,
    PulsarModule,
    ClientsModule.register([
      {
        name: AUTH_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          package: AUTH_PACKAGE_NAME,
          protoPath: join(__dirname, '../../libs/grpc/proto/auth.proto'),
        },
      },
    ]),
  ],
  providers: [FibonnaciJob, JobsService, JobsResolver],
})
export class JobsModule {}
