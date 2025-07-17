import { ApiProperty } from '@nestjs/swagger';
import { CreateStudentDto } from './create-student.dto';

export class BatchEnrollmentDto {
  @ApiProperty({ type: [CreateStudentDto] })
  students: CreateStudentDto[];
}
