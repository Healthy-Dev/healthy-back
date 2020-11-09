import { UserRepository } from './user.repository';
import { Test } from '@nestjs/testing';
import { CreateUserDto } from './dto/create-user.dto';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';

const mockCreateUserDto: CreateUserDto = {email: 'test@test.com', username: 'test', password: 'Test1234'}
const mockPhotoUrl: string = 'http://test.com/photo';
describe('UserRepository',()=>{
    let userRepository: UserRepository;

    beforeEach( async () => {
        const module = await Test.createTestingModule({
            providers: [
                UserRepository,
            ]
        }).compile();
        userRepository = await module.get<UserRepository>(UserRepository);
    });

    describe('createUser', () => {
        let save;
        beforeEach( async () => {
            save = jest.fn();
            userRepository.create = jest.fn().mockReturnValue({save});
        });
        it('created the user successfully', async () => {
            save.mockResolvedValue(undefined);
            expect(userRepository.createUser(mockCreateUserDto, mockPhotoUrl)).resolves.not.toThrow();
            expect(await userRepository.createUser(mockCreateUserDto, mockPhotoUrl)).toEqual({id: undefined});
        });
        it('throws a conflict exception as email already exists', () => {
            save.mockRejectedValue({code: '23505', detail: 'Ya existe la llave (email)=(test@test.com).'});
            expect(userRepository.createUser(mockCreateUserDto, mockPhotoUrl)).rejects.toThrow(ConflictException);
        });
        it('throws a conflict exception as username already exists', () => {
            save.mockRejectedValue({code: '23505', detail: 'Ya existe la llave (username)=(test).'});
            expect(userRepository.createUser(mockCreateUserDto, mockPhotoUrl)).rejects.toThrow(ConflictException);
        });
        it('throws a conflict exception as unhandled error code', () => {
            save.mockRejectedValue({code: '22222', detail: 'unknown'});
            expect(userRepository.createUser(mockCreateUserDto, mockPhotoUrl)).rejects.toThrow(InternalServerErrorException);
        });

    });
})