import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column,
} from 'typeorm';

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
}
