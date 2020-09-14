import {MigrationInterface, QueryRunner} from "typeorm";

export class addCategoryTable1600038259860 implements MigrationInterface {
    name = 'addCategoryTable1600038259860'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "card" RENAME COLUMN "category" TO "categoryId"`);
        await queryRunner.query(`CREATE TABLE "card_category" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_c5f733d08ff5b5dea41e40f7dda" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_name" ON "card_category" ("name") `);
        await queryRunner.query(`ALTER TABLE "card" DROP COLUMN "categoryId"`);
        await queryRunner.query(`ALTER TABLE "card" ADD "categoryId" integer`);
        await queryRunner.query(`ALTER TABLE "card" ADD CONSTRAINT "FK_14973cece7b39a867065f6c3fda" FOREIGN KEY ("categoryId") REFERENCES "card_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "card" DROP CONSTRAINT "FK_14973cece7b39a867065f6c3fda"`);
        await queryRunner.query(`ALTER TABLE "card" DROP COLUMN "categoryId"`);
        await queryRunner.query(`ALTER TABLE "card" ADD "categoryId" character varying NOT NULL DEFAULT 'Varios'`);
        await queryRunner.query(`DROP INDEX "idx_name"`);
        await queryRunner.query(`DROP TABLE "card_category"`);
        await queryRunner.query(`ALTER TABLE "card" RENAME COLUMN "categoryId" TO "category"`);
    }

}
