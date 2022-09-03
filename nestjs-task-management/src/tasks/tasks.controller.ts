import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { title } from 'process';
import { TasksService } from './tasks.service';
import { TaskStatus } from './dto/task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilgerDto } from './dto/get-tasks-filter.dto';
import { updateTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from './dto/task.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  async getTasks(
    @Query() filterDto: GetTasksFilgerDto,
    @GetUser() user: User,
    ): Promise<Task[]> {
    return this.tasksService.getTasks(filterDto, user);
  }
  
  @Get('/:id')
  async getTaskById(
    @Param('id') id: string,
    @GetUser() user:User,
    ): Promise<Task> {
    return this.tasksService.getTaskById(id, user);
  }

  @Post()
  async creatTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user:User,
    ): Promise<Task> {
    return this.tasksService.creatTask(createTaskDto, user);
  }

  @Delete('/:id')
  async deleteTask(
    @Param('id') id: string,
    @GetUser() user: User,
    ): Promise<void> {
    return this.tasksService.deleteTask(id, user);//ここreturnがないとdeleteTaskの例外がハンドルされずにアプリがクラッシュする。
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: updateTaskStatusDto,
    @GetUser() user: User,
  ): Promise<Task> {
    const { status } = updateTaskStatusDto;
    return this.tasksService.updateTaskStatus(id, status, user);
  }
  /*
  @Get()
  getTasks(@Query() filterDto: GetTasksFilgerDto): Task[] {
    if (Object.keys(filterDto).length) {
      return this.tasksService.getTasksWithFilters(filterDto);
    } else {
      return this.tasksService.getAllTasks();
    }
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string): Task {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  creatTask(@Body() createTaskDto: CreateTaskDto): Task {
    return this.tasksService.creatTask(createTaskDto);
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string): void {
    this.tasksService.deleteTask(id);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: updateTaskStatusDto,
  ): Task {
    const { status } = updateTaskStatusDto;
    return this.tasksService.updateTaskStatus(id, status);
  }
  */
}
