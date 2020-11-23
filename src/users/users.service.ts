import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { NewPasswordDto } from '../auth/dto/new-password.dto';
import { UserPreviewDto } from './dto/user-preview.dto';
import { ImageManagementService } from '../image-management/image-management.service';
import { TokenDto } from '../auth/dto/token.dto';
import { TokenPayload } from '../tokens/dto/token-payload.dto';
import { TokensService } from '../tokens/tokens.service';
import { TokenType } from '../tokens/token-type.enum';

@Injectable()
export class UsersService {
  private logger = new Logger('UsersService');
  constructor(
    @InjectRepository(User)
    private userRepository: UserRepository,
    private imageManagementService: ImageManagementService,
    private readonly tokensService: TokensService,
  ) {}

  async getUserByUsername(username: string): Promise<User | undefined> {
    return await this.userRepository.findOne({ username });
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return await this.userRepository.findOne({ email });
  }

  async getUserByUsernameOrEmail(usernameOrEmail: string): Promise<User> {
    return await this.userRepository.getUserByUsernameOrEmail(usernameOrEmail);
  }

  async createUser(createUserDto: CreateUserDto, active?: boolean): Promise<{ id: number }> {
    const photoUrl = this.imageManagementService.placeholderUserUrl;
    return this.userRepository.createUser(createUserDto, photoUrl, active ? active : false);
  }

  async getUser(username: string): Promise<{ user: {} }> {
    const profile = await this.getUserByUsername(username);
    if (!profile) {
      throw new UnauthorizedException('Verifique los datos ingresados');
    }
    return {
      user: {
        id: profile.id,
        email: profile.email,
        username: profile.username,
        name: profile.name,
        profilePhoto: profile.profilePhoto,
        twitter: profile.twitter,
        instagram: profile.instagram,
        status: profile.status,
        role: profile.role,
      },
    };
  }

  async getUserById(id: number): Promise<UserPreviewDto> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'name', 'profilePhoto'],
    });
    if (!user) {
      throw new NotFoundException(
        `Healthy Dev le informa que el usuario con id "${id}" no fue encontrado`,
      );
    }
    return user;
  }

  async updateUser(updateData: UpdateUserDto, username: string): Promise<{ message: string }> {
    if (updateData.profilePhoto) {
      const { profilePhoto } = await this.userRepository.findOne({ username });
      try {
        updateData.profilePhoto = await this.imageManagementService.uploadImage(
          updateData.profilePhoto,
        );
      } catch (error) {
        throw new InternalServerErrorException(
          'Healthy Dev no pudo guardar nueva imagen de perfil y cancelo cambios',
        );
      }
      if (profilePhoto) {
        try {
          await this.imageManagementService.deleteImage(profilePhoto);
        } catch (error) {
          this.logger.error(`Failed to delete image "${profilePhoto}"`);
        }
      }
    }
    return this.userRepository.updateUser(updateData, username);
  }

  async changePassword(
    newPassword: NewPasswordDto,
    username: string,
  ): Promise<{ message: string }> {
    return this.userRepository.changePassword(newPassword, username);
  }

  async deleteUserByToken(
    tokenDto: TokenDto,
  ): Promise<{ message: string }> {
    const messageTokenInvalid = 'Healthy Dev le informa que no ha podido eliminar cuenta, token no valido';
    let tokenPayload: TokenPayload;
    try {
      tokenPayload = await this.tokensService.verifyEncryptedToken(tokenDto.token);
    } catch (error) {
      throw new UnauthorizedException(messageTokenInvalid);
    }
    if (tokenPayload.type !== TokenType.DELETE_USER) {
      throw new UnauthorizedException(messageTokenInvalid);
    }
    const user = await this.getUserByEmail(tokenPayload.email);
    if (!user) {
      throw new NotFoundException('Healthy Dev no encontró un usuario registrado con ese email');
    }
    try {
      user.remove();
    } catch (error) {
      this.logger.error(`Failed to delete user ${user.id}`);
      throw new InternalServerErrorException('Healthy Dev no pudo eliminar cuenta, intentelo nuevamente');
    }
    return {message: 'Healthy Dev le informa que el usuario ha sido eliminado'};
  }
}
