import { Module } from '@nestjs/common';

import { PrismaModule } from './prisma/prisma.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { LoggerModule } from '@jobber/nestjs';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({isGlobal: true}),
    PrismaModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: true,
      context: ({ req, res }) => ({ req, res }),
      driver: ApolloDriver,
      playground: {
        settings: {
          'request.credentials': 'include',
        },
      },
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
