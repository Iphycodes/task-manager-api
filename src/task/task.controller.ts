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
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JWTGuard } from 'src/auth/guards/jwt.guard';
import { TaskService } from './task.service';
import { CreateTaskDto, TaskFilterDto, UpdateTaskDto } from './dto/task.dto';
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
  // async getUserTasks(
  //   @Request() req: any,
  //   @Query('status') status?: TaskStatus,
  //   @Query('search') search?: string,
  //   @Query('page') page?: number,
  //   @Query('limit') limit?: number,
  // ) {
  //   console.log('inside getTask controller');
  //   console.log(req.user);
  //   return this.taskService.getUserTasks(
  //     req.user.sub,
  //     status,
  //     search,
  //     page,
  //     limit,
  //   );
  // }
  async getUserTasks(@Query() filterDto: TaskFilterDto, @Request() req: any) {
    return this.taskService.getTasks(filterDto, req.user.sub);
  }

  @Get(':id')
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiOperation({ summary: 'Get One' })
  async getTaskById(@Request() req: any, @Param('id') taskId: string) {
    return this.taskService.getTaskById(taskId, req.user.sub);
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
    return this.taskService.updateTask(taskId, updateTaskDto, req.user.sub);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete' })
  @ApiResponse({ status: 201, description: 'task deleted successfully' })
  async deleteTask(@Param('id') taskId: string, @Request() req: any) {
    return this.taskService.deleteTask(taskId, req.user.sub);
  }
}
