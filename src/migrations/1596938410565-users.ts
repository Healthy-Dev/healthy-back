import {MigrationInterface, QueryRunner} from "typeorm";

export class users1596938410565 implements MigrationInterface {
    name = 'users1596938410565'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "name" character varying, "profilePhoto" character varying, "hasVerifiedEmail" boolean NOT NULL DEFAULT false, "role" character varying NOT NULL DEFAULT 'User', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "card" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "card" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "card" ADD "creatorId" integer`);
        await queryRunner.query(`CREATE INDEX "idx_card_search" ON "card" ("title", "description") `);
        await queryRunner.query(`ALTER TABLE "card" ADD CONSTRAINT "FK_f2ea75a6729b657d16f6dde6a6c" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "card" DROP CONSTRAINT "FK_f2ea75a6729b657d16f6dde6a6c"`);
        await queryRunner.query(`DROP INDEX "idx_card_search"`);
        await queryRunner.query(`ALTER TABLE "card" DROP COLUMN "creatorId"`);
        await queryRunner.query(`ALTER TABLE "card" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "card" DROP COLUMN "createdAt"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
