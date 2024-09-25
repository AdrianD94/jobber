import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './models/user.model';
import { CreateUserInput } from './dto/create-user.input';

@Resolver(() => User)
export class UsersResolver {
    constructor(private readonly usersService: UsersService) {
        
    }

    @Query(() => [User], {name: 'users'})
    async getUsers() {
        return this.usersService.findUsers();
    }

    @Mutation(() => User)
    async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
        return this.usersService.createUser(createUserInput);
    }
}
