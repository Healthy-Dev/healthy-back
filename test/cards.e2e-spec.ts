import { HttpStatus, INestApplication, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CardRepository } from '../src/cards/card.repository';
import { CardsModule } from '../src/cards/cards.module';
import { CardCategoriesModule } from '../src/card-categories/card-categories.module';
import { GetCardsFilterDto } from '../src/cards/dto/get-cards.dto';
import { Card } from '../src/cards/card.entity';

describe('CardsController (e2e)', () => {
  let app: INestApplication;
  const mockCards = ['test'];
  const cardRepository = {
    getCards: jest.fn(),
    getCardById: jest.fn(),
  };
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, CardsModule, CardCategoriesModule],
    })
    .overrideProvider(CardRepository)
    .useValue(cardRepository)
    .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });
  describe('GET cards',() => {
    it('/v1/cards (GET)', () => {
      cardRepository.getCards.mockResolvedValue(mockCards);
      const filterDto: GetCardsFilterDto = {} as GetCardsFilterDto;
      return request(app.getHttpServer())
        .get('/v1/cards')
        .set('Accept', 'application/json')
        .send(filterDto)
        .expect(200)
        .expect(mockCards);
    });
  });
  describe('GET cards', () => {
    const mockCardId = 99;
    it('/v1/cards (GET) OK', () => {
      const card = new Card();
      card.id = 99;
      card.title = 'title';
      cardRepository.getCardById.mockResolvedValue(card);
      return request(app.getHttpServer())
        .get(`/v1/cards/${mockCardId}`)
        .expect(200)
        .expect(JSON.stringify(card));
    });
    it('/v1/cards (GET) Not found', () => {
      cardRepository.getCardById.mockImplementation((id) => {
        throw new NotFoundException(`Healthy Dev no encontró nada con el id ${id}`);
      })
      return request(app.getHttpServer())
        .get(`/v1/cards/${mockCardId}`)
        .expect(HttpStatus.NOT_FOUND)
        .expect({
          statusCode: 404,
          error: 'Not Found',
          message: `Healthy Dev no encontró nada con el id ${mockCardId}`,
        });
    });
  });

  afterAll(async (done) => {
    await app.close();
    done();
  });
});
