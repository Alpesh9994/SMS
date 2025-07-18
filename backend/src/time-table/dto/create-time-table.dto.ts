import { ApiProperty } from '@nestjs/swagger';
import { DayOfWeek } from '@prisma/client';
import { IsEnum, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';


export class CreateTimeTableDto {

    @ApiProperty({ enum: DayOfWeek })
    @IsEnum(DayOfWeek)
    @IsNotEmpty()
    dayOfWeek: DayOfWeek;

    @ApiProperty()
    @IsInt()
    @Min(1)
    periodNumber: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    startTime: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    endTime: string;

    @ApiProperty()
    @IsInt()
    @Min(1)
    duration: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    divisionId: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    subjectId: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    teacherId: string;

}


