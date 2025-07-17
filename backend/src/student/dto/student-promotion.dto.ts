import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID } from 'class-validator';

export class StudentPromotionDto {
  @ApiProperty({ 
    description: 'Array of student IDs to promote',
    example: ['550e8400-e29b-41d4-a716-446655440000']
  })
  @IsArray()
  @IsUUID(undefined, { each: true })
  studentIds: string[];

  @ApiProperty({
    description: 'Target standard ID',
    example: 'd6f3a8e0-1b9c-4e2f-8a7d-5c4b3a2e1d0f'
  })
  @IsUUID()
  targetStandardId: string;

  @ApiProperty({
    description: 'Target division ID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
  })
  @IsUUID()
  targetDivisionId: string;
}
