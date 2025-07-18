import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TenantModule } from './tenant/tenant.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/roles.guard';
import { SubjectModule } from './subject/subject.module';
import { PrismaModule } from './prisma/prisma.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { TeacherModule } from './teacher/teacher.module';
import { StandardModule } from './standard/standard.module';
import { DivisionModule } from './division/division.module';
import { StudentModule } from './student/student.module';
import { TimeTableModule } from './time-table/time-table.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // makes config available everywhere
    }),
    TenantModule, 
    UserModule, 
    AuthModule, 
    SubjectModule, 
    PrismaModule,
    TeacherModule, 
    StandardModule, 
    DivisionModule,
    StudentModule,
    TimeTableModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
