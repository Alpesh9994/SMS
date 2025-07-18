import { IsInt, IsString, Min, Max, IsArray, ValidateNested, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class BreakSlotDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string; // e.g., "Morning Break", "Lunch Break"

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  startTime: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  endTime: string;
}

export class CreateTimeTableConfigDto {
  @ApiProperty({ minimum: 1, maximum: 12 })
  @IsInt()
  @Min(1)
  @Max(12)
  periodsPerDay: number;

  @ApiProperty({ minimum: 30, maximum: 120 })
  @IsInt()
  @Min(30)
  @Max(120)
  defaultDuration: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  startTime: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  endTime: string;

  @ApiProperty({ type: [BreakSlotDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BreakSlotDto)
  breakSlots: BreakSlotDto[];
}