import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './dto/task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilgerDto } from './dto/get-tasks-filter.dto';
import { Repository, ReturningStatementNotSupportedError } from 'typeorm';
import { Task } from './dto/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TasksRepository } from './dto/tasks-repository';
import { rmSync } from 'fs';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository,
  ) {}

  async getTasks(filterDto: GetTasksFilgerDto, user:User): Promise<Task[]> {
    return this.tasksRepository.getTasks(filterDto, user);
  }

  async getTaskById(id: string, user:User): Promise<Task> {
    const found: Task[] = await this.tasksRepository.find({ where: {id, user }});

    if (found.length === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return found[0];
  }

  async creatTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto, user);
  }


  async deleteTask(id: string, user:User): Promise<void> {
    const result = await this.tasksRepository.delete({ id, user });

    console.log(result.affected);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }

  async updateTaskStatus(id: string, status: TaskStatus, user:User): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await this.tasksRepository.save(task);
    return task;
  } 
}
