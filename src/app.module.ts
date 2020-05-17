import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardsModule } from './cards/cards.module';

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'du7xgj6ms',
  api_key: '188197447859445',
  api_secret: 'kUvtxcl4tkozexP_upTu-hXb7sE',
});

@Module({
  imports: [TypeOrmModule.forRoot(), CardsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
