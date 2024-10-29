import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, Consumer, Message, Producer } from 'pulsar-client';

@Injectable()
export class PulsarClient implements OnModuleDestroy {
  private readonly producers: Producer[] = [];
  private readonly consumers: Consumer[] = [];
  private readonly pulsarClient: Client = new Client({
    serviceUrl: this.configService.getOrThrow<string>('PULSAR_SERVICE_URL'),
  });
  constructor(private readonly configService: ConfigService) {}
  async onModuleDestroy() {
    for (const producer of this.producers) {
      await producer.close();
    }
    for (const consumer of this.consumers) {
      await consumer.close();
    }
    await this.pulsarClient.close();
  }

  async createProducer(topic: string) {
    const producer = await this.pulsarClient.createProducer({
      topic,
    });
    this.producers.push(producer);
    return producer;
  }
  async createConsumer(topic: string, listener: (message: Message) => void) {
    const consumer = await this.pulsarClient.subscribe({
      topic,
      subscription: 'jobber',
      listener,
    });
    this.consumers.push(consumer);
    return consumer;
  }
}
