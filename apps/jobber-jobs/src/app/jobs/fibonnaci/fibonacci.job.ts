import { PulsarClient } from '@jobber/pulsar';
import { Job } from '../../decorators/job.decorator';
import { AbstractJob } from '../abstract.job';
import { FibonacciData } from './fibonnaci-data.interface';

@Job({
  name: 'Fibonacci',
  description: 'Calculates the fibonacci sequence and store it to db',
})
export class FibonnaciJob extends AbstractJob<FibonacciData> {
  constructor(pulsarClient: PulsarClient) {
    super(pulsarClient);
  }
}
