import {MigrationInterface, QueryRunner} from "typeorm";

export class userAddColumns1598062217722 implements MigrationInterface {
    name = 'userAddColumns1598062217722'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "hasVerifiedEmail"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "twitter" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "instagram" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "status" character varying NOT NULL DEFAULT 'inactivo'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "instagram"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "twitter"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "hasVerifiedEmail" boolean NOT NULL DEFAULT false`);
    }

}
