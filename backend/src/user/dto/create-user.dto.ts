import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from "class-validator";

export enum Role {
    SUPER_ADMIN = 'SUPER_ADMIN',
    SCHOOL_ADMIN = 'SCHOOL_ADMIN'
}

export class CreateUserDto {
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsEnum(Role)
    role: Role;

    @IsOptional()
    @IsString()
    tenantID?: string;
}