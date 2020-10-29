import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { MailTemplatesService } from '../mail-templates/mail-templates.service';
import { TokensService } from '../tokens/tokens.service';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ConflictException, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { EmailDto } from './dto/resend-verification.dto';
import { UserStatus } from '../users/user-status.enum';
import { TokenDto } from './dto/token.dto';
import { TokenType } from '../tokens/token-type.enum';
import { NewPasswordDto } from './dto/new-password.dto';
import { TokenPayload } from '../tokens/dto/token-payload.dto';

const mockUserService = () => ({
  getUserByUsernameOrEmail: jest.fn(),
  createUser: jest.fn(),
  getUserByEmail: jest.fn(),
  changePassword: jest.fn(),
});

const mockJwtService = () => ({
  sign: jest.fn(),
});

const mockMailTemplatesService = () => ({

});

const mockTokensService = () => ({
  verifyEncryptedToken: jest.fn(),
});

describe('AuthService', () => {
  let authService: AuthService;
  let usersService;
  let jwtService;
  let mailTemplatesService;
  let tokensService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useFactory: mockUserService},
        { provide: JwtService, useFactory: mockJwtService},
        { provide: MailTemplatesService, useFactory: mockMailTemplatesService},
        { provide: TokensService, useFactory: mockTokensService},
       ],
    }).compile();

    authService = await module.get<AuthService>(AuthService);
    usersService = await module.get<UsersService>(UsersService);
    jwtService = await module.get<JwtService>(JwtService);
    mailTemplatesService = await module.get<MailTemplatesService>(MailTemplatesService);
    tokensService = await module.get<TokensService>(TokensService);
  });

  describe('signUp', () => {
    let user;
    let mockPassword;
    let mockcreateUserDto: CreateUserDto;
    let mockSalt;
    beforeEach(async () => {
      user = new User();
      user.username = 'test';
      user.password = 'EncryptedPassword';
      mockPassword = 'Test123456';
      mockcreateUserDto = {username: 'test', email: 'test@test.com', password: mockPassword};
      mockSalt = 'salt';
    });
    it('returns the result from signIn as signUp is successfully', async () => {
      const mockAccessToken = {accessToken: 'token'};
      Object.defineProperty(bcrypt, 'genSalt', {value: jest.fn().mockResolvedValue(mockSalt)});
      Object.defineProperty(bcrypt, 'hash', {value: jest.fn().mockResolvedValue('passwordHash')});
      usersService.createUser.mockResolvedValue({id: 9999});
      authService.sendEmailVerification = jest.fn();
      authService.signIn = jest.fn().mockResolvedValue(mockAccessToken);
      const loggerError = Logger.prototype.error = jest.fn();
      const result = await authService.signUp(mockcreateUserDto);
      expect(bcrypt.genSalt).toHaveBeenCalledTimes(1);
      expect(bcrypt.hash).toHaveBeenCalledWith(mockPassword, mockSalt);
      expect(usersService.createUser).toHaveBeenCalledWith(mockcreateUserDto);
      expect(authService.sendEmailVerification).toHaveBeenCalledWith(mockcreateUserDto.username, mockcreateUserDto.email);
      expect(authService.signIn).toHaveBeenCalledWith({ usernameOrEmail: mockcreateUserDto.username, password: mockPassword });
      expect(loggerError).not.toHaveBeenCalled();
      expect(result).toEqual(mockAccessToken);
    });
    it('throws an error as not create user', () => {
      Object.defineProperty(bcrypt, 'genSalt', {value: jest.fn().mockResolvedValue(mockSalt)});
      Object.defineProperty(bcrypt, 'hash', {value: jest.fn().mockResolvedValue('passwordHash')});
      usersService.createUser.mockResolvedValue(null);
      authService.sendEmailVerification = jest.fn();
      authService.signIn = jest.fn();
      expect(authService.signUp(mockcreateUserDto)).rejects.toThrow(InternalServerErrorException);
    });
    it('returns the result from signIn as signUp is successfullly, but the email not been sent', async () => {
      const mockAccessToken = {accessToken: 'token'};
      Object.defineProperty(bcrypt, 'genSalt', {value: jest.fn().mockResolvedValue(mockSalt)});
      Object.defineProperty(bcrypt, 'hash', {value: jest.fn().mockResolvedValue('passwordHash')});
      usersService.createUser.mockResolvedValue({id: 9999});
      authService.sendEmailVerification = jest.fn().mockImplementation(() => {
        throw new Error();
      });
      const logger = Logger.prototype.error = jest.fn();
      authService.signIn = jest.fn().mockResolvedValue(mockAccessToken);
      const result = await authService.signUp(mockcreateUserDto);
      expect(bcrypt.genSalt).toHaveBeenCalledTimes(1);
      expect(bcrypt.hash).toHaveBeenCalledWith(mockPassword, mockSalt);
      expect(usersService.createUser).toHaveBeenCalledWith(mockcreateUserDto);
      expect(authService.sendEmailVerification).toHaveBeenCalledWith(mockcreateUserDto.username, mockcreateUserDto.email);
      expect(logger).toHaveBeenCalledTimes(1);
      expect(authService.signIn).toHaveBeenCalledWith({ usernameOrEmail: mockcreateUserDto.username, password: mockPassword });
      expect(result).toEqual(mockAccessToken);
    });
  });
  describe('resendVerificationAccount', () => {
    let user;
    let mockemailDto: EmailDto;
    beforeEach(async () => {
      mockemailDto = { email: 'test@test.com'};
      user = new User();
      user.username = 'test';
      user.email = 'test@test.com';
    });
    it('returns message resended email verification successfully', async () => {
      user.status = UserStatus.INACTIVO;
      usersService.getUserByEmail.mockResolvedValue(user);
      authService.sendEmailVerification = jest.fn().mockResolvedValue(true);
      const result = await authService.resendVerificationAccount(mockemailDto);
      expect(authService.sendEmailVerification).toHaveBeenCalledWith(user.username, mockemailDto.email);
      expect(result).toEqual({message: 'Healthy Dev le informa que se ha reenviado el email de verificación correctamente'});
    });
    it('throws an error as user not found', async () => {
      usersService.getUserByEmail.mockResolvedValue(null);
      authService.sendEmailVerification = jest.fn().mockResolvedValue(true);
      expect(authService.resendVerificationAccount(mockemailDto)).rejects.toThrow(NotFoundException);
      expect(authService.sendEmailVerification).not.toHaveBeenCalled();
    });
    it('throws an error as user was active', async () => {
      user.status = UserStatus.ACTIVO;
      usersService.getUserByEmail.mockResolvedValue(user);
      authService.sendEmailVerification = jest.fn().mockResolvedValue(true);
      expect(authService.resendVerificationAccount(mockemailDto)).rejects.toThrow(ConflictException);
    });
    it('throws an error the email not been sent', async () => {
      user.status = UserStatus.INACTIVO;
      usersService.getUserByEmail.mockResolvedValue(user);
      authService.sendEmailVerification = jest.fn().mockResolvedValue(false);
      expect(authService.resendVerificationAccount(mockemailDto)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('forgot password', () => {
    let user;
    let mockemailDto: EmailDto;
    beforeEach(async () => {
      mockemailDto = { email: 'test@test.com'};
      user = new User();
      user.username = 'test';
      user.email = 'test@test.com';
    });
    it('returns message sended email reset password successfully', async () => {
      usersService.getUserByEmail.mockResolvedValue(user);
      authService.sendEmailForgotPassword = jest.fn().mockResolvedValue(true);
      const result = await authService.forgotPassword(mockemailDto);
      expect(authService.sendEmailForgotPassword).toHaveBeenCalledWith(user.username, mockemailDto.email);
      expect(result).toEqual({message: 'Healthy Dev le informa que se ha enviado el email para crear nueva contraseña correctamente'});
    });
    it('throws an error as user not found', async () => {
      usersService.getUserByEmail.mockResolvedValue(null);
      authService.sendEmailForgotPassword = jest.fn().mockResolvedValue(true);
      expect(authService.forgotPassword(mockemailDto)).rejects.toThrow(NotFoundException);
      expect(authService.sendEmailForgotPassword).not.toHaveBeenCalled();
    });
    it('throws an error the email has not been sent', async () => {
      usersService.getUserByEmail.mockResolvedValue(user);
      authService.sendEmailForgotPassword = jest.fn().mockResolvedValue(false);
      expect(authService.forgotPassword(mockemailDto)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('verify account', () => {
    let user;
    beforeEach(async () => {
      user = new User();
      user.username = 'test';
    });
    it('return message user actived succesfully', async () => {
      user.status = UserStatus.INACTIVO;
      const mocktokenDto: TokenDto = {token: 'token'};
      tokensService.verifyEncryptedToken.mockResolvedValue({
        email: 'test@test.com',
        type: TokenType.VERIFY_EMAIL,  iat: 123,
        exp: 321,
      });
      usersService.getUserByEmail.mockResolvedValue(user);
      user.save = jest.fn();
      const result = await authService.verifyAccount(mocktokenDto);
      expect(user.save).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ message: 'Healthy Dev le informa que el usuario fue activado correctamente.' });
    });

    it('throw an error as not verify account because verifyEncryptedToken throw error', async () => {
      user.status = UserStatus.INACTIVO;
      const mocktokenDto: TokenDto = {token: 'token'};
      tokensService.verifyEncryptedToken.mockImplementation(() => {
        throw new Error();
      });
      usersService.getUserByEmail.mockResolvedValue(user);
      user.save = jest.fn();
      expect(authService.verifyAccount(mocktokenDto)).rejects.toThrow(UnauthorizedException);
    });
    it('throw an error as not verify account because token payload type not was verify email', async () => {
      user.status = UserStatus.INACTIVO;
      const mocktokenDto: TokenDto = {token: 'token'};
      tokensService.verifyEncryptedToken.mockResolvedValue({
        email: 'test@test.com',
        type: TokenType.RESET_PASSWORD,  iat: 123,
        exp: 321,
      });
      usersService.getUserByEmail.mockResolvedValue(user);
      user.save = jest.fn();
      expect(authService.verifyAccount(mocktokenDto)).rejects.toThrow(UnauthorizedException);
    });
    it('throws an error as user not found', async () => {
      const mocktokenDto: TokenDto = {token: 'token'};
      tokensService.verifyEncryptedToken.mockResolvedValue({
        email: 'test@test.com',
        type: TokenType.VERIFY_EMAIL,  iat: 123,
        exp: 321,
      });
      usersService.getUserByEmail.mockResolvedValue(null);
      user.save = jest.fn();
      expect(authService.verifyAccount(mocktokenDto)).rejects.toThrow(NotFoundException);
    });
    it('throws an error as user was not inactive', async () => {
      user.status = UserStatus.ACTIVO;
      const mocktokenDto: TokenDto = {token: 'token'};
      tokensService.verifyEncryptedToken.mockResolvedValue({
        email: 'test@test.com',
        type: TokenType.VERIFY_EMAIL,  iat: 123,
        exp: 321,
      });
      usersService.getUserByEmail.mockResolvedValue(user);
      user.save = jest.fn();
      expect(authService.verifyAccount(mocktokenDto)).rejects.toThrow(ConflictException);
    });

  });

  describe('sign in', () => {
    const mockAuthCredentialsDto: AuthCredentialsDto = {password: 'Test123456', usernameOrEmail: 'testUsername'};
    const mockUsername = 'testUsername';
    const mockAccessToken = 'accessToken';
    it('return access token sing in successfully', async () => {
      authService.validateUserPassword = jest.fn().mockResolvedValue(mockUsername);
      jwtService.sign.mockResolvedValue(mockAccessToken);
      const result = await authService.signIn(mockAuthCredentialsDto);
      expect(jwtService.sign).toHaveBeenCalledWith({username: mockUsername});
      expect(result).toEqual({accessToken: mockAccessToken});
    });

    it('throws an error as invalid credentials', async () => {
      authService.validateUserPassword = jest.fn().mockResolvedValue(null);
      jwtService.sign.mockResolvedValue(mockAccessToken);
      expect(authService.signIn(mockAuthCredentialsDto)).rejects.toThrow(UnauthorizedException);
    });
  });
 
  describe('validateUserPassword', () => {
    let user;
    beforeEach(async () => {
      user = new User();
      user.username = 'test';
      user.password = 'EncryptedPassword';
    });
    it('returns the username as validation is successful', async () => {
      const mockauthCredentialsDto: AuthCredentialsDto = {usernameOrEmail: 'test', password: 'Test123456'};
      Object.defineProperty(bcrypt, 'compare', {value: jest.fn().mockResolvedValue(true)});
      usersService.getUserByUsernameOrEmail.mockResolvedValue(user);
      expect(bcrypt.compare).not.toHaveBeenCalled();
      const result = await authService.validateUserPassword(mockauthCredentialsDto);
      expect(bcrypt.compare).toHaveBeenCalledWith(mockauthCredentialsDto.password, user.password);
      expect(result).toEqual(user.username);
    });
    it('returns null as user can not be found', async () => {
      const mockauthCredentialsDto: AuthCredentialsDto = {usernameOrEmail: 'test', password: 'Test123456'};
      Object.defineProperty(bcrypt, 'compare', {value: jest.fn().mockResolvedValue(false)});
      usersService.getUserByUsernameOrEmail.mockResolvedValue(null);
      expect(bcrypt.compare).not.toHaveBeenCalled();
      const result = await authService.validateUserPassword(mockauthCredentialsDto);
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(result).toEqual(null);
    });
    it('returns null as password is invalid', async () => {
      const mockauthCredentialsDto: AuthCredentialsDto = {usernameOrEmail: 'test', password: 'Test123456'};
      Object.defineProperty(bcrypt, 'compare', {value: jest.fn().mockResolvedValue(false)});
      usersService.getUserByUsernameOrEmail.mockResolvedValue(user);
      expect(bcrypt.compare).not.toHaveBeenCalled();
      const result = await authService.validateUserPassword(mockauthCredentialsDto);
      expect(bcrypt.compare).toHaveBeenCalledWith(mockauthCredentialsDto.password, user.password);
      expect(result).toEqual(null);
    });
  });

  describe('resetPassword', () => {
    let user: User;
    let mockNewPassword: NewPasswordDto;
    let mockTokenDto: TokenDto;
    const password = 'Test123456';
    Object.defineProperty(bcrypt, 'genSalt', {value: jest.fn().mockResolvedValue('salt')});
    Object.defineProperty(bcrypt, 'hash', {value: jest.fn().mockResolvedValue('hashed')});
    beforeEach(async () => {
      user = new User();
      user.username = 'test';
      user.password = 'EncryptedPassword';
      mockTokenDto = {token: 'token'};
      mockNewPassword = {password};
    });
    it('changed password successfully', async () => {
      const mockTokenPayload: TokenPayload = {
        email: 'test@test.com',
        type: TokenType.RESET_PASSWORD,
        iat: 123,
        exp: 321,
      };
      tokensService.verifyEncryptedToken.mockResolvedValue(mockTokenPayload);
      usersService.getUserByEmail.mockResolvedValue(user);
      usersService.changePassword.mockResolvedValue({
        message: 'Contraseña Cambiada con éxito.',
      });
      const result = await authService.resetPassword(mockNewPassword, mockTokenDto);
      expect(tokensService.verifyEncryptedToken).toHaveBeenCalledWith(mockTokenDto.token);
      expect(usersService.getUserByEmail).toHaveBeenCalledWith(mockTokenPayload.email);
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 'salt');
      expect(result).toEqual({
        message: 'Contraseña Cambiada con éxito.',
      });

    });
    it('throws an error by token invalid', async () => {
      tokensService.verifyEncryptedToken.mockImplementation(() => {throw new Error();});
      usersService.getUserByEmail.mockResolvedValue(user);
      expect(authService.resetPassword(mockNewPassword, mockTokenDto)).rejects.toThrow(UnauthorizedException);
    });
    it('throws an error by type token invalid', async () => {
      const mockTokenPayload: TokenPayload = {
        email: 'test@test.com',
        type: TokenType.VERIFY_EMAIL,
        iat: 123,
        exp: 321,
      };
      tokensService.verifyEncryptedToken.mockResolvedValue(mockTokenPayload);
      usersService.getUserByEmail.mockResolvedValue(user);
      usersService.changePassword.mockResolvedValue({
        message: 'Contraseña Cambiada con éxito.',
      });
      expect(authService.resetPassword(mockNewPassword, mockTokenDto)).rejects.toThrow(UnauthorizedException);
    });
    it('throws an error by user can not be found', async () => {
      const mockTokenPayload: TokenPayload = {
        email: 'test@test.com',
        type: TokenType.RESET_PASSWORD,
        iat: 123,
        exp: 321,
      };
      tokensService.verifyEncryptedToken.mockResolvedValue(mockTokenPayload);
      usersService.getUserByEmail.mockResolvedValue(null);
      expect(authService.resetPassword(mockNewPassword, mockTokenDto)).rejects.toThrow(NotFoundException);
    });
  });

});