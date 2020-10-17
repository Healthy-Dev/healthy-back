import {MigrationInterface, QueryRunner} from "typeorm";

export class userAddPasswordChangedAt1602900583337 implements MigrationInterface {
    name = 'userAddPasswordChangedAt1602900583337'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "passwordChangedAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "passwordChangedAt"`);
    }

}
