import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString, IsUUID, Min } from "class-validator";

export class CreateDivisionDto {

    @ApiProperty({
        description: 'Division name (A, B, C, D, etc.)',
        example: 'A'
    })
    @IsString()
    name: string;

    @ApiProperty({
        description: 'Maximum student capacity for this division',
        minimum:1,
        example: 40
    })
    @IsInt()
    @Min(1)
    studentCapacity: number;

    @ApiProperty({
        description: 'Standard ID this division belongs to',
        example: 'uuid-string'
    })
    @IsUUID()
    standardId: string;

    @ApiPropertyOptional({
        description: 'Class teacher ID (optional)',
        example: 'teacher-uuid-string'
    })
    @IsOptional()
    @IsUUID()
    classTeacherId?: string;

}
