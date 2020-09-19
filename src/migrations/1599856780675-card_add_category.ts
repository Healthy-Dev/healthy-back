import {MigrationInterface, QueryRunner} from "typeorm";

export class cardAddCategory1599856780675 implements MigrationInterface {
    name = 'cardAddCategory1599856780675'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "card" ADD "category" character varying NOT NULL DEFAULT 'Varios'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "card" DROP COLUMN "category"`);
    }

}
