import { Body, Controller, Get, Param, Post, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { AuthGuard } from 'src/auth/auth.guard';//----

@Controller('tasks')
@UseGuards(AuthGuard) //---
export class TasksController {
    constructor(private readonly tasksService: TasksService) { }

    @Get('')
    async listTasks(@Request() req) {
        // return this.tasksService.listTasks();
        return this.tasksService.getTasksByUserId(req.user.id);
    }

    @Get('/:id')
    async getTask(@Param('id') id: string, @Request() req) {
        // return this.tasksService.getTask(id);
        const task = await this.tasksService.getTask(id);

        if (task.owner.id !== req.user.id) {
            throw new UnauthorizedException('No tienes permiso para ver esta tarea');
        }

        return task;
    }

    @Post('/edit')
    async editTask(@Body() body) {
        return this.tasksService.editTask(body);
    }
}
