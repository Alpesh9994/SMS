import { IsString, IsOptional, IsEmail, IsBoolean } from 'class-validator';

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

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}