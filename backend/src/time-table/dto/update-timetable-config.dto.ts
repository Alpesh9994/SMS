import { PartialType } from '@nestjs/swagger';
import { CreateTimeTableConfigDto } from './create-timetable-config.dto';

export class UpdateTimeTableConfigDto extends PartialType(CreateTimeTableConfigDto) {}