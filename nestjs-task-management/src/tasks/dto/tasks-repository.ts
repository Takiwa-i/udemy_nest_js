import { Repository } from 'typeorm';
import { DataSource } from 'typeorm';
import { CreateTaskDto } from './create-task.dto';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { Injectable } from '@nestjs/common';

//https://stackoverflow.com/questions/71557301/how-to-workraound-this-typeorm-error-entityrepository-is-deprecated-use-repo

@Injectable()
export class TasksRepository extends Repository<Task> {
  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });
    await this.save(task);
    return task;
  }
}