import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/auth/model/user.model';
import { UserFilterDto } from './dto/user.dto';
import { PaginatedData } from 'src/utils/types/types';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getAllUsers(
    userFilterDto: UserFilterDto,
  ): Promise<PaginatedData<Partial<User>>> {
    const { search, page = 1, perPage = 10, sort = 'desc' } = userFilterDto;

    const query = this.userModel.find({});

    if (search) {
      query.or([{ email: { $regex: search, $options: 'i' } }]);
    }

    const skip = (page - 1) * perPage;

    const users = await query
      .sort({ createdAt: sort })
      .skip(skip)
      .limit(perPage)
      .exec();

    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user.toObject();
      return rest;
    });

    const total = await this.userModel.countDocuments(query.getFilter());
    const totalPages = Math.ceil(total / perPage);

    return {
      items: usersWithoutPassword,
      total,
      page,
      perPage,
      totalPages,
    };
  }

  async getUserById(userId: string): Promise<Partial<User>> {
    const user = (await this.userModel.findOne({ _id: userId })).toObject();

    const { password, ...userWithoutPassword } = user;

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return userWithoutPassword;
  }
}
