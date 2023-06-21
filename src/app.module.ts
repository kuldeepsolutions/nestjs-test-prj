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
import { diskStorage } from 'multer';
import { MulterModule } from '@nestjs/platform-express';
import { v4 as uuidv4 } from 'uuid';
import { FileUploadService } from './file-upload/file-upload.service';

import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/nestjs-practice'),
    ConfigModule.forRoot({
      envFilePath: 'config.development.env',
    }),
    UserModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret,
      signOptions: { expiresIn: '2h' },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    // Local file saver
    // MulterModule.register({
    //   storage: diskStorage({
    //     destination: './public',
    //     filename: (req, file, cb) => {
    //       const ext = file.mimetype.split('/')[1];
    //       cb(null, `${uuidv4()}-${Date.now()}.${ext}`);
    //     },
    //   })
    // }),
  ],
  controllers: [AppController, UserController],
  providers: [AppService, UserService, FileUploadService],
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
