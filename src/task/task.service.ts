import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from './model/task.model';
import { Model } from 'mongoose';
import { CreateTaskDto, TaskFilterDto, UpdateTaskDto } from './dto/task.dto';
import { PaginatedData } from 'src/utils/types/types';

@Injectable()
export class TaskService {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

  async createTask(
    createTaskDto: CreateTaskDto,
    userId: string,
  ): Promise<Task> {
    const task = new this.taskModel({
      ...createTaskDto,
      user: userId,
    });

    return await task.save();
  }

  // async getUserTasks(
  //   userId: string,
  //   status?: string,
  //   search?: string,
  //   page: number = 1,
  //   limit: number = 10,
  // ): Promise<Task[]> {
  //   const query = { user: userId };

  //   if (status) {
  //     query['status'] = status;
  //   }

  //   if (search) {
  //     query['title'] = { $regex: search, $options: 'i' };
  //   }

  //   console.log('inside get user tasks');

  //   const task = await this.taskModel
  //     .find(query)
  //     .sort({ createdAt: -1 })
  //     .skip((page - 1) * limit)
  //     .limit(limit);

  //   return task;
  // }

  async getTasks(
    filterDto: TaskFilterDto,
    userId: string,
  ): Promise<PaginatedData<Task>> {
    const { status, search, page = 1, perPage = 10, sort = 'desc' } = filterDto;

    const query = this.taskModel.find({ user: userId });

    if (status) {
      query.where('status').equals(status);
    }

    if (search) {
      query.or([
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ]);
    }

    const skip = (page - 1) * perPage;

    // Get total count for pagination
    const total = await this.taskModel.countDocuments(query.getFilter());

    // Apply pagination and sorting
    const tasks = await query
      .sort({ createdAt: sort })
      .skip(skip)
      .limit(perPage)
      .exec();

    // Calculate total pages
    const totalPages = Math.ceil(total / perPage);

    return {
      items: tasks,
      total,
      page,
      perPage,
      totalPages,
    };
  }

  async getTaskById(taskId: string, userId: string): Promise<Task> {
    const task = this.taskModel.findOne({ _id: taskId, user: userId });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  // async updateTask(
  //   taskId: string,
  //   updateTaskDto: UpdateTaskDto,
  //   userId: string,
  // ): Promise<Task> {
  //   const task = this.taskModel.findOne({ _id: taskId, user: userId });
  //   if (!task) {
  //     throw new NotFoundException('Task not found');
  //   }

  //   // if ((await task).user !== userId) {
  //   //   throw new UnauthorizedException(
  //   //     'You cannot update a task you do not own',
  //   //   );
  //   // }

  //   Object.assign(task, updateTaskDto);

  //   return (await task).save();
  // }

  async updateTask(
    id: string,
    updateTaskDto: UpdateTaskDto,
    userId: string,
  ): Promise<Task> {
    const task = await this.taskModel.findOneAndUpdate(
      { _id: id, user: userId },
      updateTaskDto,
      { new: true },
    );

    // console.log('task user::', task.user);
    // console.log('loggedIn user::', userId);

    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return task;
  }

  async deleteTask(taskId: string, userId: string) {
    const result = this.taskModel.deleteOne({ _id: taskId, user: userId });

    if ((await result).deletedCount === 0) {
      throw new NotFoundException('Task not found');
    }

    return { message: 'Task deleted successfully' };
  }
}
