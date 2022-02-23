import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import { AuthService } from 'src/auth/auth.service';
import slugify from 'slugify';
import { UpdateUserDto } from './dto/update-user.dto';

export interface ITokenized {
  user: Partial<User>,
  token: string
}

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @Inject(forwardRef(() => AuthService)) private readonly authService: AuthService
  ) { }

  findAll() {
    return this.userModel.find();
  }

  async getCurrentUser(userId: string): Promise<ITokenized | undefined> {
    const user = await this.userModel.findById(userId);
    if (user) {
      return this.tokenize(user);
    }
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

  async create(createUserDto: CreateUserDto): Promise<ITokenized> {
    let user = new this.userModel(createUserDto);
    user = await user.save();
    return this.tokenize(user);
  }

  async update(updateUserDto: UpdateUserDto, id: string): Promise<User | undefined> {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
  }

  async remove(_id: string): Promise<{ deletedCount: number }> {
    const result = await this.userModel.deleteOne({ _id });
    return result;
  }

  deleteAll() {
    return this.userModel.deleteMany();
  }

  getCount() {
    return this.userModel.count();
  }

  private tokenize(user: User): ITokenized {
    const { password, ...rest } = user.toObject();
    const { token } = this.authService.getToken(user);
    return { user: rest, token };
  }
}
