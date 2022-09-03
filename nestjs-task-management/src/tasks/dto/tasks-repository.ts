import { Repository } from 'typeorm';
import { DataSource } from 'typeorm';
import { CreateTaskDto } from './create-task.dto';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { Injectable } from '@nestjs/common';
import { GetTasksFilgerDto } from './get-tasks-filter.dto';
import { User } from '../../auth/user.entity';

//https://stackoverflow.com/questions/71557301/how-to-workraound-this-typeorm-error-entityrepository-is-deprecated-use-repo

@Injectable()
export class TasksRepository extends Repository<Task> {
  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  async getTasks(filterDto: GetTasksFilgerDto, user:User): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');
    query.where({ user });

    if (status) {
      query.andWhere('task.status = :status', { status: status });
    }

    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%`},
      );
    }
  
    const tasks = await query.getMany();
    return tasks;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user: user
    });
    await this.save(task);
    return task;
  }
}