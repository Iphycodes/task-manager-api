import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsString,
  IsInt,
  Min,
} from 'class-validator';
import { TaskStatus } from 'src/utils/constant';

export class CreateTaskDto {
  @ApiProperty({
    description: 'Task title',
    example: 'Complete NestJS project',
    default: 'Finish up task 1',
  })
  @IsNotEmpty({ message: 'Title is required' })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Task description (optional)',
    example: 'Finish the task management feature',
    required: false,
    default: 'Finish up task one description',
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
    default: 'Updated Task Tilte',
  })
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    description: 'Task description (optional)',
    example: 'This task is updated',
    required: false,
    default: 'This task is updated',
  })
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Task status',
    enum: TaskStatus,
    required: false,
    default: TaskStatus.COMPLETED,
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

  @ApiPropertyOptional({ default: '' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  perPage?: number;

  @ApiPropertyOptional({ enum: ['asc', 'desc'], default: 'desc' })
  @IsOptional()
  @IsString()
  sort?: 'asc' | 'desc' = 'desc';
}
