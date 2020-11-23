import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from './card.entity';
import { CardRepository } from './card.repository';
import { GetCardsFilterDto } from './dto/get-cards.dto';
import { CardPreviewDto } from './dto/card-preview.dto';
import { CreateCardDto } from './dto/create-card.dto';
import { User } from '../users/user.entity';
import { UpdateCardDto } from './dto/update-card.dto';
import { ImageManagementService } from '../image-management/image-management.service';
import { CardCategoriesService } from '../card-categories/card-categories.service';
import { CardCategory } from '../card-categories/card-category.entity';

@Injectable()
export class CardsService {
  private logger = new Logger('CardsService');
  constructor(
    @InjectRepository(Card) private cardRepository: CardRepository,
    private imageManagementService: ImageManagementService,
    private cardCategoriesService: CardCategoriesService,
  ) {}

  async getCards(filterDto: GetCardsFilterDto): Promise<CardPreviewDto[]> {
    return this.cardRepository.getCards(filterDto);
  }

  async getCardById(id: number): Promise<Card> {
    return this.cardRepository.getCardById(id);
  }

  async createCard(createCardsDto: CreateCardDto, user: User): Promise<{ id: number }> {
    const { photo, categoryId } = createCardsDto;
    const cardCategory = await this.cardCategoriesService.getCardCategoryById(categoryId);
    if (!cardCategory) {
      throw new NotFoundException(`Healthy Dev no encontró una categoría con el id ${categoryId}`);
    }
    let photoUrl = this.imageManagementService.placeholderCardUrl;
    if (photo) {
      try {
        photoUrl = await this.imageManagementService.uploadImage(photo);
      } catch (error) {
        throw new InternalServerErrorException(
          'Healthy Dev no pudo guardar la imagen y cancelo creación.',
        );
      }
    }
    return this.cardRepository.createCard(createCardsDto, user, photoUrl, cardCategory);
  }

  async updateCard(updateCardDto: UpdateCardDto, user: User, id: number): Promise<Card> {
    const { categoryId } = updateCardDto;
    let cardCategory = {} as CardCategory;
    if (categoryId) {
      cardCategory = await this.cardCategoriesService.getCardCategoryById(categoryId);
      if (!cardCategory) {
        throw new NotFoundException(
          `Healthy Dev no encontró una categoría con el id ${categoryId}`,
        );
      }
    }
    const card = await this.cardRepository.findOne({ id, creator: user });
    if (!card) {
      throw new NotFoundException(`Healthy Dev no pudo modificar la card con el id ${id}`);
    }
    if (updateCardDto.photo) {
      try {
        updateCardDto.photo = await this.imageManagementService.uploadImage(updateCardDto.photo);
      } catch (error) {
        throw new InternalServerErrorException(
          'Healthy Dev no pudo guardar nueva imagen y cancelo cambios',
        );
      }
      if (card.photo) {
        try {
          await this.imageManagementService.deleteImage(card.photo);
        } catch (error) {
          this.logger.error(`Failed to delete image "${card.photo}"`);
        }
      }
    }
    return this.cardRepository.updateCard(updateCardDto, id, user, cardCategory);
  }

  async deleteCard(user: User, id: number): Promise<{ message: string }> {
    const card = await this.cardRepository.findOne({ id, creator: user });
    if (!card) {
      throw new NotFoundException(`Healthy Dev no pudo eliminar la card con el id ${id}`);
    }
    if (card.photo) {
      try {
        await this.imageManagementService.deleteImage(card.photo);
      } catch (error) {
        throw new InternalServerErrorException(
          'Healthy Dev no pudo eliminar imagen de card y cancelo eliminación',
        );
      }
    }
    return this.cardRepository.deleteCard(id, user);
  }

  async addLike(user: User, id: number): Promise<{ message: string }> {
    return this.cardRepository.addLike(user, id);
  }

  async deleteLike(user: User, id: number): Promise<{ message: string }> {
    return this.cardRepository.deleteLike(user, id);
  }
}
