import { Producer } from 'pulsar-client';
import { PulsarClient, serialize } from '@jobber/pulsar';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { BadRequestException } from '@nestjs/common';

export abstract class AbstractJob<T extends Object> {
  private producer: Producer;
  protected abstract messageClass: new () => T;

  constructor(private readonly pulsarClient: PulsarClient) {}

  async execute(data: T, job: string) {
    await this.validateData(data);
    if (!this.producer) {
      this.producer = await this.pulsarClient.createProducer(job);
    }
    if(Array.isArray(data)) {
      for(const message of data) {
        await this.send(message);
      }
      return;
    }
    return this.send(data);
    
  }

  private async send(data:T){
    await this.producer.send({data: serialize(data)});
  }

  private async validateData(data: T) {
    
    const errors = await validate(
      plainToInstance(this.messageClass, data)
    )
    if(errors.length > 0) {
      throw new BadRequestException(`Job data invalid: ${JSON.stringify(errors)}`);
  }
}
}
