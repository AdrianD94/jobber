import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './models/user.model';
import { CreateUserInput } from './dto/create-user.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { TokekenPayload } from '../auth/token-payload.interface';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [User], { name: 'users' })
  async getUsers(@CurrentUser() { userId }: TokekenPayload) {
    console.log(userId);
    return this.usersService.findUsers();
  }

  @Mutation(() => User)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.usersService.createUser(createUserInput);
  }
}
