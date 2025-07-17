import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsString, IsUUID, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateStudentDto {
  @ApiProperty()
  @IsString()
  @MaxLength(100)
  name: string;
  
  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  dateOfBirth: Date;
  
  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  admissionDate: Date;
  
  @ApiProperty()
  @IsUUID()
  currentStandardId: string;
  
  @ApiProperty()
  @IsUUID()
  currentDivisionId: string;
}
