import { Module } from '@nestjs/common';
import { PulsarClient } from './pulsar.client';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [],
  providers: [PulsarClient],
  exports: [PulsarClient],
})
export class PulsarModule {}
