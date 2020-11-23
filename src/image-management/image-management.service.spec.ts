import { Test, TestingModule } from '@nestjs/testing';
import { ImageManagementService } from './image-management.service';

describe('ImageManagementService', () => {
  let service: ImageManagementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImageManagementService],
    }).compile();

    service = module.get<ImageManagementService>(ImageManagementService);
  });

  it.skip('should be defined', () => {
    expect(service).toBeDefined();
  });
});
