import { TaskStatus } from '../tasks.model';

export class GetTasksFilgerDto {
  status?: TaskStatus;
  search?: string;
}
