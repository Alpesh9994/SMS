import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards, ForbiddenException, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access-token')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('profile')
    getProfile(@Request() req){
        return req.user;
    }

    @Roles('SUPER_ADMIN', 'SCHOOL_ADMIN')
    @Post()
    async create(@Body() data: CreateUserDto, @Request() req){
        if (req.user.role === 'SCHOOL_ADMIN') {
            if (!['TEACHER', 'STUDENT'].includes(data.role)) {
                throw new ForbiddenException('School Admins can only create TEACHER or STUDENT users');
            }
            // Fix property name to match DTO
            (data as any).tenantId = req.user.tenantId;
        }
        const user = await this.userService.create(data);
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    @Get()
    async findAll() {
        const users = await this.userService.findAll();
        return users.map(({ password, ...userWithoutPassword }) => userWithoutPassword);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const user = await this.userService.findOne(id);
        if (!user) return null;
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    @Roles('SUPER_ADMIN', 'SCHOOL_ADMIN')
    @Patch(':id')
    async update(@Param('id') id: string, @Body() data: UpdateUserDto, @Request() req) {
        const user = await this.userService.findOne(id);
        if (!user) throw new NotFoundException('User not found');
        if (req.user.role === 'SCHOOL_ADMIN' && user.tenantId !== req.user.tenantId) {
            throw new ForbiddenException('You can only update users in your own school');
        }
        const updatedUser = await this.userService.update(id, data);
        const { password, ...userWithoutPassword } = updatedUser;
        return userWithoutPassword;
    }

    @Roles('SUPER_ADMIN', 'SCHOOL_ADMIN')
    @Delete(':id')
    async remove(@Param('id') id: string, @Request() req) {
        const user = await this.userService.findOne(id);
        if (!user) throw new NotFoundException('User not found');
        if (req.user.role === 'SCHOOL_ADMIN' && user.tenantId !== req.user.tenantId) {
            throw new ForbiddenException('You can only delete users in your own school');
        }
        return this.userService.remove(id);
    }
}
