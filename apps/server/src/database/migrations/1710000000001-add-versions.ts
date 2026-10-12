import { MigrationInterface, QueryRunner } from "typeorm";

export class AddVersions1710000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS versions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "fileId" UUID NOT NULL,
        label VARCHAR NOT NULL DEFAULT 'Auto Save',
        "snapshotData" JSONB NOT NULL DEFAULT '{}',
        "createdAt" TIMESTAMP DEFAULT NOW()
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS versions;`);
  }
}
