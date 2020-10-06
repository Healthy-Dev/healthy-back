import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './strategy/jwt-payload.interface';
import { NewPasswordDto } from './dto/new-password.dto';
import { TokensService } from '../tokens/tokens.service';
import { UserStatus } from '../users/user-status.enum';
import { TokenPayload, TokenPayloadBase } from '../tokens/dto/token-payload.dto';
import { TokenType } from '../tokens/token-type.enum';
import { Logger } from '@nestjs/common';
import { MailTemplatesService } from '../mail-templates/mail-templates.service';
import { TokenDto } from './dto/token.dto';
import { EmailDto } from './dto/resend-verification.dto';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailTemplatesService: MailTemplatesService,
    private readonly tokensService: TokensService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<{ accessToken: string }> {
    const { username, password, email } = createUserDto;
    const salt = await bcrypt.genSalt();
    createUserDto.password = await bcrypt.hash(createUserDto.password, salt);
    const userId = await this.usersService.createUser(createUserDto);
    if (!userId) {
      throw new InternalServerErrorException(
        'Healthy Dev no pudo registrar su usuario en este momento, intentelo nuevamente más tarde',
      );
    }
    try {
      this.sendEmailVerification(username, email);
    } catch (error) {
      this.logger.error(`Error sending verification email in sign up: ${error}`);
    }
    const authCredentialsDto: AuthCredentialsDto = { usernameOrEmail: username, password };
    return this.signIn(authCredentialsDto);
  }

  async resendVerificationAccount(emailDto: EmailDto): Promise<{ message: string }> {
    const { email } = emailDto;
    const user = await this.usersService.getUserByEmail(email);
    if (!user) {
      throw new NotFoundException('Healthy Dev no encontró un usuario registrado con ese email');
    }
    if (user.status !== UserStatus.INACTIVO) {
      throw new ConflictException('Healthy Dev le informa que la cuenta ya esta activa');
    }
    const nameOrUsername = user.name ? user.name : user.username;
    const sent = await this.sendEmailVerification(nameOrUsername, email);
    if (!sent) {
      throw new InternalServerErrorException(
        'Healthy Dev le informa que no se ha podido enviar email. Inténtelo nuevamente más tarde',
      );
    }
    return {
      message: 'Healthy Dev le informa que se ha reenviado el email de verificación correctamente',
    };
  }

  async forgotPassword(emailDto: EmailDto): Promise<{ message: string }> {
    const { email } = emailDto;
    const user = await this.usersService.getUserByEmail(email);
    if (!user) {
      throw new NotFoundException('Healthy Dev no encontró un usuario registrado con ese email');
    }
    const nameOrUsername = user.name ? user.name : user.username;
    const sent = await this.sendEmailForgotPassword(nameOrUsername, email);
    if (!sent) {
      throw new InternalServerErrorException(
        'Healthy Dev le informa que no se ha podido enviar email. Inténtelo nuevamente más tarde',
      );
    }
    return {
      message:
        'Healthy Dev le informa que se ha enviado el email para crear nueva contraseña correctamente',
    };
  }

  async verifyAccount(tokenDto: TokenDto): Promise<{ message: string }> {
    let tokenPayload: TokenPayload;
    try {
      tokenPayload = await this.tokensService.verifyEncryptedToken(tokenDto.token);
    } catch (error) {
      throw new UnauthorizedException(
        'Healthy Dev le informa que no ha podido verificar cuenta, por favor solicite nuevamente envio de verificación',
      );
    }
    if (tokenPayload.type !== TokenType.VERIFY_EMAIL) {
      throw new UnauthorizedException(
        'Healthy Dev le informa que no ha podido verificar cuenta, por favor solicite nuevamente envio de verificación',
      );
    }
    const user = await this.usersService.getUserByEmail(tokenPayload.email);
    if (!user) {
      throw new NotFoundException('Healthy Dev no encontró un usuario registrado con ese email');
    }
    if (user.status !== UserStatus.INACTIVO) {
      throw new ConflictException('Healthy Dev le informa que la cuenta ya esta activa');
    }
    user.status = UserStatus.ACTIVO;
    await user.save();
    return { message: 'Healthy Dev le informa que el usuario fue activado correctamente.' };
  }

  async sendEmailVerification(nameOrUsername: string, email: string): Promise<boolean> {
    const tokenPayloadBase: TokenPayloadBase = { type: TokenType.VERIFY_EMAIL, email };
    const activationToken = await this.tokensService.getEncryptedToken(tokenPayloadBase);
    const activationLink = `${process.env.CLIENT_URL_VERIFICATION}?token=${activationToken}`;
    let sent;
    try {
      sent = await this.mailTemplatesService.sendMailVerify(email, nameOrUsername, activationLink);
    } catch (error) {
      this.logger.error(`Failed send mail ${error}`);
      return false;
    }
    return sent;
  }

  async sendEmailForgotPassword(nameOrUsername: string, email: string): Promise<boolean> {
    const tokenPayloadBase: TokenPayloadBase = { type: TokenType.RESET_PASSWORD, email };
    const resetPasswordToken = await this.tokensService.getEncryptedToken(tokenPayloadBase);
    const resetPasswordLink = `${process.env.CLIENT_URL_RESET_PASSWORD}?token=${resetPasswordToken}`;
    let sent;
    try {
      sent = await this.mailTemplatesService.sendMailResetPassword(
        email,
        nameOrUsername,
        resetPasswordLink,
      );
    } catch (error) {
      this.logger.error(`Failed send mail ${error}`);
      return false;
    }
    return sent;
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
    const username = await this.validateUserPassword(authCredentialsDto);
    if (!username) {
      throw new UnauthorizedException('Verifique los datos ingresados');
    }
    const payload: JwtPayload = { username };
    const accessToken = await this.jwtService.sign(payload);
    return { accessToken };
  }

  async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    const { usernameOrEmail, password } = authCredentialsDto;
    const user = await this.usersService.getUserByUsernameOrEmail(usernameOrEmail);
    if (user && (await await bcrypt.compare(password, user.password))) {
      return user.username;
    }
    return null;
  }

  async resetPassword(
    newPassword: NewPasswordDto,
    tokenDto: TokenDto,
  ): Promise<{ message: string }> {
    let tokenPayload: TokenPayload;
    try {
      tokenPayload = await this.tokensService.verifyEncryptedToken(tokenDto.token);
    } catch (error) {
      throw new UnauthorizedException(
        'Healthy Dev le informa que no ha podido cambiar la contraseña, por favor solicite nuevamente envio para realizar nueva contraseña',
      );
    }
    if (tokenPayload.type !== TokenType.RESET_PASSWORD) {
      throw new UnauthorizedException(
        'Healthy Dev le informa que no ha podido cambiar la contraseña, por favor solicite nuevamente envio para realizar nueva contraseña',
      );
    }
    const user = await this.usersService.getUserByEmail(tokenPayload.email);
    if (!user) {
      throw new NotFoundException('Healthy Dev no encontró un usuario registrado con ese email');
    }
    const salt = await bcrypt.genSalt();
    newPassword.password = await bcrypt.hash(newPassword.password, salt);
    return this.usersService.changePassword(newPassword, user.username);
  }

  async changePassword(
    newPassword: NewPasswordDto,
    username: string,
  ): Promise<{ message: string }> {
    const salt = await bcrypt.genSalt();
    newPassword.password = await bcrypt.hash(newPassword.password, salt);
    return this.usersService.changePassword(newPassword, username);
  }
}
