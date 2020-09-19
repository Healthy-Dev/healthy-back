import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserRepository } from './user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageManagementModule } from '../image-management/image-management.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository]), ImageManagementModule],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
