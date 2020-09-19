import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Index, OneToMany } from 'typeorm';
import { Card } from '../cards/card.entity';

@Index('idx_name', ['name'], {})
@Entity()
export class CardCategory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(
    type => Card,
    card => card.category,
  )
  cards: Card[];
}
