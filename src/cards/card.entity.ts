import { CardCategory } from '../card-categories/card-category.entity';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  JoinTable,
  ManyToMany,
  RelationCount,
} from 'typeorm';
import { User } from '../users/user.entity';

@Index('idx_card_search', ['title', 'description'], {})
@Entity()
export class Card extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ nullable: true })
  photo: string;

  @Column({ nullable: true })
  externalUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(
    type => CardCategory,
    category => category.id,
  )
  category: CardCategory;

  @ManyToOne(
    type => User,
    creator => creator.username,
  )
  creator: User;

  @ManyToMany(
    type => User,
    user => user.likes,
    { eager: true },
  )
  @JoinTable()
  likesBy: User[];

  @RelationCount((card: Card) => card.likesBy)
  likesCount: number;
}
