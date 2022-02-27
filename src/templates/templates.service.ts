import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Template } from './entities/template.entity';

@Injectable()
export class TemplatesService {
  constructor(
    @InjectModel(Template.name) private readonly templateModel: Model<Template>
  ) { }

  // This is only for development convenience - remove later
  deleteAll() {
    console.log('running TemplatesService.deleteAll()');
    return this.templateModel.deleteMany({});
  }
}
