import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Template, TemplateSchema } from './entities/template.entity';
import { TemplatesController } from './templates.controller';
import { TemplatesService } from './templates.service';

@Module({
  controllers: [TemplatesController],
  imports: [
    MongooseModule.forFeature([
      {
        name: Template.name,
        schema: TemplateSchema
      }
    ])
  ],
  providers: [TemplatesService],
  exports: [TemplatesService]
})
export class TemplatesModule {}
