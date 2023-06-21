import { Module, RequestMethod, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { User, UserSchema } from './user/user.schema';
import { isAuthenticated } from './app.middleware';
import { ServeStaticModule } from '@nestjs/serve-static';
import { JwtModule } from '@nestjs/jwt';
import { secret } from './utils/constants';
import { join } from 'path/posix';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/nestjs-practice'),
    UserModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret,
      signOptions: { expiresIn: '2h' },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
  ],
  controllers: [AppController, UserController],
  providers: [AppService, UserService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(isAuthenticated)
      .exclude(
        { path: 'api/v1/user/:id', method: RequestMethod.GET },
        { path: 'api/v1/user', method: RequestMethod.GET },
        { path: 'api/v1/user/register', method: RequestMethod.POST },
        { path: 'api/v1/user/login', method: RequestMethod.POST },
      )
      .forRoutes(UserController);
  }
}
