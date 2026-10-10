import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1710000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS organizations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR NOT NULL,
        slug VARCHAR,
        "createdAt" TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR NOT NULL UNIQUE,
        name VARCHAR NOT NULL,
        "avatarUrl" VARCHAR,
        "createdAt" TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS projects (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR NOT NULL,
        description VARCHAR,
        "createdAt" TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS design_files (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR NOT NULL,
        "projectId" UUID NOT NULL,
        "previewUrl" VARCHAR,
        "createdAt" TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS artboards (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "designFileId" UUID NOT NULL,
        name VARCHAR NOT NULL,
        "worldX" DOUBLE PRECISION DEFAULT 0,
        "worldY" DOUBLE PRECISION DEFAULT 0,
        "previewUrl" VARCHAR
      );

      CREATE TABLE IF NOT EXISTS layer_nodes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "artboardId" UUID NOT NULL,
        "parentId" UUID,
        name VARCHAR NOT NULL,
        type VARCHAR NOT NULL,
        x DOUBLE PRECISION DEFAULT 0,
        y DOUBLE PRECISION DEFAULT 0,
        width DOUBLE PRECISION DEFAULT 0,
        height DOUBLE PRECISION DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS design_tokens (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR NOT NULL,
        value VARCHAR NOT NULL,
        "fileId" UUID NOT NULL
      );

      CREATE TABLE IF NOT EXISTS comments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "artboardId" UUID NOT NULL,
        "authorId" UUID NOT NULL,
        content VARCHAR NOT NULL,
        resolved BOOLEAN DEFAULT FALSE,
        "createdAt" TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS assets (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR NOT NULL,
        url VARCHAR NOT NULL,
        "designFileId" UUID NOT NULL
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS assets;`);
    await queryRunner.query(`DROP TABLE IF EXISTS comments;`);
    await queryRunner.query(`DROP TABLE IF EXISTS design_tokens;`);
    await queryRunner.query(`DROP TABLE IF EXISTS layer_nodes;`);
    await queryRunner.query(`DROP TABLE IF EXISTS artboards;`);
    await queryRunner.query(`DROP TABLE IF EXISTS design_files;`);
    await queryRunner.query(`DROP TABLE IF EXISTS projects;`);
    await queryRunner.query(`DROP TABLE IF EXISTS users;`);
    await queryRunner.query(`DROP TABLE IF EXISTS organizations;`);
  }
}
