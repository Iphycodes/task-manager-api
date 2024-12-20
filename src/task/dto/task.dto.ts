import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsEnum, IsString } from 'class-validator';
import { TaskStatus } from 'src/utils/constant';

export class CreateTaskDto {
  @ApiProperty({
    description: 'Task title',
    example: 'Complete NestJS project',
  })
  @IsNotEmpty({ message: 'Title is required' })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Task description (optional)',
    example: 'Finish the task management feature',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Task status',
    enum: TaskStatus,
    default: TaskStatus.PENDING,
    required: false,
  })
  @IsOptional()
  @IsEnum(TaskStatus, { message: 'Invalid task status' })
  status?: TaskStatus = TaskStatus.PENDING;
}

export class UpdateTaskDto {
  @ApiPropertyOptional({
    description: 'Task title (optional)',
    example: 'Updated Task Title',
    required: false,
  })
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    description: 'Task description (optional)',
    example: 'Updated task description',
    required: false,
  })
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Task status',
    enum: TaskStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(TaskStatus, { message: 'Invalid task status' })
  status?: TaskStatus;
}

export class TaskFilterDto {
  @ApiPropertyOptional({ enum: TaskStatus })
  @IsOptional()
  @IsEnum(TaskStatus, { message: 'Invalid task status' })
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;
}
