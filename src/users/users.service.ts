import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import { AuthService } from 'src/auth/auth.service';
import slugify from 'slugify';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @Inject(forwardRef(() => AuthService)) private readonly authService: AuthService
  ) { }

  findAll() {
    return this.userModel.find();
  }

  async getCurrentUser(user: Partial<User>): Promise<User | undefined> {
    return this.userModel.findById(user.id);
  }

  async findOne(id: string): Promise<User | undefined> {
    return this.userModel.findById(id);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userModel.findOne({ normalizedEmail: email.toLowerCase() });
  }

  async findByUsername(username: string): Promise<User | undefined> {
    const trimmed = slugify(username, ' ').trim();
    const sluggedUsername = slugify(trimmed, { lower: true });
    return this.userModel.findOne({ normalizedUsername: sluggedUsername }).lean();
  }

  async create(createUserDto: CreateUserDto): Promise<User | undefined> {
    let user = new this.userModel(createUserDto);
    return user.save();
  }

  async update(updateUserDto: UpdateUserDto, id: string): Promise<User | undefined> {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
  }

  async remove(_id: string): Promise<{ deletedCount: number }> {
    const result = await this.userModel.deleteOne({ _id });
    return result;
  }
}
