import { IsOptional, IsString, IsEmail, IsArray, IsUUID } from "class-validator";

export class CreateTeacherDto {

    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsArray()
    @IsUUID('4', { each: true })
    subjectIds: string[];
}
