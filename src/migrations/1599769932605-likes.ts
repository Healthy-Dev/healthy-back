import {MigrationInterface, QueryRunner} from "typeorm";

export class likes1599769932605 implements MigrationInterface {
    name = 'likes1599769932605'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "card_likes_by_user" ("cardId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_06d2e9c9dcb232daa02507a9645" PRIMARY KEY ("cardId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_3fdfb1f6b4f7ddcbdddb10dac8" ON "card_likes_by_user" ("cardId") `);
        await queryRunner.query(`CREATE INDEX "IDX_57ce7f986134cabe26b38dafbe" ON "card_likes_by_user" ("userId") `);
        await queryRunner.query(`ALTER TABLE "card_likes_by_user" ADD CONSTRAINT "FK_3fdfb1f6b4f7ddcbdddb10dac80" FOREIGN KEY ("cardId") REFERENCES "card"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "card_likes_by_user" ADD CONSTRAINT "FK_57ce7f986134cabe26b38dafbef" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "card_likes_by_user" DROP CONSTRAINT "FK_57ce7f986134cabe26b38dafbef"`);
        await queryRunner.query(`ALTER TABLE "card_likes_by_user" DROP CONSTRAINT "FK_3fdfb1f6b4f7ddcbdddb10dac80"`);
        await queryRunner.query(`DROP INDEX "IDX_57ce7f986134cabe26b38dafbe"`);
        await queryRunner.query(`DROP INDEX "IDX_3fdfb1f6b4f7ddcbdddb10dac8"`);
        await queryRunner.query(`DROP TABLE "card_likes_by_user"`);
    }

}
