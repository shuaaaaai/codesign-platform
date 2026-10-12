import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { DataSource } from "typeorm";

export function normalizePort(port?: string): number {
  const value = Number(port ?? "4000");
  return Number.isInteger(value) && value > 0 ? value : 4000;
}

export async function bootstrap() {
  const { AppModule } = await import("./app.module");
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.APP_URL ?? "http://localhost:3000",
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const dataSource = app.get(DataSource);
  await dataSource.runMigrations();
  await app.listen(normalizePort(process.env.APP_PORT));
  return app;
}

if (require.main === module) {
  void bootstrap();
}
