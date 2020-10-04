import { Test, TestingModule } from '@nestjs/testing';
import { MailTemplatesService } from './mail-templates.service';

describe('MailTemplatesService', () => {
  let service: MailTemplatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailTemplatesService],
    }).compile();

    service = module.get<MailTemplatesService>(MailTemplatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
