import {MigrationInterface, QueryRunner} from "typeorm";

export class cards1588989281835 implements MigrationInterface {
    name = 'cards1588989281835'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "card" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" text NOT NULL, "photo" character varying, "externalUrl" character varying, CONSTRAINT "PK_9451069b6f1199730791a7f4ae4" PRIMARY KEY ("id"))`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "card"`, undefined);
    }

}
