import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async signIn(email: string, pass: string): Promise<any> {
        this.logger.log(`User ${email} is trying to sign in`);
        const user = await this.usersService.findOne(email);

        if (!user) {
            this.logger.warn(`User with email ${email} not found`);
            throw new UnauthorizedException();
        }

        if (user?.pass !== pass) {
            this.logger.warn(`Invalid password for user with email ${email}`);
            throw new UnauthorizedException();
        }

        const payload = { id: user.id, email: user.email };

        return {
            access_token: await this.jwtService.signAsync(payload, {
                expiresIn: '1h',
            }),
        };
    }
}
