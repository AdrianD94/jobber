import {
  CanActivate,
  ExecutionContext,
  Inject,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ClientGrpc } from '@nestjs/microservices';
import { catchError, map, Observable, of } from 'rxjs';
import {
  AUTH_PACKAGE_NAME,
  AUTH_SERVICE_NAME,
  AuthServiceClient,
} from 'types/proto/auth'; // Adjust the import path as necessary

export class GqlAuthGuard implements OnModuleInit, CanActivate {
  private authService: AuthServiceClient;
  private logger = new Logger(GqlAuthGuard.name);
  constructor(@Inject(AUTH_PACKAGE_NAME) private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.authService =
      this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const token = this.getReq(context).cookies.Authentication;
    if (!token) return false;

    return this.authService.authenticate({ token }).pipe(
      map((res) => {
        this.getReq(context).user = res;
        return true;
      }),
      catchError((err) => {
        this.logger.error(err);
        return of(false);
      })
    );
  }

  private getReq(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}
