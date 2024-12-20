import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from './model/task.model';
import { Model } from 'mongoose';
import { CreateTaskDto, TaskFilterDto, UpdateTaskDto } from './dto/task.dto';
import { User } from 'src/auth/model/user.model';

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

  async getUserTasks(
    userId: string,
    status?: string,
    search?: string,
    page: number = 1,
    limit: number = 1,
  ): Promise<Task[]> {
    const query = { user: userId };

    if (status) {
      query['status'] = status;
    }

    if (search) {
      query['title'] = { $regex: search, $options: 'i' };
    }

    console.log('inside get user tasks');

    const task = await this.taskModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return task;
  }

  // async getTasks(filterDto: TaskFilterDto, user: User): Promise<Task[]> {
  //   const { status, search } = filterDto;
  //   const query = this.taskModel.find({ user: user._id });

  //   if (status) {
  //     query.where('status').equals(status);
  //   }

  //   if (search) {
  //     query.or([
  //       { title: { $regex: search, $options: 'i' } },
  //       { description: { $regex: search, $options: 'i' } },
  //     ]);
  //   }

  //   return query.exec();
  // }

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
