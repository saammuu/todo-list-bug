import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from '../entities/task.entity';
import { Repository } from 'typeorm';
import { TaskDto } from 'src/dto/task.dto';
import { User } from 'src/entities/user.entity';

@Injectable()
export class TasksService {
    private readonly logger = new Logger(TasksService.name);
    constructor(
        @InjectRepository(Task)
        private readonly tasksRepository: Repository<Task>,
    ) { }

    async listTasks() {
        try {
            this.logger.log('Listing all tasks');
            const tasks = await this.tasksRepository.find();
            return tasks;
        } catch (error) {
            this.logger.error('Error while listing tasks', error.stack);
            throw new InternalServerErrorException('Error while listing tasks');
        }
    }

    async getTask(id: string) {

        try {
            this.logger.log(`Fetching task with ID: ${id}`);
            const task = await this.tasksRepository
                .createQueryBuilder('task')
                .leftJoinAndSelect('task.owner', 'owner')
                .where('task.id = :id', { id })
                .getOne();
            if (!task) {
                this.logger.warn(`Task not found with ID: ${id}`);
                throw new NotFoundException(`Task Not Found`);
            }
            return task;
        } catch (error) {
            this.logger.error('Error while fetching task', error.stack);
            throw new InternalServerErrorException('Error while listing task')
        }
    }


    async getTasksByUserId(userId: string) {
        try {
            this.logger.log(`Listing tasks for user ID: ${userId}`);
            return await this.tasksRepository.find({
                where: {
                    owner: {
                        id: userId,
                    },
                },
                relations: ['owner'],
            });
        } catch (error) {
            this.logger.error('Error while listing tasks by user ID', error.stack);
            throw new InternalServerErrorException('Error while listing tasks by user ID')
        }

    }

    async editTask(body: any) {
        try {
            this.logger.log(`Editing task with ID: ${body.id}`);
            await this.tasksRepository.update(body.id, body);
            const editedTask = await this.getTask(body.id);
            this.logger.log(`Task edited successfully: ${editedTask.id}`);
            return editedTask;
        } catch (error) {
            this.logger.error('Error while editing task', error.stack);
            throw new InternalServerErrorException('Error while editing task');
        }


    }


    async createTask(taskDto: TaskDto, userId: string) {
        try {
            const newTask = this.tasksRepository.create(taskDto);
            newTask.owner = { id: userId } as User;

            await this.tasksRepository.save(newTask);

            this.logger.log(`Task created with title: ${newTask.title} for user ID: ${userId}`);
            return newTask;
        } catch (error) {
            this.logger.error('Failed to create task', error.stack);
            throw new BadRequestException('Task creation failed due to invalid data');
        }
    }
}
