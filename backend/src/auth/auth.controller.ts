import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from './public.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Public()
    @ApiOperation({ summary: 'User login' })
    @ApiBody({ schema: {
        type: 'object',
        properties: {
        email: { type: 'string', example: 'super@admin.com' },
        password: { type: 'string', example: 'Super@admin' }
        }
    }})
    @ApiResponse({ status: 201, description: 'JWT token and user info returned' })
    @Post('login')
    async login(@Body() body: {email: string; password: string}) {
        const user = await this.authService.validateUser(body.email, body.password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return this.authService.login(user);
    }
}
