import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from './model/user.model';
import { CreateUserDto, LoginUserDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  // User Registration
  async register(createUserDto: CreateUserDto): Promise<any> {
    const { email, password } = createUserDto;

    try {
      // Check if user already exists
      const existingUser = await this.userModel.findOne({ email });
      if (existingUser) {
        this.logger.warn(`Registration attempt with existing email: ${email}`);
        throw new ConflictException('User with this email already exists');
      }

      // Hash password
      const saltRounds = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create new user
      const newUser = new this.userModel({
        email: email.toLowerCase(),
        password: hashedPassword,
      });

      // Save user and remove password from returned object
      const savedUser = await newUser.save();
      const userObject = savedUser.toObject();
      const { password: _, ...userWithoutPassword } = userObject;

      if (userWithoutPassword._id) {
        userWithoutPassword._id = userWithoutPassword._id.toString();
      }

      // delete userObject.password;

      this.logger.log(`User registered successfully: ${email}`);
      return userWithoutPassword;
    } catch (error) {
      this.logger.error(`Registration error: ${error.message}`);
      throw error;
    }
  }

  // User Login
  async login(loginUserDto: LoginUserDto): Promise<{ access_token: string }> {
    const { email, password } = loginUserDto;

    try {
      // Find user
      const user = await this.userModel.findOne({
        email: email.toLowerCase(),
      });

      if (!user) {
        this.logger.warn(`Login attempt with non-existent email: ${email}`);
        throw new UnauthorizedException('Invalid credentials');
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        this.logger.warn(`Failed login attempt for email: ${email}`);
        throw new UnauthorizedException('Invalid credentials');
      }

      // Generate JWT
      const payload = {
        sub: user._id,
        email: user.email,
      };
      const access_token = await this.jwtService.signAsync(payload);

      this.logger.log(`User logged in successfully: ${email}`);
      return { access_token };
    } catch (error) {
      this.logger.error(`Login error: ${error.message}`);
      throw error;
    }
  }
}
