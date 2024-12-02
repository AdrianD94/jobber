import { PulsarModule } from '@jobber/pulsar';
import { Module } from '@nestjs/common';
import { FibonacciConsumer } from './fibonacci/fibonacci.consumer';

@Module({
  providers: [FibonacciConsumer],
  imports: [PulsarModule],
})
export class JobsModule {}
