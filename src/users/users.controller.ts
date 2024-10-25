import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post('/create')
    async create(@Body() body) {
        return this.usersService.create(body);
    }

    // Nuevo endpoint para obtener todos los usuarios
    @Get('')
    async listUsers() {
        return this.usersService.listUsers();
    }

    // Nuevo endpont para obtener un usuario por email
    @Get('/:email')
    async findOne(@Param('email') email: string) {
        return this.usersService.findOne(email);
    }
}
