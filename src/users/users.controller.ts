import { Controller, Get, Param, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UserFilterDto } from './dto/user.dto';
import { User } from 'src/auth/model/user.model';
import { PaginatedData } from 'src/utils/types/types';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Find Users' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'perPage', required: false, type: Number })
  async getAllUsers(
    @Query() userFilterDto: UserFilterDto,
  ): Promise<PaginatedData<Partial<User>>> {
    return this.usersService.getAllUsers(userFilterDto);
  }

  @Get(':id')
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiOperation({ summary: 'Get User' })
  async getUserById(@Param('id') userid: string): Promise<Partial<User>> {
    return this.usersService.getUserById(userid);
  }
}
