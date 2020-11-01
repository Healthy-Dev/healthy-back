import { HttpStatus, INestApplication, NotFoundException, ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import 'dotenv/config';
import { CreateUserDto } from '../src/users/dto/create-user.dto';
import { User } from '../src/users/user.entity';
import { AppModule } from '../src/app.module';
import { AuthModule } from '../src/auth/auth.module';
import { UsersModule } from '../src/users/users.module';
import * as request from 'supertest';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../src/users/user.repository';

import { MailModule } from '../src/mail/mail.module';
import { MailService } from '../src/mail/mail.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  const userRepository = {
    createUser: jest.fn(),
    getUserByUsernameOrEmail: jest.fn(),
    findOne: jest.fn(),
  };
  const mailService = {
    sendMail: jest.fn(),
  }

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, AuthModule, UsersModule, MailModule],
    })
    .overrideProvider(UserRepository)
    .useValue(userRepository)
    .overrideProvider(MailService)
    .useValue(mailService)
    .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });
  describe('/v1/auth/signup (POST)', () => {
    let user;
    let mockPassword;
    let mockcreateUserDto: CreateUserDto;
    beforeEach(async () => {
      mockPassword = 'Test123456';
      user = new User();
      user.username = 'test';
      const salt = await bcrypt.genSalt();
      user.password =  await bcrypt.hash(mockPassword, salt);
      user.id = 99;
      user.email = 'test@test.com';
      mockcreateUserDto = {username: 'test', email: 'test@test.com', password: mockPassword};
    });
    it('register successfully', () => {
      userRepository.createUser.mockResolvedValue({id: 99});
      userRepository.getUserByUsernameOrEmail.mockResolvedValue(user);
      userRepository.findOne.mockResolvedValue(user);
      mailService.sendMail.mockResolvedValue(true);
      return request(app.getHttpServer())
        .post('/v1/auth/signup')
        .set('Accept', 'application/json')
        .send(mockcreateUserDto)
        .expect(HttpStatus.CREATED);
    });
    it('register fail email already exists', () => {
      userRepository.createUser.mockImplementation( () => { 
        throw new ConflictException('HealthyDev te informa que ya hay un usuario registrado con ese email')
      });
      userRepository.getUserByUsernameOrEmail.mockResolvedValue(user);
      userRepository.findOne.mockResolvedValue(user);
      mailService.sendMail.mockResolvedValue(true);
      return request(app.getHttpServer())
        .post('/v1/auth/signup')
        .set('Accept', 'application/json')
        .send(mockcreateUserDto)
        .expect(HttpStatus.CONFLICT);
    });
  });
  afterAll(async (done) => {
    await app.close();
    done();
  });
});