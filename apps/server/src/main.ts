import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";

export function normalizePort(port?: string): number {
  const value = Number(port ?? "4000");
  return Number.isInteger(value) && value > 0 ? value : 4000;
}

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.listen(normalizePort(process.env.APP_PORT));
  return app;
}

if (require.main === module) {
  void bootstrap();
}
