import { Test, TestingModule } from '@nestjs/testing';
import { TokensService } from './tokens.service';

describe('TokensService', () => {
  let service: TokensService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TokensService],
    }).compile();

    service = module.get<TokensService>(TokensService);
  });

  it.skip('should be defined', () => {
    expect(service).toBeDefined();
  });
});
