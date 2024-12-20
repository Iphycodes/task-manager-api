import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  Request,
  //   Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JWTGuard } from 'src/auth/guards/jwt.guard';
import { TaskService } from './task.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import { TaskStatus } from 'src/utils/constant';

@ApiTags('tasks')
@ApiBearerAuth()
@UseGuards(JWTGuard)
@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Post()
  @ApiOperation({ summary: 'Create Task' })
  @ApiBody({ type: CreateTaskDto })
  @ApiResponse({ status: 201, description: 'Task successfully created' })
  async createTask(@Request() req: any, @Body() createTaskDto: CreateTaskDto) {
    console.log('user::::', req.user);
    return this.taskService.createTask(createTaskDto, req.user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'Find Tasks' })
  @ApiQuery({ name: 'status', enum: TaskStatus, required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getUserTasks(
    @Request() req: any,
    @Query('status') status?: TaskStatus,
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.taskService.getUserTasks(
      req.user.id,
      status,
      search,
      page,
      limit,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get One' })
  async getTaskById(@Request() req: any, @Param('id') taskId: string) {
    return this.taskService.getTaskById(taskId, req.user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update' })
  @ApiBody({
    type: UpdateTaskDto,
    schema: {
      example: {
        title: 'Update task title',
        description: 'Update task description',
        status: TaskStatus.PENDING,
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Task updated successfully' })
  async updateTask(
    @Request() req: any,
    @Param('id') taskId: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.taskService.updateTask(taskId, updateTaskDto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete' })
  @ApiResponse({ status: 201, description: 'task deleted successfully' })
  async deleteTask(@Param('id') taskId: string, @Request() req) {
    return this.taskService.deleteTask(taskId, req.user.id);
  }
}
