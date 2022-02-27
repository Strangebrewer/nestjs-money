import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>
  ) { }

  // This is only for development convenience - remove later
  deleteAll() {
    console.log('running CategoriesService.deleteAll()');
    return this.categoryModel.deleteMany({});
  }
}
