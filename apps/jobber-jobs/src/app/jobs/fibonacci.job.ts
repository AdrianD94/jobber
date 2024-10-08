import { Job } from '../decorators/job.decorator';
import { AbstractJob } from './abstract.job';

@Job({
  name: 'Fibonacci',
  description: 'Calculates the fibonacci sequence and store it to db',
})
export class FibonnaciJob extends AbstractJob {}
