import { Module } from '@nestjs/common';
import { TimeTableService } from './time-table.service';
import { TimeTableController } from './time-table.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TimeTableController],
  providers: [TimeTableService],
  exports: [TimeTableService],
})
export class TimeTableModule {}
