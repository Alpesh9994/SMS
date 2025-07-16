import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from "class-validator";


export enum Role {
    SUPER_ADMIN = 'SUPER_ADMIN',
    SCHOOL_ADMIN = 'SCHOOL_ADMIN',
}

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    @MinLength(6)
    password?: string;

    @IsOptional()
    @IsEnum(Role)
    role?: Role;

    @IsOptional()
    @IsString()
    tenantID?: string;
}