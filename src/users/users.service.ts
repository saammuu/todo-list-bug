import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name);
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) { }

    async create(body: any) {
        const user = new User();
        user.email = body.email;
        user.pass = body.pass;
        user.fullname = body.fullname;

        await this.usersRepository.save(user);
        this.logger.log(`User created with email: ${user.email}`)

        return user;
    }

    async findOne(email: string) {
        this.logger.log(`Finding user with email: ${email}`);
        const user = await this.usersRepository.findOneBy({
            email,
        });

        if (!user) {
            this.logger.warn(`User not found with email: ${email}`);
        }

        return user;
    }

    async listUsers() {
        this.logger.log('Listing all users');

        const users = await this.usersRepository.find();

        return users;
    }
}
