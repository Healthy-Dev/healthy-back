import { Module } from '@nestjs/common';
import { ImageManagementService } from './image-management.service';

@Module({
  providers: [ImageManagementService],
  exports: [ImageManagementService],
})
export class ImageManagementModule {}
