import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsInt, IsString, Max, Min } from "class-validator";

export class CreateStandardDto {

    @ApiProperty({
        description: 'Standard level (1-12)',
        minimum: 1,
        maximum: 12,
        example: 10
    })
    @IsInt()
    @Min(1)
    @Max(12)
    level: number;

    @ApiProperty({
        description: 'Standard category',
        enum: ['Primary', 'Middle', 'High'],
        example: 'Primary'
    })
    @IsString()
    @IsIn(['Primary', 'Middle', 'High'])
    category: string;

}
