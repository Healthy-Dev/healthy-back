import { UsersService } from '../../users/users.service';
import { TestingModule, Test } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { User } from '../../users/user.entity';
import { JwtPayload } from '../../../dist/auth/strategy/jwt-payload.interface';
import { UnauthorizedException } from '@nestjs/common';

const mockUserService = () => ({
    getUserByUsername: jest.fn(),
});

process.env = Object.assign(process.env, { JWT_SECRET_KEY: 'secret' });

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let usersService;

  beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
          providers: [
          JwtStrategy,
          { provide: UsersService, useFactory: mockUserService},
          ],
      }).compile();
      jwtStrategy = await module.get<JwtStrategy>(JwtStrategy);
      usersService = await module.get<UsersService>(UsersService);

  });
  describe('validate',  () => {
    it('validates and returns the user based on JWT payload', async () => {
      const mockPayload: JwtPayload = {username: 'TestUsername'};
      const user = new User();
      user.username = 'TestUser';

      usersService.getUserByUsername.mockResolvedValue(user);
      expect(usersService.getUserByUsername).not.toHaveBeenCalled();
      const result = await jwtStrategy.validate(mockPayload);
      expect(usersService.getUserByUsername).toHaveBeenCalledWith(mockPayload.username);
      expect(result).toEqual(user);

    });
    it('throws an unauthorized exception as user cannot by found', async () => {
      const mockPayload: JwtPayload = {username: 'TestUsername'};
      usersService.getUserByUsername.mockResolvedValue(null);
      expect(jwtStrategy.validate(mockPayload)).rejects.toThrow(UnauthorizedException);
    });
  });

});