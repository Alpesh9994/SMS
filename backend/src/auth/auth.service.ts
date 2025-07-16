import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
      ) {}
    
      // Validate user credentials
      async validateUser(email: string, password: string) {
        const user = await this.userService.findByEmail(email);
        if (user && await bcrypt.compare(password, user.password)) {
          // Exclude password from returned user object
          const { password, ...result } = user;
          return result;
        }
        return null;
      }
    
      // Login and return JWT
      async login(user: any) {
        const payload = {
          sub: user.id,
          email: user.email,
          role: user.role,
          tenantId: user.tenantId,
        };
        return {
          access_token: this.jwtService.sign(payload),
          user,
        };
      }
}
