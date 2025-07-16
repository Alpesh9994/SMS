import { IsString, IsOptional, IsEmail } from 'class-validator';

export class CreateTenantDto {
  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsEmail()
  adminEmail: string;

  @IsOptional()
  config?: object;
} 