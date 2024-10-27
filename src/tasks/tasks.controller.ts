import { Body, Controller, ForbiddenException, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('tasks')
@UseGuards(AuthGuard)
export class TasksController {
    constructor(private readonly tasksService: TasksService) { }

    @Get('')
    async listTasks(@Request() req) {
        return this.tasksService.getTasksByUserId(req.user.id);
    }

    @Get('/:id')
    async getTask(@Param('id') id: string, @Request() req) {
        const task = await this.tasksService.getTask(id);

        if (task.owner.id !== req.user.id) {
            throw new ForbiddenException('No tienes permiso para ver esta tarea');
        }

        return task;
    }

    @Post('/edit')
    async editTask(@Body() body, @Request() req) {
        const task = await this.tasksService.getTask(body.id);

        if (task.owner.id !== req.user.id) {
            throw new ForbiddenException('No tienes permiso para editar esta tarea');
        }
        await this.tasksService.editTask(body);
        return this.tasksService.getTask(body.id);
    }
}
