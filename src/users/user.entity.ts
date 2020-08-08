import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Card } from 'src/cards/card.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  profilePhoto: string;

  @Column({default: false})
  hasVerifiedEmail: boolean;

  @Column({default: 'User'})
  role: string;

  @OneToMany(type => Card, card => card.creator)
  cards: Card[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
