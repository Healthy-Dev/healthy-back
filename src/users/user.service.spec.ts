import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, InternalServerErrorException, Logger } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRepository } from './user.repository';
import { ImageManagementService } from '../image-management/image-management.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';

const mockRepository = () => ({
  findOne: jest.fn(),
  updateUser: jest.fn(),
});
const mockImageManagementService = () => ({
  uploadImage: jest.fn(),
  deleteImage: jest.fn(),
  placeholderUserUrl: 'placeholderImage',
});

describe('UsersService', () => {
  let service: UsersService;
  let repository;
  let imageManagementService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService,
      {provide: UserRepository, useFactory: mockRepository},
      {provide: ImageManagementService, useFactory: mockImageManagementService},
    ],
    }).compile();
    service = module.get<UsersService>(UsersService);
    repository = module.get<UserRepository>(UserRepository);
    imageManagementService = module.get<ImageManagementService>(ImageManagementService);
  });
  /*
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
  */
  // - falla no salva photo
  // exito con foto
  // exito sin foto - no hace nada
  // exito con foto falla delete foto
  const mockUsername = 'usernameTest';
  describe('updateUser', () => {
    const id = 99;
    it('throws an error as image not save with photo', async () => {
      const mockupdateUserDto: UpdateUserDto = {name: 'name', profilePhoto: 'photo', twitter: 'twitter', instagram: 'instagram'};
      imageManagementService.uploadImage.mockRejectedValue(new Error());
      const mockUser: User = new User();
      mockUser.id = id;
      mockUser.profilePhoto = 'urlPhoto';
      repository.findOne.mockResolvedValue(mockUser);
      expect(service.updateUser(mockupdateUserDto, mockUsername)).rejects.toThrow(InternalServerErrorException);
    });

    it('updated user with profile photo successfully', async () => {
      const mockPhoto = 'aphoto';
      const mockupdateUserDto: UpdateUserDto = {name: 'name', profilePhoto: mockPhoto, twitter: 'twitter', instagram: 'instagram'};
      const mockResult = {message: 'User updated'};
      const mockResultUploadImage = 'urlimage';
      const mockUser: User = new User();
      mockUser.id = id;
      mockUser.profilePhoto = 'urlPhoto';
      repository.findOne.mockResolvedValue(mockUser);
      imageManagementService.uploadImage.mockResolvedValue(mockResultUploadImage);
      imageManagementService.deleteImage.mockResolvedValue(true);
      repository.updateUser.mockResolvedValue(mockResult);
      expect(imageManagementService.uploadImage).not.toHaveBeenCalled();
      expect(repository.updateUser).not.toHaveBeenCalled();
      const result = await service.updateUser(mockupdateUserDto, mockUsername);
      expect(imageManagementService.uploadImage).toHaveBeenCalledWith(mockPhoto);
      expect(repository.updateUser).toHaveBeenCalledWith(mockupdateUserDto, mockUsername);
      expect(result).toEqual(mockResult);
    });

    it('updated user without profile photo successfully', async () => {
      const mockPhoto = '';
      const mockupdateUserDto: UpdateUserDto = {name: 'name', profilePhoto: mockPhoto, twitter: 'twitter', instagram: 'instagram'};
      const mockResult = {message: 'user updated'};
      const mockResultUploadImage = 'urlimage';
      const mockResultGetCardCategoryById = {id: 1, name: 'name'};
      const mockUser: User = new User();
      mockUser.id = id;
      mockUser.profilePhoto = 'urlPhoto';
      repository.findOne.mockResolvedValue(mockUser);
      imageManagementService.uploadImage.mockResolvedValue(mockResultUploadImage);
      imageManagementService.deleteImage.mockResolvedValue(true);
      repository.updateUser.mockResolvedValue(mockResult);
      expect(imageManagementService.uploadImage).not.toHaveBeenCalled();
      expect(repository.updateUser).not.toHaveBeenCalled();
      const result = await service.updateUser(mockupdateUserDto, mockUsername);
      expect(imageManagementService.uploadImage).not.toHaveBeenCalled();
      expect(repository.updateUser).toHaveBeenCalledWith(mockupdateUserDto, mockUsername);
      expect(result).toEqual(mockResult);
    });
    it('updated user with photo successfully but logger error delete photo', async () => {
      const mockPhoto = 'aphoto';
      const mockupdateUserDto: UpdateUserDto = {name: 'name', profilePhoto: mockPhoto, twitter: 'twitter', instagram: 'instagram'};
      const mockResult = {message: 'User updated'};
      const mockResultUploadImage = 'urlimage';
      const mockUser: User = new User();
      mockUser.id = id;
      mockUser.profilePhoto = 'urlPhoto';
      repository.findOne.mockResolvedValue(mockUser);
      imageManagementService.uploadImage.mockResolvedValue(mockResultUploadImage);
      imageManagementService.deleteImage.mockImplementation(() => {
        throw new Error();
      });
      const loggerError = Logger.prototype.error = jest.fn();
      repository.updateUser.mockResolvedValue(mockResult);
      expect(imageManagementService.uploadImage).not.toHaveBeenCalled();
      expect(repository.updateUser).not.toHaveBeenCalled();
      const result = await service.updateUser(mockupdateUserDto, mockUsername);
      expect(imageManagementService.uploadImage).toHaveBeenCalledWith(mockPhoto);
      expect(loggerError).toHaveBeenCalledTimes(1);
      expect(repository.updateUser).toHaveBeenCalledWith(mockupdateUserDto, mockUsername);
      expect(result).toEqual(mockResult);
    });
  });
});